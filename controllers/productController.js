const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;
  console.log("sds");
  console.log(name, price);
  //Validation
  if (!name || !sku || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  //Manage image upload

  //Create product
  const product = await Product.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
  });

  res.status(201).json(product);
});

const s = asyncHandler(async (req, res) => {});

module.exports = { createProduct };

// {
//   "name":"Soap",
//   "sku":"34234",
//   "category":"cloth",
//   "quantity":34,
//   "price":45,
//   "description":"puka hodana saban"

// }
// {
//   "email":"kavidugihan222@gmail.com",
//   "password":"newP1234"
// }
