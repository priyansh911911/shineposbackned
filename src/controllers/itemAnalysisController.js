const TenantModelFactory = require('../models/TenantModelFactory');
const Restaurant = require('../models/Restaurant');

exports.getItemAnalysis = async (req, res) => {
  try {
    const { startDate, endDate, dateRange } = req.query;
    const restaurantSlug = req.user.restaurantSlug;
    
    const Order = TenantModelFactory.getOrderModel(restaurantSlug);
    const Menu = TenantModelFactory.getMenuItemModel(restaurantSlug);
    
    // Build date filter
    let dateFilter = {};
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch(dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          dateFilter = { createdAt: { $gte: filterDate } };
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          dateFilter = { createdAt: { $gte: filterDate } };
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          dateFilter = { createdAt: { $gte: filterDate } };
          break;
        case 'custom':
          if (startDate && endDate) {
            dateFilter = {
              createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
              }
            };
          }
          break;
      }
    }
    
    // Fetch orders with date filter
    const orders = await Order.find(dateFilter);
    
    // Fetch all menu items with category and margin
    const menuItems = await Menu.find().populate('categoryID', 'name');
    const menuMap = {};
    menuItems.forEach(item => {
      menuMap[item.itemName] = {
        category: item.categoryID?.name || 'Uncategorized',
        marginCost: (item.marginCostPercentage || 40) / 100
      };
    });
    
    // Aggregate item data
    const itemMap = {};
    
    orders.forEach(order => {
      order.items?.forEach(item => {
        const itemName = item.name;
        const menuInfo = menuMap[itemName] || { category: 'Uncategorized', marginCost: 0.4 };
        
        if (!itemMap[itemName]) {
          itemMap[itemName] = {
            name: itemName,
            category: menuInfo.category,
            marginCostPercentage: Math.round(menuInfo.marginCost * 100),
            quantity: 0,
            revenue: 0,
            cost: 0,
            profit: 0,
            margin: 0
          };
        }
        
        const itemTotal = item.itemTotal || (item.quantity * (item.price || item.basePrice || 0));
        const itemCost = itemTotal * menuInfo.marginCost;
        
        itemMap[itemName].quantity += item.quantity;
        itemMap[itemName].revenue += itemTotal;
        itemMap[itemName].cost += itemCost;
        itemMap[itemName].profit += (itemTotal - itemCost);
      });
      
      // Include extra items
      order.extraItems?.forEach(item => {
        const itemName = item.name;
        const menuInfo = menuMap[itemName] || { category: 'Extra Items', marginCost: 0.4 };
        
        if (!itemMap[itemName]) {
          itemMap[itemName] = {
            name: itemName,
            category: menuInfo.category,
            marginCostPercentage: Math.round(menuInfo.marginCost * 100),
            quantity: 0,
            revenue: 0,
            cost: 0,
            profit: 0,
            margin: 0
          };
        }
        
        const itemTotal = item.total || (item.quantity * item.price);
        const itemCost = itemTotal * menuInfo.marginCost;
        
        itemMap[itemName].quantity += item.quantity;
        itemMap[itemName].revenue += itemTotal;
        itemMap[itemName].cost += itemCost;
        itemMap[itemName].profit += (itemTotal - itemCost);
      });
    });
    
    // Calculate margins and convert to array
    const items = Object.values(itemMap).map(item => ({
      ...item,
      margin: item.marginCostPercentage
    }));
    
    res.json({
      success: true,
      items,
      totalItems: items.length,
      totalRevenue: items.reduce((sum, item) => sum + item.revenue, 0),
      totalProfit: items.reduce((sum, item) => sum + item.profit, 0)
    });
    
  } catch (error) {
    console.error('Item analysis error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch item analysis',
      error: error.message 
    });
  }
};
