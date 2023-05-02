const express = require("express");
const { sendMessage, fetchMessage } = require("../controller/messageController");
const { isAuth } = require("../middleware/isAuth");
const router = express.Router();


router.post("/",isAuth,sendMessage);
router.get("/:id",isAuth,fetchMessage);
module.exports  = router;