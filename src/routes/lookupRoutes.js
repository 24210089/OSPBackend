// src/routes/lookupRoutes.js
const express = require("express");
const router = express.Router();
const lookupController = require("../controllers/lookupController");
const { authenticateToken, authorize } = require("../middlewares/auth");

// Journey Stages routes
router.get(
  "/journey-stages",
  authenticateToken,
  lookupController.getJourneyStages
);
router.get(
  "/journey-stages/all",
  authenticateToken,
  lookupController.getAllJourneyStages
);
router.post(
  "/journey-stages",
  authenticateToken,
  authorize("admin", "be_tren_tong"),
  lookupController.createJourneyStage
);
router.put(
  "/journey-stages/:id",
  authenticateToken,
  authorize("admin", "be_tren_tong"),
  lookupController.updateJourneyStage
);
router.delete(
  "/journey-stages/:id",
  authenticateToken,
  authorize("admin", "be_tren_tong"),
  lookupController.deleteJourneyStage
);

// Sister Statuses routes
router.get(
  "/sister-statuses",
  authenticateToken,
  lookupController.getSisterStatuses
);
router.get(
  "/sister-statuses/all",
  authenticateToken,
  lookupController.getAllSisterStatuses
);
router.post(
  "/sister-statuses",
  authenticateToken,
  authorize("admin", "be_tren_tong"),
  lookupController.createSisterStatus
);
router.put(
  "/sister-statuses/:id",
  authenticateToken,
  authorize("admin", "be_tren_tong"),
  lookupController.updateSisterStatus
);
router.delete(
  "/sister-statuses/:id",
  authenticateToken,
  authorize("admin", "be_tren_tong"),
  lookupController.deleteSisterStatus
);

// User Roles routes
router.get("/user-roles", authenticateToken, lookupController.getUserRoles);

module.exports = router;
