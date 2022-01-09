const Plant = require("../models/plant.model");
const plantDTO = require("../dto/plant.dto");
const slugify = require("../utils/slug.util");
const { validationResult } = require("express-validator");

exports.fetchPlant = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.plantId);

    if (!plant) {
      return next({
        status: 404,
        message: "Plant does not exists",
        data: { plantId: req.params.plantId },
      });
    }

    return res.status(200).json({
      type: "success",
      message: "Fetch plant by id",
      data: {
        plant: plantDTO(plant),
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
      message: "Fetch plants",
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
    const plant = await Plant.findOne({ name });
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

    const savePlant = await newPlant.save();

    return res.status(201).json({
      type: "success",
      message: "Plant created successfully",
      data: {
        plant: plantDTO(savePlant),
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
    next(error);
  }
};

exports.deletePlant = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.plantId);
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
