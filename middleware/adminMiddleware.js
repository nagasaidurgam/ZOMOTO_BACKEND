
module.exports = (req, res, next) => {

//check user exists (auth middleware run are not)

try{
    if(!req.user){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
// check role 

    if(req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access Denied"
        });
    }

        next();

    }catch(error){
        res.status(401).json({message:"Invalid Token"});
    }

}
