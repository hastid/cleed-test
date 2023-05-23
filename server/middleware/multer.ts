import path from "path";
import multer from "multer";
import { CustomError } from "../constants/interfaces";

  // Folder for uploaded files
const uploadDir = path.join(__dirname, "../uploads");

// Multer configuration
const storage = multer.diskStorage({
  // Destination folder for uploaded files
  destination: uploadDir,
  filename: (req, file, cb) => {
    // Generate a unique filename
    const extname = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extname);
  },
});

// Initialize multer with the configuration
const upload = multer({
  storage: storage,
  // Check if the file type is an image
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new CustomError("Only image files are allowed", 400));
    }
  },
});

export { upload };
