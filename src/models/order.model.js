const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        quantity: { type: Number, required: true },
        plant: {
          type: Schema.Types.ObjectId,
          ref: "Plant",
        },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true, trim: true, maxlength: 30 },
      address: { type: String, required: true, trim: true, maxlength: 80 },
      city: { type: String, required: true, trim: true, maxlength: 30 },
      postalCode: { type: String, required: true, trim: true, maxlength: 10 },
      country: { type: String, required: true, trim: true, maxlength: 30 },
      location: {
        lat: {
          type: Number,
          maxlength: 8,
        },
        lng: {
          type: Number,
          maxlength: 8,
        },
      },
    },
    plantsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    paymentMethod: { type: String, required: true, enum: ["COD", "ONLINE"] },
    paymentDone: { type: Boolean, default: false },
    paymentDoneAt: { type: Date },

    status: {
      type: String,
      enum: ["PLACED", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCEL"],
      default: "PLACED",
    },

    processingAt: { type: Date },
    outForDeliveryAt: { type: Date },
    deliveredAt: { type: Date },
    cancelAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Order", orderSchema);
