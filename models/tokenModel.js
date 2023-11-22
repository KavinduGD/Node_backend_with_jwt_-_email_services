const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    red: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Token = mongoose.model("token", tokenSchema);

module.exports = Token;
