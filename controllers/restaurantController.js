const db = require("../config/db")


//create restaurants

exports.createRestaurant = async (req, res) => {
    try {

        //role check

        //  if(req.user.role !== 'restaurant'){
        //return res.status(403).json({message: "Access Denied"})
        // }
        const { name, location } = req.body;

        if (!name || !location) {
            return res.status(400).json({
                message: "Name and location are required",
            });
        }

        const [result] = await db.query(
            "INSERT INTO restaurants (name, owner_id, location) VALUES (?, ?, ?)",
            [name, req.user.id, location]
        );

        res.status(201).json({
            message: "Restaurant created successfully",
            restaurantId: result.insertId,
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "server error",
            error: error.message
        })
    }
}



//get all restaruants

exports.getAllRestaurants = async (req, res) => {
    try {
        const [data] = await db.query(
            "SELECT * FROM restaurants"
        );

        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })

    }
};

//get restaurant by id

exports.getRestaurantById = async (req, res) => {
    try {
        const id = req.params.id;

        const [restaurant] = await db.query(

            "SELECT * FROM restaurants where id =?",
            [req.params.id]
        );

        if (restaurant.length === 0) {
            return res.status(404).json({
                message: "Restaurant not found",
            });
        }

        res.json(restaurant[0]);

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};