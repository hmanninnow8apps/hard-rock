const {v2 } = require('cloudinary');
const {Items} = require('../models/items.model')
const cloudinary = v2;
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileToCloudinaryAndSave =  async (filePath)=>{
    let url;
    let public_id = filePath.split('-')[2];

    await cloudinary.uploader.upload(filePath,
        { public_id}, 
        function(error, result) {url = result.url});

    return {url, public_id};
}

const DeleteFileFromCloudinary =  async (image_id)=>{

  await cloudinary.uploader.destroy(image_id, 
    { type: 'upload', resource_type: 'image' });

  return ;
}

module.exports = {uploadFileToCloudinaryAndSave,
  DeleteFileFromCloudinary};

