const Order = require("../models/order.model");
const orderDTO = require("../dto/order.dto");
const { validationResult } = require("express-validator");

exports.fetchOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate([
      { path: "user", select: "name email" },
      { path: "items.plant", select: "name slug price images" },
    ]);

    const orderData = [];

    orders.forEach((order) => {
      const transformOrder = orderDTO(order);
      orderData.push(transformOrder);
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch order lists",
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
  const { items, paymentMethod, shippingAddress, plantsPrice, paymentDone } =
    req.body;
  try {
    const shippingPrice = plantsPrice >= 300 ? 0 : 20;
    const taxPrice = 10;
    const totalPrice = plantsPrice + shippingPrice + taxPrice;
    const newOrder = new Order({
      user: userId,
      items,
      paymentMethod,
      shippingAddress,
      paymentDone,
      plantsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
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
  const { status, paymentDone } = req.body;

  try {
    let order = await Order.findById(req.params.orderId);
    if (!order) {
      return next({ status: 404, message: "Order does not exists" });
    }

    switch (status) {
      case "PROCESSING":
        order.processingAt = new Date();
        break;

      case "OUT_FOR_DELIVERY":
        order.outForDeliveryAt = new Date();
        break;

      case "DELIVERED":
        order.deliveredAt = new Date();
        break;

      case "CANCEL":
        order.cancelAt = new Date();
        break;
      default:
        throw new Error("Order status is invalid");
    }
    order.status = status;
    order.paymentDone = paymentDone;
    order = await order.save();

    return res.status(201).json({
      type: "success",
      message: "Order updated successfully",
      data: {
        orderId: order._id,
      },
    });
  } catch (error) {
    next(error);
  }
};
