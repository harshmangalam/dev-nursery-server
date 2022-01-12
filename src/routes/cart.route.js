const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/auth.middleware");
const {
  createCart,
  fetchCart,
  updateCart,
  deleteCart,
} = require("../controllers/cart.controller");
const { body } = require("express-validator");

const cartValidation = [
  body("items")
    .not()
    .isEmpty()
    .withMessage("Cart items must be required with quantity and plant id"),
  body("totalPrice")
    .not()
    .isEmpty()
    .withMessage("Cart total price must be required"),
];

router.get("/", checkAuth, fetchCart);
router.post("/", cartValidation, checkAuth, createCart);
router.put("/", cartValidation, checkAuth, updateCart);
router.delete("/", checkAuth, deleteCart);

module.exports = router;
