const express = require("express");
const router = express.Router();

const restaurantController = require("../controllers/restaurantController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/createRestaurant", authMiddleware, restaurantController.createRestaurant);
router.post("/getAllRestaurants", authMiddleware, restaurantController.getAllRestaurants);
router.post("/getRestaurantById/:id", authMiddleware, restaurantController.getRestaurantById);

module.exports = router;


