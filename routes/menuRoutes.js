const express = require("express");
const router = express.Router();


const menuController = require("../controllers/menuController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

router.post("/addMenuItem", apiKeyMiddleware, authMiddleware, menuController.addMenuItem);
router.post("/getMenuById", apiKeyMiddleware, authMiddleware, menuController.getMenuById);
router.post("/getAllMenus", apiKeyMiddleware, authMiddleware, adminMiddleware, menuController.getAllMenus);
router.post("/updateMenu/:id", apiKeyMiddleware, authMiddleware, menuController.updateMenu);
router.post("/deleteMenu/:id", apiKeyMiddleware, authMiddleware, menuController.deleteMenu);



module.exports = router;
