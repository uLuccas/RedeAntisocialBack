const express = require("express");
const router = express.Router();
const {
  getFeed,
  deletePost,
  alterarPost,
  newPost,
  getFeedMe,
  updateDislike,
} = require("../Functions/feed");

router.get("/", getFeed);
router.get("/:_id", getFeedMe);
router.delete("/deletePost", deletePost);
router.put("/alteraPost", alterarPost);
router.post("/post", newPost);
router.put("/updateDislike", updateDislike);
module.exports = router;
