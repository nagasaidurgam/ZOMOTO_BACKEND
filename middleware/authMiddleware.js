const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if(!token || !token.startsWith("Bearer ")){
        return res.status(401).json({
            message: "No token provided"
        });
    }
    
    const actualToken = token.split(" ")[1];
    
    try{

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded;

    next();

    }catch(error){
        return res.status(401).json({message: "Invalid Token" });
    }
};


//header checking, token split,  jwt verify, requser to store, next


