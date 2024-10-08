// Import the required modules
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  profile,
  searchUsers,
  sendFraindRequest,
  acceptRequest,
  getAllNotifaction,
  getMyFrainds,
} = require("../controllers/user");

// profile route
router.post("/me", auth, profile);
router.get("/searchUser", auth, searchUsers);
router.put("/sendRequest", auth, sendFraindRequest);
router.put("/acceptRequest", auth, acceptRequest);
router.get("/allNotifaction", auth, getAllNotifaction);
router.get("/frainds", auth, getMyFrainds);



module.exports = router
