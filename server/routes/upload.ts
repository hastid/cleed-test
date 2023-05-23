import express, { Request, Response } from "express";

import { upload } from "../middleware/multer";
import path from "path";

const router = express.Router();

// Express upload route
router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  if (req.file) {
    const filePath = path.join("/uploads", req.file.filename);
    return res
      .status(200)
      .json({ path: filePath, message: "File uploaded successfully" });
  } else {
    res.status(400).send("No file uploaded");
  }
});

export default router;
