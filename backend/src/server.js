const express = require("express");
const cors = require("cors");
require("dotenv").config();

const testRoutes = require("./routes/testRoutes");


const app = express();

const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.use("/api/test", testRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "SecureNotes API is running"
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});