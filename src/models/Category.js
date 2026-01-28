const mongoose  = require("mongoose");

const CategorySchema = new mongoose.Schema({
    // Zomato fields
    categoryId: {
        type: String,
        unique: true,
        sparse: true
    },
    resId: String,
    
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    order: Number,
    isActive:{
        type:Boolean,
        default:true
    },
    
    // Zomato sync
    vendorEntityId: String,
    lastSyncedAt: Date
}, {
    timestamps:true,
    strict: false
});

module.exports = mongoose.model('Category', CategorySchema);