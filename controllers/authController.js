const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//register

exports.register = async (req, res) => {

    try {
        const { name, email, password, role } = req.body;

        //validation

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        //email validation

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid Email"
            });
        }

        //role validation
        const validRoles = ["user", "restaurant", "admin"];

        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        //duplicate check

        const [existing] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        //hashed password

        const hashed = await bcrypt.hash(password, 10);

        //insert user into database

        await db.query(
            "INSERT INTO users(name, email, password, role) values(?, ?, ?, ?)",
            [name, email, hashed, role]
        );

        res.status(201).json({
            message: "User registered successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "server error",
            error: error.message
        })
    }
};




//login

exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // check user
        const [users] = await db.query(
            "SELECT * FROM  users WHERE email = ? AND is_deleted= 0",
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({
                message: "User not found"

            });
        }

        const user = users[0];

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Wrong Password"
            });
        }


        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const refreshToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        });



    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "server error",
            error: error.message
        });
    }
};

//refresh token

exports.refreshToken = async (req, res) => {

    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh Token required"
            });
        }

        const decoded = jwt.verify(
            refreshToken, process.env.JWT_REFRESH_SECRET
        );

        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({
            accessToken: newAccessToken
        });


    } catch (error) {
        console.error(error)
        res.status(403).json({
            message: "Invalid refresh token",
            error: error.message
        });
    }
}