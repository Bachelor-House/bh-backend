const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const cloudinary = require('./cloudinary.config');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('file'); // use .array() to handle multiple files

// Enable cors for all routes.
app.use(cors());
const PORT = process.env.SERVER_PORT || 9999;

app.post('/upload', upload, async (req, res) => {
  try {
    const uploadPromises = req.files.map((file) => {
      const fileNmae = file.originalname.split('.').shift();
      const fileExtension = file.originalname.split('.').pop();

      let resourceType = 'raw'; // default fallback

      if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fileExtension)) {
        resourceType = 'image';
      } else if (['mp4', 'mov', 'avi', 'webm'].includes(fileExtension)) {
        resourceType = 'video';
      } else {
        resourceType = 'raw';
      }

      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            public_id: `${fileNmae}`,
            resource_type: resourceType,
            format: fileExtension,
            overwrite: false
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({ url: result.secure_url, public_id: result.public_id });
          }
        );

        stream.end(file.buffer); // important to stream the file buffer
      });
    });

    const uploadResults = await Promise.all(uploadPromises);
    res.json({ files: uploadResults });
  } catch (error) {
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});