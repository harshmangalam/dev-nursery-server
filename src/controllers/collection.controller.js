const Collection = require("../models/collection.model");
const Plant = require("../models/plant.model");
const collectionDTO = require("../dto/collection.dto");
const collectionDetailDTO = require("../dto/collectionDetail.dto");
const slugify = require("../utils/slug.util");
const { validationResult } = require("express-validator");
const plantDto = require("../dto/plant.dto");

exports.fetchCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.collectionId);

    if(!collection){
      return next({status:404,message:"Collection does not exists"})
    }
    // count total plants in collections
    const countPlants = await Plant.countDocuments({
      collection: req.params.collectionId,
    });

    const plants = await Plant.find({ collection: req.params.collectionId });
    const plantsData = [];

    plants.forEach((plant) => {
      const transforPlant = plantDto(plant);
      plantsData.push(transforPlant);
    });
    return res.status(200).json({
      type: "success",
      message: "Fetch collection detail",
      data: {
        collection: collectionDetailDTO({
          ...collection._doc,
          countPlants,
          plants: plantsData,
        }),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find();

    let collectionsData = [];

    collections.forEach((c) => {
      const collection = collectionDTO(c);
      collectionsData.push(collection);
    });
    return res.status(200).json({
      type: "success",
      message: "Fetch collection lists",
      data: {
        collections: collectionsData,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.createCollection = async (req, res, next) => {
  // return api field level validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: "User input error",
      data: errors.mapped(),
    });
  }
  const { name, description, image } = req.body;
  try {
    const collection = await Collection.findOne({ name });
    if (collection) {
      return next({ status: 400, message: "Collection  already exists" });
    }

    // create slug from collection name
    const slug = slugify(name);

    // create new collection
    const newCollection = new Collection({
      name,
      image,
      description,
      slug,
    });

    // save collection
    const saveCollection = await newCollection.save();

    return res.status(201).json({
      type: "success",
      message: "Collection created successfully",
      data: {
        collectionId: saveCollection._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCollection = async (req, res, next) => {
  // return api field level validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: "User input error",
      data: errors.mapped(),
    });
  }
  const { name, description, image } = req.body;
  try {
    const collection = await Collection.findById(req.params.collectionId);
    if (!collection) {
      return next({ status: 404, message: "Collection  not exists" });
    }

    if (name !== collection.name) {
      collection.name = name;
      collection.slug = slugify(name);
    }

    collection.description = description;
    collection.image = image;

    // save collection
    const saveCollection = await collection.save();

    return res.status(201).json({
      type: "success",
      message: "Collection updated successfully",
      data: {
        collection: collectionDTO(saveCollection),
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return next({ status: 400, message: "Collection already exists" });
    }
    next(error);
  }
};

exports.deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(
      req.params.collectionId
    ).select("_id");
    if (!collection) {
      return next({ status: 404, message: "Collection  not exists" });
    }

    // delete collection if exists 
    await collection.remove();

    return res.status(201).json({
      type: "success",
      message: "Collection removed successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
