const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    preset: process.env.CLOUDINARY_PRESET
});


const deleteImage = async (req, res) => {
    try {
        cloudinary.uploader.destroy(req.params.id, (error, result) => {
            if (error) {
                return res.status(500).json({ message: error.message });
            }

            return res.status(200).json({ message: "Image deleted successfully" });
        });
    } catch (error) {   
        return res.status(500).json({ message: error.message });
    }
}

module.exports = deleteImage