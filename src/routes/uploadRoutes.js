const express = require("express");
const router = express.Router();
const path = require("path");
const { uploadDocuments } = require("../middlewares/upload");
const { authenticateToken } = require("../middlewares/auth");

const UPLOADS_ROOT = path.resolve(__dirname, "../uploads");

// Upload multiple documents
router.post(
  "/documents",
  authenticateToken,
  uploadDocuments,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedFiles = req.files.map((file, index) => {
        const relativePath = path
          .relative(UPLOADS_ROOT, file.path)
          .replace(/\\/g, "/");
        return {
          id: Date.now() + index,
          name: file.originalname,
          size: file.size,
          type: file.mimetype,
          url: `/uploads/${relativePath}`,
          uploadedAt: new Date().toISOString(),
        };
      });

      return res.status(200).json({
        success: true,
        files: uploadedFiles,
      });
    } catch (error) {
      console.error("Upload error:", error.message);
      return res.status(500).json({ message: "Failed to upload files" });
    }
  }
);

module.exports = router;
