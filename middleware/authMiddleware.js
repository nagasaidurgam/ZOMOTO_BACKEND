const jwt = require("jsonwebtoken");
const db = require("../config/db");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const actualToken = token.split(" ")[1];

    try {

        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        //check user exists and not deleted

        const [users] = await db.query(
            "SELECT * FROM users WHERE id =? AND is_deleted = 0",
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "user deleted or not found"
            });
        }

        req.user = users[0];

        next();

    } catch (err) {
        console.log("JWT Error:", err.message);
        return res.status(401).json({ message: "Invalid Token" });
    }
};


//header checking, token split,  jwt verify, requser to store, next


