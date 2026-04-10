const db = require("../config/db");
const bcrypt = require("bcryptjs");

//get all users

exports.getAllUsers = async (req, res) => {

    try {
        const [data] = await db.query(
            " SELECT id, name, email, role FROM users"
        );

        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}


//get user by id

exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;

        const [data] = await db.query(
            "SELECT id, name, email, role FROM users WHERE id =? AND  is_deleted =0",
            [id]);


        if (data.length === 0) {
            return res.status(404).json({
                message: "user not found"

            });
        }

        res.json(data[0]);

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
};


//update user
exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and Email are required",
            });
        }

        const [result] = await db.query(

            "UPDATE users SET name =?, email =?  WHERE id=? ",
            [name, email, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json({ message: "User Updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server error",
            error: error.message
        });
    }
}

//delete user

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id

        const [result] = await db.query(
            "UPDATE users SET is_deleted=1  WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json({
            message: "User Deleted Successfully",
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}