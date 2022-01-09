const Order = require("../models/order.model");
const orderDTO = require("../dto/order.dto");
const { validationResult } = require("express-validator");

exports.fetchOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate([
      { path: "user" },
      { path: "items.plant" },
    ]);

    const orderData = [];

    orders.forEach((order) => {
      const transformOrder = orderDTO(order);
      orderData.push(transformOrder);
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch orders",
      data: {
        orders: orderData,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate([
      { path: "user" },
      { path: "items.plant" },
    ]);

    return res.status(200).json({
      type: "success",
      message: "Fetch order",
      data: {
        order: orderDTO(order),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.placeOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: "User input error",
      data: errors.mapped(),
    });
  }

  const userId = res.locals.user._id;
  const { items, payment } = req.body;
  try {
    const newOrder = new Order({
      user: userId,
      items,
      payment,
    });

    const order = await newOrder.save();

    return res.status(201).json({
      type: "success",
      message: "Order placed successfully",
      data: {
        orderId: order._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: "User input error",
      data: errors.mapped(),
    });
  }
  const { status } = req.body;

  try {
    let order = await Order.findById(req.params.orderId);
    if (!order) {
      return next({ status: 404, message: "Order does not exists" });
    }
    order.status = status;
    order = await order.save();

    order = await order.populate([{ path: "user" }, { path: "items.plant" }]);

    return res.status(201).json({
      type: "success",
      message: "Order updated successfully",
      data: {
        order: orderDTO(order),
      },
    });
  } catch (error) {
    next(error);
  }
};
