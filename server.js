const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const app = express();
const path = require("path");

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(multer().array());
app.use(cors());
app.use(morgan("common"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Routes Middleware
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/contact", contactRoute);
//ERROR Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
  )
  .catch((err) => console.log(err));
