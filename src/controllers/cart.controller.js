const Cart = require("../models/cart.model");
const cartDTO = require("../dto/cart.dto");
const { validationResult } = require("express-validator");

exports.fetchCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({
      user: res.locals.user._id,
    });
    if (!cart) {
      return next({ status: 404, message: "Cart does not exists" });
    }

    // populate reference details

    cart = await cart.populate([
      { path: "user", select: "-__v" },
      { path: "items.plant", select: "-__v" },
    ]);

    return res.status(200).json({
      type: "success",
      message: "Fetch user cart",
      data: {
        cart: cartDTO(cart),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createCart = async (req, res, next) => {
  // collect and  return api field level validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: "User input error",
      data: errors.mapped(),
    });
  }

  const userId = res.locals.user._id;
  const { items } = req.body;
  try {
    let cart = await Cart.findOne({
      user: userId,
    });

    // create cart if not available otherwise update cart 
    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = new Cart({
        user: userId,
        items,
      });

      await cart.save();
    }

    let cartData = await cart.populate([
      { path: "user", select: "-__v" },
      { path: "items.plant", select: "-__v" },
    ]);

    return res.status(201).json({
      type: "success",
      message: "Cart created successfully",
      data: {
        cart: cartDTO(cartData),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCart = async (req, res, next) => {
  // collect and  return api field level validations

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: "User input error",
      data: errors.mapped(),
    });
  }
  const { items } = req.body;
  try {
    let cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return next({ status: 404, message: "Cart does not exists" });
    }
    cart.items = items;
    cart  = await cart.save();

    cart = await cart.populate([
      { path: "user", select: "-__v" },
      { path: "items.plant", select: "-__v" },
    ]);

    return res.status(201).json({
      type: "success",
      message: "Cart updated successfully",
      data: {
        cart: cartDTO(cart),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCart = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return next({ status: 404, message: "Cart does  not exists" });
    }

    await cart.remove();

    return res.status(201).json({
      type: "success",
      message: "Cart removed successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
