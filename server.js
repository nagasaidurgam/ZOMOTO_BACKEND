const express = require("express");
const app= express();

app.use(express.json());

//routes 
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/Restaurants", require("./routes/restaurantRoutes"));
// app.use("/api/orders", require("./routes/orderRoutes"));

//test routes
app.get("/", (req, res) => {
    res.send("API RUNNING");
});

//server start
const port = process.env.PORT || 5000;

app.listen (port,() => {
    console.log(`server running on port ${port}`);
});

// npm init -y, npm i express, npm i nodemon 