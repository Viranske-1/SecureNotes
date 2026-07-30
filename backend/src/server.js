const express = require("express");
const cors = require("cors");
require("dotenv").config();


// Routes
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./auth/authRoutes");
const noteRoutes = require("./routes/noteRoutes");


// Middleware
const errorHandler = require("./middleware/errorHandler");


const app = express();

const PORT = process.env.PORT || 5000;


// Global Middleware
app.use(cors());
app.use(express.json());


// API Routes
app.use("/api/test", testRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/notes", noteRoutes);


// Default Route
app.get("/", (req, res) => {
    res.json({
        message: "SecureNotes API is running"
    });
});


// Error Handler
// Always keep this after routes
app.use(errorHandler);


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
