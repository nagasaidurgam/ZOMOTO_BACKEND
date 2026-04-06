const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
//middleware
const authMiddleware = require("../middleware/authMiddleware");


router.post("/getAllUsers", authMiddleware, userController.getAllUsers);
router.post("/getUserById/:id", authMiddleware, userController.getUserById);
module.exports = router;
