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
  body("payment").not().isEmpty().withMessage("Order payment must be required"),
];

router.get("/", fetchOrders);
router.get("/:orderId", fetchOrder);
router.post("/", orderValidation, checkAuth, placeOrder);
router.put("/:orderId", checkAuth, updateOrder);

module.exports = router;
