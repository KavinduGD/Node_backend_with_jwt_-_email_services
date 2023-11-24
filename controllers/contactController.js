const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");

const contactUs = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  console.log(subject);
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  //Validation
  if (!subject || !message) {
    res.status(400);
    throw new Error("Please add subject and message");
  }
  const reply_to = user.email;
  const sent_to = process.env.EMAIL_USER;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, sent_to, sent_from, reply_to);
    res.status(200).json({ success: true, message: "Email Sent" });
  } catch (err) {
    res.status(500);
    throw new Error("Email not sent,Please try again");
  }
});

module.exports = { contactUs };
