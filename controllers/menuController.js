const db = require("../config/db")

exports.addMenuItem = async(req, res) => {
    try{
        if(req.user.role !== "restaurant")
            return res.status(403).json({message: 
        "Access Denied"})

        const{name, price} = req.body

        if(!name || !price){
            return res.status(400).json({message: "All fields are required"})
        }

        const[result]= await db.query(
            "INSERT INTO menu_items (name, price, restaurant_id) values(?, ?, ?)",
            [name, price, req.user.id]
        );

        res.status(201).json({
            message: "Menu created Successfully",
            restaurantId: result.insertId
        })

    }catch(error){
        res.status(500).json({message: "Internal server error"})
    }
}


//getmenuby restaurant


exports.getMenuById = async(req, res) => {

    try{
    const[data]= await db.query(
        "select * from menu_items where restaurant_id =?",
        [req.user.id]
);


        res.status(200).json({
            message: "Menu fetched asuccessfully",
            data: data,

});

    }catch(error){
        res.status(500).json({message: "Internal server error"})
    }
};

//update menu

exports.updateMenu = async(req, res) => {
    try{

        const id  = req.params.id
        const {name, price} = req.body

        if(!name && !price){
            return res.status(400).json({meesage: "At least one field required"});
        }

        const[result] = await db.query(
            "UPDATE menu_items SET name =?, price=?,  WHERE id = ?",
            [name, price, id] 
        );

        if(result.affectedRows === 0){
            return res.status(404).json({message: "Menu not found",
                
            });
        }

        res.json({
            message: "Menu Updated Successfully",
        });

    }catch(error){
        res.status(500).json({message: "Internal server error"});
    }
};

//delete menu

exports.deleteMenu = async(req, res) => {
    try{
        const id = req.params.id;

        const[result] = await db.query(
            "DELETE FROM menu_items WHERE id = ?",
            [id]
        );

            if(result.affectedRows ===0){
                return res.status(200).json({message: "menu deleted successfully"})

            }

            res.json({
                message: "Menu deleted successfully",
            });
        

    }catch(error){
        res.status(500).json({message: "Internal server error"})
    }
}