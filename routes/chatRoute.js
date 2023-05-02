const express = require("express");
const { accessChat, createGroup, removeFromGroup, addToGroup } = require("../controller/chatController");
const router  = express.Router();
const {isAuth} = require("../middleware/isAuth");

router.post("/",isAuth,accessChat);
router.post("/create",isAuth,createGroup);
router.post('/remove',isAuth,removeFromGroup);
router.post("/add",isAuth,addToGroup)
module.exports  = router;