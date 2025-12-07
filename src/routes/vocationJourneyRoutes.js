const express = require("express");
const vocationJourneyController = require("../controllers/vocationJourneyController");
const { authenticateToken, authorize } = require("../middlewares/auth");
const {
  validateVocationJourneyCreate,
  handleValidationErrors,
} = require("../middlewares/validation");

const router = express.Router();

const editorRoles = [
  "admin",
  "superior_general",
  "superior_provincial",
  "superior_community",
  "secretary",
];

router.use(authenticateToken);

// Get all journeys with pagination
router.get("/", vocationJourneyController.getAllJourneys);

// Statistics - must be before /:id
router.get("/statistics", vocationJourneyController.getStatisticsByStage);

// Get journeys by sister - must be before /:id
router.get("/sister/:sisterId", vocationJourneyController.getJourneyBySister);

// Get journey by ID - must be after specific routes
router.get("/:id", vocationJourneyController.getJourneyById);

// Create new journey with sister_id in body
router.post(
  "/",
  authorize(...editorRoles),
  vocationJourneyController.createJourney
);

router.put(
  "/:stageId",
  authorize(...editorRoles),
  vocationJourneyController.updateJourneyStage
);

router.delete(
  "/:stageId",
  authorize(...editorRoles),
  vocationJourneyController.deleteJourneyStage
);

module.exports = router;
