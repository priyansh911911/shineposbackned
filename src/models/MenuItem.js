const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
    // Zomato fields
    catalogueId: {
        type: String,
        unique: true,
        sparse: true
    },
    resId: String,
    
    // Basic info
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    
    // Media
    imageUrl: String,
    imageHash: String,
    thumbUrl: String,
    videoUrl: String,
    
    // Status
    status: {
        type: String,
        enum: ['active', 'inactive', 'out-of-stock'],
        default: 'active'
    },
    inStock: {
        type: Boolean,
        default: true
    },
    
    // Item details
    timeToPrepare: {
        type: Number,
        min: 1,
        default: 15
    },
    foodType: {
        type: String,
        enum: ['veg', 'nonveg', 'egg'],
        required: true
    },
    
    // Zomato tags
    tags: [String],
    
    // Relations
    addon: [{ type: mongoose.Schema.Types.ObjectId, ref:'addon'}],
    variation: [{ type: mongoose.Schema.Types.ObjectId, ref:'variations'}],
    
    // Zomato sync
    lastSyncedAt: Date,
    vendorEntityId: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: false
});

MenuItemSchema.virtual('isAvailable').get(function() {
    return this.status === 'active' && this.inStock;
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);