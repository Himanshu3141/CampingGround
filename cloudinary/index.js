require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

(async function() {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET, 
    });


})();

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
    folder:'YelpCamp',
    allowedFormats:['jpeg','png','jpg'],
    }
});

module.exports={
    cloudinary,
    storage
}