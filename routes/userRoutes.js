const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
//middleware
const authMiddleware = require("../middleware/authMiddleware");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");


router.post("/getAllUsers", apiKeyMiddleware, authMiddleware, userController.getAllUsers);
router.post("/getUserById/:id", apiKeyMiddleware, authMiddleware, userController.getUserById);
router.post("/updateUser/:id", apiKeyMiddleware, authMiddleware, userController.updateUser);
router.post("/deleteUser/:id", apiKeyMiddleware, authMiddleware, userController.deleteUser);

module.exports = router;
