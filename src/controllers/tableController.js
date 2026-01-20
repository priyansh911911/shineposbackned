const createTable = async (req, res) => {
    try {
        const { tableNumber, capacity, location, status } = req.body;
        const Table = req.tenantModels.Table;
        
        const existingTable = await Table.findOne({ tableNumber });
        if (existingTable) {
            return res.status(400).json({ error: 'Table number already exists' });
        }

        const table = new Table({ tableNumber, capacity, location, status });
        await table.save();
        
        res.status(201).json({ message: 'Table created successfully', table });
    } catch (error) {
        console.error('Create table error:', error);
        res.status(500).json({ error: 'Failed to create table' });
    }
};

const getTables = async (req, res) => {
    try {
        const Table = req.tenantModels.Table;
        const { status, location, isActive } = req.query;
        
        let filter = {};
        if (status) filter.status = status;
        if (location) filter.location = location;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        
        const tables = await Table.find(filter).sort({ tableNumber: 1 });
        res.json({ tables });
    } catch (error) {
        console.error('Get tables error:', error);
        res.status(500).json({ error: 'Failed to fetch tables' });
    }
};

const getTableById = async (req, res) => {
    try {
        const { id } = req.params;
        const Table = req.tenantModels.Table;
        
        const table = await Table.findById(id);
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }
        
        res.json({ table });
    } catch (error) {
        console.error('Get table error:', error);
        res.status(500).json({ error: 'Failed to fetch table' });
    }
};

const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { tableNumber, capacity, location, status, isActive } = req.body;
        const Table = req.tenantModels.Table;
        
        if (tableNumber) {
            const existingTable = await Table.findOne({ tableNumber, _id: { $ne: id } });
            if (existingTable) {
                return res.status(400).json({ error: 'Table number already exists' });
            }
        }
        
        const table = await Table.findByIdAndUpdate(
            id,
            { tableNumber, capacity, location, status, isActive },
            { new: true }
        );
        
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }
        
        res.json({ message: 'Table updated successfully', table });
    } catch (error) {
        console.error('Update table error:', error);
        res.status(500).json({ error: 'Failed to update table' });
    }
};

const updateTableStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const Table = req.tenantModels.Table;
        
        const table = await Table.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }
        
        res.json({ message: 'Table status updated successfully', table });
    } catch (error) {
        console.error('Update table status error:', error);
        res.status(500).json({ error: 'Failed to update table status' });
    }
};

const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;
        const Table = req.tenantModels.Table;
        
        const table = await Table.findByIdAndDelete(id);
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }
        
        res.json({ message: 'Table deleted successfully' });
    } catch (error) {
        console.error('Delete table error:', error);
        res.status(500).json({ error: 'Failed to delete table' });
    }
};

const getAvailableTables = async (req, res) => {
    try {
        const Table = req.tenantModels.Table;
        const tables = await Table.find({ 
            status: 'AVAILABLE', 
            isActive: true 
        }).sort({ tableNumber: 1 });
        
        res.json({ tables });
    } catch (error) {
        console.error('Get available tables error:', error);
        res.status(500).json({ error: 'Failed to fetch available tables' });
    }
};

module.exports = {
    createTable,
    getTables,
    getTableById,
    updateTable,
    updateTableStatus,
    deleteTable,
    getAvailableTables
};




