require("dotenv").config();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");


// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "marmaForm",
      allowedFormats: ["pdf", "docx", "jpeg", "png", "jpg", "svg", "gif", "mp4", "webm"],
      resource_type: "raw", // Set resource_type as "raw" for all files
    },
  });
  
  const upload = multer({
    storage,
    limits: {
      fileSize: 24 * 1024 * 1024, // 24 MB file size limit
    },
  });
  
  // Export both `upload` and `cloudinary` to use in other files
  module.exports = {
    upload,
    cloudinary,
  };
  