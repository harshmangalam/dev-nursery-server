const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/auth.middleware");
const {
  placeOrder,
  fetchOrders,
  fetchOrder,
  updateOrder,
} = require("../controllers/order.controller");
const { body } = require("express-validator");

const orderValidation = [
  body("items")
    .not()
    .isEmpty()
    .withMessage("Order items must be required with quantity and plant id"),
  body("shippingAddress").not().isEmpty().withMessage("SHipping Address must be required"),
  body("paymentMethod").not().isEmpty().withMessage("Payment Type must be required"),
  body("plantsPrice").not().isEmpty().withMessage("Plants Price must be required"),
  body("paymentDone").not().isEmpty().withMessage("Payment Done must be required"),
];

router.get("/", fetchOrders);
router.get("/:orderId", fetchOrder);
router.post("/", orderValidation, checkAuth, placeOrder);
router.put("/:orderId", checkAuth, updateOrder);

module.exports = router;
