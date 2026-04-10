const express = require("express");
const router = express.Router();

const restaurantController = require("../controllers/restaurantController");
const authMiddleware = require("../middleware/authMiddleware");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

router.post("/createRestaurant", apiKeyMiddleware, authMiddleware, restaurantController.createRestaurant);
router.post("/getAllRestaurants", apiKeyMiddleware, authMiddleware, restaurantController.getAllRestaurants);
router.post("/getRestaurantById/:id", apiKeyMiddleware, authMiddleware, restaurantController.getRestaurantById);

module.exports = router;





