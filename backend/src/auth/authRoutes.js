const express = require("express");

const router = express.Router();

const { registerUser, loginUser, verifyOtp } = require("./authController");
const authMiddleware = require("../middleware/authMiddleware");


// Register API
router.post("/register", registerUser);


// Login API
router.post("/login", loginUser);


// Complete Login MFA Challenge
router.post("/verify-otp", verifyOtp);


// Protected Profile API
router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        user: req.user
    });
});


module.exports = router;
