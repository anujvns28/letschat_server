// Import the required modules
const express = require("express");
const router = express.Router();
const { signUp, login, profile } = require("../controllers/auth");
const { auth } = require("../middleware/auth");

//signup routes
router.post("/signup",signUp);
// login routes
router.post("/login",login);

// profile route
router.post("/me",auth,profile);




module.exports = router
