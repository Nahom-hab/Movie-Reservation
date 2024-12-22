const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (file) => {
    try {
        // Return a promise that resolves with the upload result
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) {
                        return reject(new Error(error)); // Reject the promise on error
                    }
                    resolve(result); // Resolve with the result on success
                }
            );

            uploadStream.on('error', (error) => reject(new Error(error))); // Handle stream errors
            uploadStream.end(file.buffer); // Use the buffer from multer
        });

        console.log(result.secure_url); // Log the result for debugging
        return result.secure_url; // Return the URL of the uploaded image
    } catch (error) {
        throw new Error('Error uploading image to Cloudinary: ' + error.message);
    }
};

module.exports = uploadImageToCloudinary;