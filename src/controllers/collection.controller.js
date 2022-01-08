const Collection = require("../models/collection.model");
const collectionDTO = require("../dto/collection.dto");
const slugify = require("../utils/slug.util");
const { validationResult } = require("express-validator");

exports.fetchCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.collectionId);

    return res.status(200).json({
      type: "success",
      message: "Fetch collection by id",
      data: {
        collection: collectionDTO(collection),
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
      message: "Fetch collections",
      data: {
        collections: collectionsData,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.createCollection = async (req, res, next) => {
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

    const slug = slugify(name);

    const newCollection = new Collection({
      name,
      image,
      description,
      slug,
    });

    const saveCollection = await newCollection.save();

    return res.status(201).json({
      type: "success",
      message: "Collection created successfully",
      data: {
        collection: collectionDTO(saveCollection),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCollection = async (req, res, next) => {
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

    const saveCollection = await collection.save();

    return res.status(201).json({
      type: "success",
      message: "Collection updated successfully",
      data: {
        collection: collectionDTO(saveCollection),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.collectionId);
    if (!collection) {
      return next({ status: 404, message: "Collection  not exists" });
    }

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
