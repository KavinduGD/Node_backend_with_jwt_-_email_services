const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodParser = require("body-parser");
const cors = require("cors");

const app = express();

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
