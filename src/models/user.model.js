const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name must not be empty"],
      maxlength: [30, "User name must be less than 30 character"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "User email must not be empty"],
      maxlength: [40, "User email must be less than 40 character"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User password must not be empty"],
      trim: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["ADMIN", "CUSTOMER"],
      default: "CUSTOMER",
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
