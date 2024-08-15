// Import the required modules
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { profile, searchUsers, sendFraindRequest } = require("../controllers/user");


// profile route
router.post("/me",auth,profile);
router.get("/searchUser",auth,searchUsers)
router.put("/sendRequest",auth,sendFraindRequest)



module.exports = router
