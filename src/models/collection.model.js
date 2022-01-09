const { model, Schema } = require("mongoose");

const collectionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Collection name must not be empty"],
      maxlength: [30, "Collection name must be less than 30 character"],
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      required: [true, "Collection image must not be empty"],
    },
    slug: {
      type: String,
      required: [true, "Collection slug must not be empty"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    totalPlants: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = model("Collection", collectionSchema);
