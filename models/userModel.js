const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be up to 6 characters"],
      //maxLength: [30, "Password must be less than 30 characters "],
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default:
        "https://res.cloudinary.com/dnoobzfxo/image/upload/v1698319918/download_uu7enk.png",
    },
    phone: {
      type: String,
      default: "+94",
    },
    bio: {
      type: String,
      default: "bio",
      maxLength: [250, "Password must be less than 250 characters "],
    },
  },
  { timestamps: true }
);

//encrypt password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
