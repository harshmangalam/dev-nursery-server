const Plant = require("../models/plant.model");
const Review = require("../models/review.model");
const plantDTO = require("../dto/plant.dto");
const plantDetailDTO = require("../dto/plantDetails.dto");
const reviewDTO = require("../dto/review.dto");
const slugify = require("../utils/slug.util");
const { validationResult } = require("express-validator");

exports.fetchPlant = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.plantId).populate({
      path: "plantCollection",
      select: "name image slug description",
    });

    if (!plant) {
      return next({
        status: 404,
        message: "Plant does not exists",
        data: null,
      });
    }
    const reviews = await Review.find({ plant: req.params.plantId }).select(
      "ratings"
    );
    const totalRatings = reviews.reduce((a, review) => a + review.ratings, 0.0);
    const avgRatings = totalRatings / reviews.length;

    return res.status(200).json({
      type: "success",
      message: "Fetch plant Details",
      data: {
        plant: plantDetailDTO(plant),
        reviews: {
          countAvgRatings: avgRatings,
          countReviews: reviews.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find();
    let plantsData = [];

    plants.forEach((p) => {
      const plant = plantDTO(p);
      plantsData.push(plant);
    });
    return res.status(200).json({
      type: "success",
      message: "Fetch plant lists",
      data: {
        plants: plantsData,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.createPlant = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: "User input error",
      data: errors.mapped(),
    });
  }
  const { name, description, images, price, specification, collection } =
    req.body;
  try {
    const plant = await Plant.findOne({ name }).select("name");
    if (plant) {
      return next({ status: 400, message: "Plant  already exists" });
    }

    const slug = slugify(name);

    const newPlant = new Plant({
      name,
      images,
      description,
      slug,
      price,
      specification,
      plantCollection: collection,
    });

    let savePlant = await newPlant.save();
    return res.status(201).json({
      type: "success",
      message: "Plant created successfully",
      data: {
        plantId: savePlant._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePlant = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: "User input error",
      data: errors.mapped(),
    });
  }
  const { name, description, images, price, specification, collection } =
    req.body;
  try {
    const plant = await Plant.findById(req.params.plantId);
    if (!plant) {
      return next({ status: 404, message: "Plant does  not exists" });
    }
    if (name !== plant.name) {
      plant.name = name;
      plant.slug = slugify(name);
    }
    plant.description = description;
    plant.images = images;
    plant.price = price;
    plant.specification = specification;
    plant.plantCollection = collection;

    const savePlant = await plant.save();

    return res.status(201).json({
      type: "success",
      message: "Plant updated successfully",
      data: {
        plant: plantDTO(savePlant),
      },
    });
  } catch (error) {
    // handle plant already found
    if (error.code === 11000) {
      return next({ status: 400, message: "Plant alredy exists" });
    }
    next(error);
  }
};

exports.deletePlant = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.plantId).select("_id");
    if (!plant) {
      return next({ status: 404, message: "Plant does  not exists" });
    }
    await plant.remove();
    return res.status(201).json({
      type: "success",
      message: "Plant removed successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchPlantReviews = async (req, res, next) => {
  try {
    let reviews = await Review.find({ plant: req.params.plantId }).populate([
      { path: "user", select: "name email" },
      { path: "plant" },
    ]);
    let reviewsData = [];

    reviews.forEach((r) => {
      const review = reviewDTO(r);
      reviewsData.push(review);
    });
    return res.status(200).json({
      type: "success",
      message: "Fetch plant reviews",
      data: {
        reviews: reviewsData,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createPlantReview = async (req, res, next) => {
  // check for field level validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: "User input error",
      data: errors.mapped(),
    });
  }

  const { ratings, content } = req.body;
  const userId = res.locals.user._id;
  const { plantId } = req.params;

  try {
    // check plant exists
    let plant = await Plant.findById(req.params.plantId);

    if (!plant) {
      return next({ status: 404, message: "Plant does not exists" });
    }

    // check for user already review this plant
    const review = await Review.findOne({
      user: userId,
      plant: plantId,
    }).select("user plant");

    if (review) {
      return next({ status: 400, message: "You already review this plant" });
    }

    // create new review
    const newReview = new Review({
      user: userId,
      plant: plantId,
      ratings,
      content,
    });

    // save review in review collection
    let saveReview = await newReview.save();

    saveReview = await saveReview.populate([
      { path: "user", select: "name email" },
      { path: "plant" },
    ]);

    return res.status(201).json({
      type: "success",
      message: "Plant review created successfully",
      data: {
        review: reviewDTO(saveReview),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePlantReview = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.plantId);
    if (!plant) {
      return next({ status: 404, message: "Plant does  not exists" });
    }

    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return next({ status: 404, message: "Review does  not exists" });
    }
    await review.remove();

    return res.status(201).json({
      type: "success",
      message: "Plant review removed successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
