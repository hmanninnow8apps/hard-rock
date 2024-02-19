const { Items } = require("../models/items.model");
const {Cart} = require("../models/cart.model")
const {User} = require("../models/user.model")

const view_cart = async (req, res) => {

    let orders = await Cart.find({user_id: req.user._id});

    return res.status(200).json(orders);

}

const add_to_cart = async (req, res) => {

    const {item_id, cart_quantity} = req.body;

    let item = await Items.findByIdAndUpdate(
        item_id ,
        { $inc: { item_quantity: -cart_quantity } }
    );

    const {item_name, price} = item;

    let cart = new Cart({
        item_id,
        item_name,
        item_quantity: cart_quantity,
        price,
        total: (+cart_quantity)*(+price),
        user_id: req.user._id
    })

    cart = await cart.save();

    await User.updateOne({
        _id: req.user._id
    },{ 
        $cart: { cart: cart._id } 
    })

    return res.status(200).json(cart);

}

const remove_from_cart = async (req, res) => {

    const {cart_id} = req.body;

    let item = await Cart.findByIdAndDelete(cart_id);

    console.log(item);

    item = await Items.findByIdAndUpdate(
        item.item_id ,
        { $inc: { item_quantity: +item.item_quantity } }
    );


    await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { cart_ids: cart_id } },
        { new: true }
    );

    return res.status(200).json(item);

}

module.exports = {view_cart,
    add_to_cart,
    remove_from_cart}
