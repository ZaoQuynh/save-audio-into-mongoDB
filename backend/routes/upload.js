const express = require('express');
const multer = require('multer');
const File = require('../models/file');
const router = express.Router();

// Cấu hình multer để lưu trữ file trong bộ nhớ
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route tải lên file MP3
router.post('/upload', upload.single('mp3File'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // Lưu file vào MongoDB
        const newFile = new File({
            filename: req.file.originalname,
            fileBuffer: req.file.buffer,
            contentType: req.file.mimetype,
            fileSize: req.file.size
        });

        await newFile.save();

        res.status(200).send('File uploaded successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading file');
    }
});

module.exports = router;
