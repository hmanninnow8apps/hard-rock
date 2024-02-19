const {Items} = require("../models/items.model")
const jwt = require('jsonwebtoken')
const fs = require('fs');
const {uploadFileToCloudinaryAndSave, DeleteFileFromCloudinary} = require('../config/cloudinary');

const additem = async (req, res) => {

    const {item_name, item_quantity, item_description, price, item_category} = req.body;
    
    console.log(req.body,"request body")
    console.log(req.item_image);

    if(!item_name || !item_quantity || !price|| !item_description || !item_category){
        res.status(400)
        //fs.unlink(req.file.path);
        return res.json({msg: "MISSING_CREDENTIALS"})//throw new Error("MISSING_CREDENTIALS");
    }

    let {url, public_id} = await uploadFileToCloudinaryAndSave(req.file?.path);

    let item = new Items({
        item_name,
        item_quantity,
        price,
        item_description,
        item_image : url,
        image_id: public_id,
        item_category
    })

    try{
        await item.save();
    }catch(err){
      console.log(err);//throw new Error("INTERNAL_SERVER_ERROR");
    }

    fs.unlink(req.file.path,(err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });

    res.status(200).json({item_id: item._id});
}

const removeitem = async (req, res) => {

    let item_id = req.params.item_id;

    if(!item_id){
        res.status(500)
        return res.json({msg: "MISSING_PARAM_ITEM_ID"})
    }

    let deleted_item;

    try{
        deleted_item = await Items.findByIdAndDelete(item_id);
    }catch(err){
        res.status(500)
        return res.json({msg: "INTERNAL_SERVER_ERROR"})
    }

    

    if (!deleted_item) {
        res.status(404); // Use 404 for resource not found
        return res.json({ msg: "ITEM_NOT_FOUND" });//throw new Error("ITEM_NOT_FOUND");
    }
    
    res.status(200).json({msg: "SUCCESS"});
}

const updateitem = async (req, res) => {
    
    let item_id = req.params.item_id;

    if(!item_id){
        res.status(500)
        return res.json({msg: "MISSING_PARAM_ITEM_ID"})
    }

    console.log(req.body);

    const {item_quantity, item_name, price, item_description, item_category} = req.body;

    let modify = modification([{item_quantity}, {item_name}, {price}, {item_description}, {item_category}]);
    console.log(modify)

    try{
        console.log(modify)
        let ele = await Items.findByIdAndUpdate(item_id,modify);
        console.log(ele);
    }catch(err){
        res.status(500)
        return res.json({msg: "INTERNAL_SERVER_ERROR"})//throw new Error("INTERNAL_SERVER_ERROR");
    }

    res.status(200).json({msg: "SUCCESS"});

}

const listitem = async (req, res) => {

    const {category} = req.params;

    if(category === 'all'){

        const items = await Items.find().sort({ createdAt: -1 });
        const categories = await Items.distinct('item_category');
        return res.status(200).json({items, categories});

    }else{

        const items = await Items.find({ item_category: category }).sort({ createdAt: -1 });
        return res.status(200).json(items);

    }
    
}

const modification = (arr) =>{

    let obj = arr.reduce((acc,prop)=>{
        if(Object.values(prop)[0]){
            acc[Object.keys(prop)[0]]= Object.values(prop)[0];
        }
        return acc;
    },{})

    return obj;

}

const updateImage = async (req, res)=>{

    let item_id = req.params.item_id;
    let item;

    try{
    
    item = await Items.findById(item_id);
    
    let image_id = item.image_id;

    await DeleteFileFromCloudinary(image_id);

    let {url, public_id} = await uploadFileToCloudinaryAndSave(req.file?.path);

    item.item_image = url;
    item.image_id = public_id;

    try{
        await item.save();
    }catch(err){
      console.log(err);//throw new Error("INTERNAL_SERVER_ERROR");
    }

    }catch(err){
        res.status(500)
        return res.json({msg: "INTERNAL_SERVER_ERROR"});
    }


    fs.unlink(req.file.path,(err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });

    res.status(200).json({item_id, image_url: item.item_image});
}





module.exports = {
    additem,
    removeitem,
    updateitem,
    listitem,
    updateImage
}