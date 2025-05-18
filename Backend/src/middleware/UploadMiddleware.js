
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = 'C:/temp_uploads/perfiles';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        console.log('📁 Carpeta creada:', UPLOADS_DIR);
      }
      console.log('✅ Guardando en:', UPLOADS_DIR);
      cb(null, UPLOADS_DIR);
    } catch (err) {
      console.error('❌ Error al crear carpeta:', err);
      cb(err, UPLOADS_DIR);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    console.log('📄 Archivo subido:', uniqueName);
    cb(null, uniqueName);
  }
});

module.exports = multer({ storage });