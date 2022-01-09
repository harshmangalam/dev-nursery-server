const { model, Schema } = require("mongoose");

const reviewSchema = new Schema(
  {
    plant: {
      type: Schema.Types.ObjectId,
      ref: "Plant",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    ratings: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    content: {
      type: String,
      trim: true,
      maxlength: [200, "Content should be less than 200  character"],
    },
  },
  { timestamps: true }
);


module.exports = model("Review",reviewSchema)
