const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const hasCloudinaryEnv =
  process.env.CLOUD_NAME &&
  process.env.CLOUD_API_KEY &&
  process.env.CLOUD_API_SECRET;

console.log("Cloudinary config:", {
  cloud_name: !!process.env.CLOUD_NAME,
  api_key: !!process.env.CLOUD_API_KEY,
  api_secret: !!process.env.CLOUD_API_SECRET,
});

let storage;

// Only try CloudinaryStorage if all env vars are present
if (hasCloudinaryEnv) {
  try {
    storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "LikeHome_dev",
        allowed_formats: ["jpeg", "png", "jpg"], // snake_case REQUIRED
      },
    });
    console.log("✓ Cloudinary storage initialized successfully");
  } catch (e) {
    console.error("✗ Error creating CloudinaryStorage:", e.message);
  }
}

// Fallback to local disk storage if Cloudinary env vars are missing or CloudinaryStorage failed
if (!storage) {
  console.warn(
    "⚠ Cloudinary not available or misconfigured — falling back to local disk storage.\n   Set CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET in .env to enable Cloudinary uploads."
  );
  const uploadsDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadsDir))
    fs.mkdirSync(uploadsDir, { recursive: true });
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unique + "-" + file.originalname);
    },
  });
  console.log("✓ Local disk storage initialized at", uploadsDir);
}

module.exports = { cloudinary, storage };
