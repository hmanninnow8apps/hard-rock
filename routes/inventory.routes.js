const router = require('express').Router();
const {additem, removeitem, updateitem, listitem, updateImage} = require('../controllers/inventory.controllers');
const {upload} = require('../config/fileUpload')


router.post('/add', upload.single('file'), additem);
router.put('/updateImage/:item_id', upload.single('file'), updateImage)
router.delete('/remove/:item_id', removeitem);
router.put('/update/:item_id', updateitem)
router.get('/list/:category', listitem)

module.exports = router