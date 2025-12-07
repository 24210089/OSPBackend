const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const { authenticateToken, authorize } = require("../middlewares/auth");
const {
  validateUserCreate,
  handleValidationErrors,
} = require("../middlewares/validation");

const router = express.Router();

const adminOnly = authorize("admin");

router.use(authenticateToken);

// Profile routes (must be before /:id routes)
router.put("/profile", userController.updateProfile);
router.post("/change-password", userController.changePassword);

router.get("/", adminOnly, userController.getAllUsers);
router.get("/:id", userController.getUserById);

router.post(
  "/",
  adminOnly,
  validateUserCreate,
  handleValidationErrors,
  userController.createUser
);

router.put("/:id", userController.updateUser);

router.delete("/:id", adminOnly, userController.deleteUser);

router.post(
  "/:id/reset-password",
  adminOnly,
  body("newPassword")
    .notEmpty()
    .withMessage("newPassword is required")
    .isLength({ min: 6 })
    .withMessage("newPassword must be at least 6 characters"),
  handleValidationErrors,
  userController.resetPassword
);

router.post("/:id/toggle-status", adminOnly, userController.toggleUserStatus);

router.get("/:id/activities", userController.getUserActivities);

module.exports = router;
