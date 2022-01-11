const { model, Schema } = require("mongoose");

const plantSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Plant name must not be empty"],
      maxlength: [30, "Plant name must be less than 30 character"],
      unique: true,
    },
    images: [String],

    price: {
      type: Number,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Plant slug must not be empty"],
      trim: true,
      unique: true,
    },

    specification: {
      height: {
        type: Number,
        min: 0,
      },
      maxHeight: {
        type: Number,
        min: 0,
      },
      color: {
        type: String,
        trim: true,
      },
      difficulty: {
        type: String,
        enum: ["EASY_TO_GROW", "DIFFICULT_TO_GROW"],
        default: "EASY_TO_GROW",
        trim: true,
      },
    },

    plantCollection: {
      type: Schema.Types.ObjectId,
      ref: "Collection",
    },

    availability: {
      type: String,
      enum: ["IN_STOCK", "OUT_OF_STOCK"],
      default: "IN_STOCK",
    },
  },
  { timestamps: true }
);

module.exports = model("Plant", plantSchema);
