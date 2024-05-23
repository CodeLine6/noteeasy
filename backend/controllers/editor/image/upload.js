const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    preset: process.env.CLOUDINARY_PRESET
});

const uploadImage = async (req, res) => {
    try {
        const chunks = [];

    req.on('data', chunk => {
        chunks.push(chunk);
    });

    req.on('end', () => {
        const buffer = Buffer.concat(chunks);
        new Promise((resolve) => {
            cloudinary.uploader.upload_stream((error, uploadResult) => {
                return resolve(uploadResult);
            }).end(buffer);
        }).then((uploadResult) => {
            res.status(200).json({ url: uploadResult.secure_url })
        });
    })
        
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}

module.exports = uploadImage