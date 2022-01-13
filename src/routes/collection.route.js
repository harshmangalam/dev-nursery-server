const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const checkAuth = require("../middlewares/auth.middleware");
const checkAdmin = require("../middlewares/admin.middleware");

const {
  createCollection,
  fetchCollections,
  updateCollection,
  deleteCollection,
  fetchCollection,
} = require("../controllers/collection.controller");

const collectionValidation = [
  body("name").not().isEmpty().withMessage("Collection name must be required"),
  body("image")
    .not()
    .isEmpty()
    .withMessage("Collection image must be required"),
];

router.get("/", fetchCollections);
router.get("/:collectionId", fetchCollection);
router.post("/", checkAuth, checkAdmin, collectionValidation, createCollection);
router.put(
  "/:collectionId",
  checkAuth,
  checkAdmin,
  collectionValidation,
  updateCollection
);
router.delete(
  "/:collectionId",
  checkAuth,
  checkAdmin,
  collectionValidation,
  deleteCollection
);

module.exports = router;
