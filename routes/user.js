// Import the required modules
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { profile } = require("../controllers/user");


// profile route
router.post("/me",auth,profile);




module.exports = router
