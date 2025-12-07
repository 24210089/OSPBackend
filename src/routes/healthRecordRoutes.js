const express = require("express");
const healthRecordController = require("../controllers/healthRecordController");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

router.use(authenticateToken);

// Get all health records with pagination
router.get("/", healthRecordController.getAllHealthRecords);

// Routes with specific paths must come before /:id
router.get(
  "/sister/:sisterId",
  healthRecordController.healthRecordAccessLogger,
  healthRecordController.getHealthRecordBySister
);

router.get(
  "/sister/:sisterId/summary",
  healthRecordController.healthRecordAccessLogger,
  healthRecordController.getGeneralHealthStatus
);

// Get health record by ID (must come after specific paths)
router.get("/:id", healthRecordController.getHealthRecordById);

router.post("/", healthRecordController.addHealthRecord);

router.put("/:id", healthRecordController.updateHealthRecord);

router.delete("/:id", healthRecordController.deleteHealthRecord);

module.exports = router;
