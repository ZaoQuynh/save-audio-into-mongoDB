// src/FileUpload.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  // Hàm xử lý khi người dùng chọn file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Hàm xử lý khi người dùng nhấn nút tải lên
  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('mp3File', file);

    try {
      // Gửi yêu cầu POST đến backend
      const response = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('File uploaded successfully!');
      fetchFiles();  // Lấy lại danh sách các file sau khi tải lên thành công
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error.response) {
        setMessage(`Error: ${error.response.data}`);
      } else {
        setMessage('Error uploading file');
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy danh sách các tệp MP3 từ server
  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // Hàm phát tệp MP3
  const handlePlay = (fileId) => {
    const audio = new Audio(`http://localhost:3001/api/files/${fileId}`);
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
      setMessage('Failed to load audio.');
    });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h1>Upload MP3 File</h1>
      <input type="file" accept="audio/mp3" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p>{message}</p>}

      <h2>Uploaded Files</h2>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file._id}>
                <p>{file.filename}</p>
              <button onClick={() => handlePlay(file._id)}>Play</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;
