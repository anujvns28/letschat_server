// Import the required modules
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { createGroup, getMyChats, groupChats, addMembers, removeMember, leaveGroup, sendAttachments, getChatDetails } = require("../controllers/chat");


// app.use(auth);

router.post("/newGroup",auth,createGroup)
router.get("/myChats",auth,getMyChats);
router.get("/myGroups",auth,groupChats);
router.put("/addMembers",auth,addMembers);
router.put("/removeMember",auth,removeMember);
router.put("/leaveGroup",auth,leaveGroup);

// message
router.post("/message",auth,sendAttachments);
router.post("/:chatId",auth,getChatDetails)

module.exports = router
