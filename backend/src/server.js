const express = require("express");
const cors = require("cors");
require("dotenv").config();

const testRoutes = require("./routes/testRoutes");
const errorHandler = require("./middleware/errorHandler");


const app = express();

const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/test", testRoutes);


// Default route
app.get("/", (req, res) => {
    res.json({
        message: "SecureNotes API is running"
    });
});


// Global Error Handler
app.use(errorHandler);


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});