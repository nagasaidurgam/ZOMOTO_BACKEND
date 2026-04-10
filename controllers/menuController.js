const db = require("../config/db")

exports.addMenuItem = async (req, res) => {

    try {

        // Bypassed for testing
        /*
        if (req.user.role !== "restaurant")
            return res.status(403).json({
                message:
                    "Access Denied"
            })
        */

        const { name, price, restaurant_id } = req.body

        if (!name || !price) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // 🔥 STEP 1: get restaurant id from restaurants table (or from request body for testing)
        let restaurantId = restaurant_id;

        if (!restaurantId) {
            const [restaurant] = await db.query(
                "SELECT id FROM restaurants WHERE owner_id = ?",
                [req.user.id]
            );

            if (restaurant.length === 0) {
                return res.status(400).json({
                    message: "Restaurant not found. For testing, please provide 'restaurant_id' in your JSON body!"
                });
            }
            
            restaurantId = restaurant[0].id;
        }


        //  STEP 3: insert menu item
        const [result] = await db.query(
            "INSERT INTO menu_items (name, price, restaurant_id) VALUES (?, ?, ?)",
            [name, price, restaurantId]
        );

        res.status(201).json({
            message: "Menu created successfully",
            menuId: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


//getmenuby restaurant


exports.getMenuById = async (req, res) => {

    try {
        // Allow passing restaurant_id in body for testing, fallback to req.user.id
        const restaurantId = req.body.restaurant_id || req.user.id;

        const [data] = await db.query(
            "select * from menu_items where restaurant_id =?",
            [restaurantId]
        );


        res.status(200).json({
            message: "Menu fetched successfully",
            data: data,

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
};

//get all menus

exports.getAllMenus = async (req, res) => {

    try {
        const [data] = await db.query(
            `select m.id, m.name as menu_name, m.price, r.name as Restaurant_Name
            from menu_items m
            join restaurants r 
            on m.restaurant_id = r.id`
        );

        res.status(200).json({
            message: "All menus fetched successfully",
            data: data,
        });


    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}
//update menu

exports.updateMenu = async (req, res) => {
    try {

        const id = req.params.id
        const { name, price } = req.body

        if (!name || !price) {
            return res.status(400).json({ meesage: "At least one field required" });
        }

        const [result] = await db.query(
            "UPDATE menu_items SET name =?, price=?  WHERE id = ?",
            [name, price, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Menu not found",

            });
        }

        res.json({
            message: "Menu Updated Successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

//delete menu

exports.deleteMenu = async (req, res) => {

    try {
        const id = req.params.id;

        const [result] = await db.query(
            "DELETE FROM menu_items WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "menu not found" });

        }

        res.json({
            message: "Menu deleted successfully",
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}