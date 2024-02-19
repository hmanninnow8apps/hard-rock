const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    item_id:{
        type: mongoose.Types.ObjectId,
        ref: 'Items'
    },
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
    total:{
        type: Number,
        required: true
    },
    user_id:{
        type: mongoose.Types.ObjectId,
        ref: 'Users',
    }
},{
    timestamps:true
})

const Cart = mongoose.model('cart', cartSchema);

module.exports = {Cart}