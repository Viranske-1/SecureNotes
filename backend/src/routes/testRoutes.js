const express = require("express");

const router = express.Router();

const { testDatabase } = require("../controllers/testController");


router.get("/database", testDatabase);


module.exports = router;