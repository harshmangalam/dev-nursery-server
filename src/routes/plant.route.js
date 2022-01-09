const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const checkAuth = require("../middlewares/auth.middleware");
const checkAdmin = require("../middlewares/admin.middleware");

const {
  createPlant,
  fetchPlants,
  updatePlant,
  deletePlant,
  fetchPlant,
  fetchPlantReviews,
  createPlantReview,
  deletePlantReview,
} = require("../controllers/plant.controller");

const plantValidation = [
  body("name").not().isEmpty().withMessage("Plant name must be required"),
  body("price").not().isEmpty().withMessage("Plant price must be required"),
  body("collection")
    .not()
    .isEmpty()
    .withMessage("Plant collection must be required"),
];

const plantReviewValidation = [
  body("ratings")
    .not()
    .isEmpty()
    .withMessage("Review ratings  must be required"),
  body("content")
    .not()
    .isEmpty()
    .withMessage("Review content  must be required"),
];
router.get("/", fetchPlants);
router.get("/:plantId", fetchPlant);
router.post("/", checkAuth, checkAdmin, plantValidation, createPlant);
router.put("/:plantId", checkAuth, checkAdmin, plantValidation, updatePlant);
router.delete("/:plantId", checkAuth, checkAdmin, deletePlant);

// plant reviews routes
router.get("/:plantId/reviews", fetchPlantReviews);
router.post(
  "/:plantId/reviews",
  checkAuth,
  plantReviewValidation,
  createPlantReview
);
router.delete("/:plantId/reviews/:reviewId", checkAuth, deletePlantReview);
module.exports = router;
