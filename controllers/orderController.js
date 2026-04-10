const db = require("../config/db");

//place order

exports.placeOrder = async(req, res) => {
    try{
        const userId = req.user.id;
        const{items }= req.body;

        //validation

        if(!items || items.length === 0){
            return res.status(400).json({
                message: "No items Provided",
            });
        }

        let totalAmount = 0;

        //caluclate total

        for(let item of items) {
            const[menu] = await db.query(
                "SELECT price FROM menu_items WHERE id = ?",
                [item.menu_item_id]
            );

            if(menu.length === 0){
                return res.status(404).json({
                    message: "Menu item not found",
                });
            }

            totalAmount += menu[0].price * item.quantity;

        }

        //insert into orders

        const[orderResult] = await db.query(
            "INSERT INTO orders(user_id, total_amount, status) values(?, ?, ?)",
            [userId, totalAmount, "placed"]
        );

        const orderId = orderResult.insertId;

//insert into order_items

 for(let item of items){
    await db.query(
        "INSERT INTO order_items (order_id, menu_item_id, quantity) values (?, ?, ?)",
        [orderId, item.menu_item_id, item.quantity]

    );
 }
res.status(201).json({
    message: "Order Placed Successfully",
});

    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error",
            error: error.message
        });
    }
}


//get my orders

exports.getMyOrders = async(req, res) => {
    try{

        const[data]=await db.query(
            "select * from orders where user_id= ?",
            [req.user.id]
        );

        res.status(200).json({
            message: "Orders fetched successfully",
            data: data,
        });

    }catch(error){
        console.error(error)
        res.status(500).json({message: "Internal server error",
            error: error.message
        });
    }
};

//getall orders(admin)

exports.getAllOrders = async(req, res) => {
    try{
        const[data]= await db.query(

            "SELECT * FROM orders "
        );

        res.status(200).json({
            message: "All orders fetched",
            data: data,
        });
    
        }catch(error){
        console.error(error)
        res.status(500).json({message: "Internal server error",
            error: error.message
        });
    }
    
}

//get all orders with details

exports.getAllOrdersWithDetails = async(req, res)=> {

    try{
        const[data]= await db.query(`
            SELECT u.id, u.name as user_name, r.name, oi.order_id, oi.quantity, mi.name, mi.price, o.status
            FROM users u o.user_id = u.id
            JOIN restaurants r ON r.id = mi.restaurant.id
            JOIN  ON order_items oi oi.order_id = mi.id
            JOIN ON menu_items mi 
            JOIN ON orders o`)

    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error",
            error: error.message
        })

    }
}

//update order status

exports.updateOrderStatus = async(req, res) => {
    try{
        const id = req.params.id;
        const { status } = req.body;

        if(!status){
            return res.status(400).json({
                message: "Status is required",
            });
        }

        const[result] = await db.query(

            "UPDATE orders SET status=?  WHERE id=?",
            [status, id]
        );

        if(result.affectedRows === 0){
            return res.status(404).json("order not updated");
        }
        
        res.status(200).json("order Updated successfully");

    }catch(error){
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

