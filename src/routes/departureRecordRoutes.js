const express = require("express");
const departureRecordController = require("../controllers/departureRecordController");
const { authenticateToken } = require("../middlewares/auth");
const {
  validateDepartureRecordCreate,
  handleValidationErrors,
} = require("../middlewares/validation");

const router = express.Router();

router.use(authenticateToken);

// Get list of all departure records
router.get("/", departureRecordController.getDepartureRecords);

// Get statistics
router.get("/statistics", departureRecordController.getDepartureStatistics);

// Get departures by sister
router.get(
  "/sister/:sisterId",
  departureRecordController.getDepartureRecordBySister
);

// Get single departure by ID
router.get("/:id", departureRecordController.getDepartureRecordById);

// Create new departure
router.post("/", departureRecordController.createDepartureRecord);

// Update departure
router.put("/:id", departureRecordController.updateDepartureRecord);

// Delete departure
router.delete("/:id", departureRecordController.deleteDepartureRecord);

module.exports = router;
