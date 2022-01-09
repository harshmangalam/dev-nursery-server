const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        quantity: {
          type: Number,
          min: 1,
        },
        plant: {
          type: Schema.Types.ObjectId,
          ref: "Plant",
        },
      },
    ],

    status: {
      type: String,
      enum: ["PLACED", "PROCESSING", "DELIVERED", "CANCEL"],
      default: "PLACED",
    },

    payment: {
      type: String,
      enum: ["ONLINE", "COD"],
      default: "ONLINE",
    },
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);
