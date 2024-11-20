// models/file.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  fileBuffer: Buffer,
  contentType: String,
  fileSize: Number,
});

module.exports = mongoose.model('File', fileSchema);
