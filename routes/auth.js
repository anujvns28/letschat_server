// Import the required modules
const express = require("express");
const router = express.Router();
const { signUp, login,  logout } = require("../controllers/auth");
const { auth } = require("../middleware/auth");

//signup routes
router.post("/signup",signUp);
// login routes
router.post("/login",login);
// logout routes
router.get("/logout",logout)






module.exports = router
