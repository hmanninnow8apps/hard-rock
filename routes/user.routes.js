const router = require('express').Router();
const {listitem} = require('../controllers/inventory.controllers');
const { view_cart, add_to_cart, remove_from_cart } = require('../controllers/cart.controllers');

router.get('/list/:category', listitem);
//item_id
//order_quantity
router.post('/add_to_cart', add_to_cart);
router.get('/view_cart', view_cart);
router.post('/remove_from_cart', remove_from_cart);

module.exports = router