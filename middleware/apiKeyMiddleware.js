module.exports = (req, res, next) => {
    try {
        const apiKey = req.headers["x-api-key"];

        if (!apiKey || apiKey !== process.env.API_KEY.trim()) {
            return res.status(403).json({
                message: "Invalid API Key"
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
