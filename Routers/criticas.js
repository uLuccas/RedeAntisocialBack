const express = require("express");
const router = express.Router();
const {
  getCriticas,
  deleteCriticas,
  updateCriticas,
  postCriticas,
  updateDislike,
} = require("../Functions/criticas");

router.get("/getCriticas", getCriticas);
router.delete("/deleteCritica", deleteCriticas);
router.put("/updateCriticas", updateCriticas);
router.post("/postCritica", postCriticas);


module.exports = router;
