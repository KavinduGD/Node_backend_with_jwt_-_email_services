const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");

router.get("/register", (req, res) => {
  res.send("ass");
});

module.exports = router;
