const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/auth.middleware");
const checkAdmin = require("../middlewares/admin.middleware");

const {
  fetchUsers,
  fetchUser,
  fetchCurrentUser,
  changePassword,
  updateProfile,
  changeUserRole,
  fetchUserOrders,
} = require("../controllers/user.controller");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */

router.get("/users", fetchUsers);
router.get("/:userId", fetchUser);
router.get("/me", checkAuth, fetchCurrentUser);
router.put("/change-password", checkAuth, changePassword);
router.put("/update-profile", checkAuth, updateProfile);
router.get("/:userId/change-role", checkAuth, checkAdmin, changeUserRole);
router.get("/orders", checkAuth, fetchUserOrders);
module.exports = router;
