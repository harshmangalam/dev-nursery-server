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
} = require("../controllers/user.controller");

router.get("/users", fetchUsers);
router.get("/:userId", fetchUser);
router.get("/me", checkAuth, fetchCurrentUser);
router.put("/change-password", checkAuth, changePassword);
router.put("/update-profile", checkAuth, updateProfile);
router.get("/:userId/change-role", checkAuth, checkAdmin, changeUserRole);
module.exports = router;
