const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
    item_name:{
        type: String,
        required: true
    },
    item_quantity:{
        type: Number,
        required: true
    }, 
    price:{
        type: Number,
        required: true
    },
    item_description:{
        type: String,
        required: true
    },
    item_image:{
        type: String,
    },
    image_id:{
        type: String,
        required: true
    },
    item_category:{
        type: String,
        
    }
},{
    timestamps:true
})

const Items = mongoose.model('Items', itemsSchema);

module.exports = {Items}