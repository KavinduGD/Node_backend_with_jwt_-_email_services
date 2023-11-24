const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  //Validation
  if (!name || !sku || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  //Manage image upload
  let fileData = {};
  if (req.file) {
    //upload

    let uploadedFile;

    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Inventory App",
        resource_type: "image",
      });
    } catch (err) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  //Create product
  const product = await Product.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  res.status(201).json(product);
});

//Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort("-createdAt");
  if (products) {
    res.status(200).json(products);
  } else {
    res.status("404");
    throw new Error("Products can't be found");
  }
});

//get Single product

const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.user.toString() == req.user.id) {
      res.status(200).json(product);
    } else {
      res.status(401);
      throw new Error("User not authorized");
    }
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    if (product.user.toString() == req.user.id) {
      await Product.findOneAndDelete({ _id: req.params.id });
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(401);
      throw new Error("User not authorized");
    }
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.user.toString() == req.user.id) {
      //Manage image upload
      let fileData = {};
      if (req.file) {
        //upload

        let uploadedFile;

        try {
          uploadedFile = await cloudinary.uploader.upload(req.file.path, {
            folder: "Inventory App",
            resource_type: "image",
          });
        } catch (err) {
          res.status(500);
          throw new Error("Image could not be uploaded");
        }

        fileData = {
          fileName: req.file.originalname,
          filePath: uploadedFile.secure_url,
          fileType: req.file.mimetype,
          fileSize: fileSizeFormatter(req.file.size, 2),
        };
      }

      //update  product
      const updatedProduct = await Product.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name: name || product.name,
          sku: sku || product.sku,
          category: category || product.category,
          quantity: quantity || product.quantity,
          price: price || product.price,
          description: description || product.description,
          image: Object.keys(fileData).length !== 0 ? fileData : product.image,
        },
        { new: true }
      );

      res.status(201).json(updatedProduct);
    } else {
      res.status(401);
      throw new Error("User not authorized");
    }
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
};
