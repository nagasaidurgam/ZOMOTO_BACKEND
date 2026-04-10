const express = require("express");
const router = express.Router();


const orderController = require("../controllers/orderController")

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


router.post("/placeOrder", authMiddleware, orderController.placeOrder);
router.post("/getMyOrders", authMiddleware, orderController.getMyOrders);
router.post("/getAllOrders", authMiddleware, adminMiddleware, orderController.getAllOrders);
router.post("/updateOrderStatus/:id", authMiddleware, adminMiddleware, orderController.updateOrderStatus);

module.exports = router;