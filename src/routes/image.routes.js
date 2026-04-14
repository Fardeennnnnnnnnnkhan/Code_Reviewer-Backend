import express from 'express';
import multer from 'multer';
import ImageKit from 'imagekit';
import Image from '../models/Image.js';

const router = express.Router();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const uploadResponse = await imagekit.upload({
            file: req.file.buffer, 
            fileName: req.file.originalname, 
            folder: '/CodeReviewer' 
        });

        const newImage = new Image({
            url: uploadResponse.url,
            fileId: uploadResponse.fileId,
            name: req.file.originalname
        });
        
        await newImage.save();

        res.status(200).json({ message: 'Image uploaded successfully', image: newImage });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

export default router;
