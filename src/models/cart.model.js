const { model, Schema } = require("mongoose");

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        quantity: {
          type: Number,
          min: [1,"Items quantity must be greater than equal to 1"],
          default: 1,
        },
        plant: {
          type: Schema.Types.ObjectId,
          ref: "Plant",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Cart", cartSchema);
