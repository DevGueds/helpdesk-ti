const fs = require('fs');
const path = require('path');
const multer = require('multer');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function buildUploadMiddleware() {
  const uploadRoot = path.resolve(process.env.UPLOAD_DIR || 'uploads');
  ensureDir(uploadRoot);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      ensureDir(uploadRoot);
      cb(null, uploadRoot);
    },
    filename: (req, file, cb) => {
      const safe = `${Date.now()}_${Math.random().toString(16).slice(2)}_${file.originalname}`.replace(/[^\w.\-]+/g, '_');
      cb(null, safe);
    }
  });

  return multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 } // 8MB
  });
}

module.exports = { buildUploadMiddleware };
