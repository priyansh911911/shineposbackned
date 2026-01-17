const Restaurant = require('../models/Restaurant');

const STANDARD_PLAN = {
  name: 'standard',
  displayName: 'Standard Plan',
  price: 1499,
  duration: 30,
  features: [
    'Unlimited orders',
    'Unlimited staff members',
    'Unlimited menu items',
    'Full POS system access',
    'Kitchen display system',
    'Order management',
    'Staff management',
    'Analytics & reports',
    'Email support'
  ]
};

// Get subscription plan
const getSubscriptionPlans = async (req, res) => {
  try {
    res.json({ plans: [STANDARD_PLAN] });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription plans' });
  }
};

// Subscribe to a plan
const subscribeToPlan = async (req, res) => {
  try {
    const { restaurantId, paymentMethod, transactionId } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + STANDARD_PLAN.duration);

    restaurant.subscriptionPlan = STANDARD_PLAN.name;
    restaurant.subscriptionStartDate = startDate;
    restaurant.subscriptionEndDate = endDate;
    restaurant.paymentStatus = 'paid';
    restaurant.paymentHistory.push({
      planName: STANDARD_PLAN.displayName,
      amount: STANDARD_PLAN.price,
      paymentMethod,
      transactionId,
      status: 'paid',
      paidAt: new Date()
    });

    await restaurant.save();

    res.json({ 
      message: 'Subscription activated successfully',
      subscription: {
        plan: STANDARD_PLAN.name,
        startDate,
        endDate
      }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Failed to activate subscription' });
  }
};

// Get restaurant subscription status
const getSubscriptionStatus = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const now = new Date();
    const endDate = restaurant.subscriptionEndDate ? new Date(restaurant.subscriptionEndDate) : null;
    const isExpired = (endDate && endDate < now) || ['expired', 'cancelled'].includes(restaurant.paymentStatus);

    res.json({
      subscription: {
        plan: restaurant.subscriptionPlan,
        startDate: restaurant.subscriptionStartDate,
        endDate: restaurant.subscriptionEndDate,
        paymentStatus: restaurant.paymentStatus,
        isExpired,
        daysRemaining: endDate && !isExpired
          ? Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
          : 0
      }
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
};

// Cancel subscription (Super Admin only)
const cancelSubscription = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    restaurant.subscriptionEndDate = new Date();
    restaurant.paymentStatus = 'cancelled';
    await restaurant.save();

    res.json({ 
      message: 'Subscription cancelled successfully',
      restaurant: {
        id: restaurant._id,
        name: restaurant.restaurantName,
        subscriptionStatus: 'cancelled'
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

// Renew subscription (Restaurant Admin)
const renewSubscription = async (req, res) => {
  try {
    const { restaurantId, paymentMethod, transactionId } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const now = new Date();
    const currentEndDate = restaurant.subscriptionEndDate ? new Date(restaurant.subscriptionEndDate) : now;
    
    // If subscription is still active, extend from current end date, otherwise start from now
    const startDate = currentEndDate > now ? currentEndDate : now;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + STANDARD_PLAN.duration);

    restaurant.subscriptionStartDate = now;
    restaurant.subscriptionEndDate = endDate;
    restaurant.paymentStatus = 'paid';
    restaurant.paymentHistory.push({
      planName: STANDARD_PLAN.displayName,
      amount: STANDARD_PLAN.price,
      paymentMethod,
      transactionId,
      status: 'paid',
      paidAt: new Date()
    });

    await restaurant.save();

    res.json({ 
      message: 'Subscription renewed successfully',
      subscription: {
        plan: STANDARD_PLAN.name,
        startDate: now,
        endDate
      }
    });
  } catch (error) {
    console.error('Renew subscription error:', error);
    res.status(500).json({ error: 'Failed to renew subscription' });
  }
};

module.exports = {
  getSubscriptionPlans,
  subscribeToPlan,
  getSubscriptionStatus,
  cancelSubscription,
  renewSubscription
};
