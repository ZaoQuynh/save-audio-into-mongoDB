// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const File = require('./models/file');
const path = require('path');

// Cấu hình upload file với multer
const storage = multer.memoryStorage(); // Lưu trữ tệp trong bộ nhớ
const upload = multer({ storage: storage });

const app = express();
const port = 3001;

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/fileUpload', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB', err));

// Middleware
app.use(cors());
app.use(express.json());

// API Upload file MP3
app.post('/api/upload', upload.single('mp3File'), async (req, res) => {
  try {
    const { filename, mimetype, size, buffer } = req.file;
    const newFile = new File({
      filename: filename,
      fileBuffer: buffer,   
      contentType: mimetype,
      fileSize: size,
    });

    await newFile.save();
    res.status(200).send('File uploaded successfully!');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

// API Get danh sách các tệp
app.get('/api/files', async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).send('Error fetching files');
  }
});

// API để trả về file
// API để trả về file
app.get('/api/files/:fileId', async (req, res) => {
    try {
      const file = await File.findById(req.params.fileId);
      res.setHeader('Content-Type', "audio/mpeg");
      res.send(file.fileBuffer);
    } catch (error) {
      console.error('Error fetching file:', error);
      res.status(500).send('Error fetching file');
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
