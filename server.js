const express = require("express");
const app = express();
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Zomato Backend API",
            version: "1.0.0",
            description: "A simple Food Delivery API Documentation",
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));


//routes 
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));


//test routes
app.get("/", (req, res) => {
    res.send("API RUNNING");
});

//server start
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});

// npm init -y, npm i express, npm i nodemon 




/* This project is a Food Delivery Platform Backend API (very similar to Zomato or UberEats). It is built using Node.js, Express.js, and MySQL.

Here is a breakdown of how the whole project is structured and how it works:

1. Architecture Choice: MVC (Model-View-Controller)
The project is built using a common web architecture called MVC (specifically Router-Controller-Database logic), making the code modular and easy to manage.

routes/: Acts as the traffic cop. It maps URL endpoints (like /api/menu/addMenuItem) to the specific function that should run.
controllers/: Contains the core business logic. This is where data is validated, database queries are written, and JSON responses are sent back.
middleware/: Functions that run "in the middle" of a request, used for verifying permissions before the controller is allowed to execute.
config/db.js: Central file to establish a connection pool to your MySQL database using the mysql2 package.
2. The Core Entities
The system is built around 4 main database entities representing the platform:

Users (userRoutes): Handles customer management. Includes registration, profiles, and potentially soft-deletes (is_deleted = 0).
Restaurants (restaurantRoutes): Handles the creation and management of restaurants. Restaurants are owned by specific users.
Menus (menuRoutes): Allows restaurants to create food items with prices and link them to their restaurant. Customers can fetch these menus.
Orders (orderRoutes): The logic that allows customers to place food orders, tying together a user, a restaurant, and menu items.
3. Unified Authentication System
You are using a robust JSON Web Token (JWT) system combined with Role-Based Access Control (RBAC):

Unified Login: There is a single authController.js that handles logging in for everyone. It generates a JWT that securely holds the user's id and their role.
Access vs Refresh Tokens: You have implemented a modern security standard where users get a short-lived Access Token (e.g., 15 minutes or 1 day) and a long-lived Refresh Token (7 days) so they don't have to keep logging in.
Roles:
user: Can view menus and place orders.
restaurant: Can own a restaurant and manage/add menu items.
admin: Has overarching privileges across the platform (checked via adminMiddleware.js).
4. Extra Security Layer
API Key (apiKeyMiddleware.js): Along with user authentication, some of your routes mandate an x-api-key header. This protects your server from being hit by external scripts/bots and ensures the requests are coming from your actual authorized frontend app (React/Angular/Mobile).*/