// first open the DB by using
// mongod --dbpath ./mongo-data/
// endpoint: http://localhost:5000/api/products

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const shortid = require("shortid");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/Eshop", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

//define porduct model. Mongoose.model() is responsible for creating a model and it accepts two parameters
// 1 param : the name of this collection inside the DB. 2: the list of fields of this model into the DB

const Product = mongoose.model(
  "products",
  new mongoose.Schema({
    _id: { type: String, default: shortid.generate },
    title: String,
    description: String,
    image: String,
    price: Number,
    availableSizes: [String],
  })
);

//the endpoint is req res and the body of function
app.get("/api/products", async (req, res) => {
  //find takes no param, it means there is no condition and return all products
  //the .find() is the promise. To get the data we need to use the new syntax of async await function. make the function async
  const products = await Product.find({});
  res.send(products);
});

//create products
app.post("/api/products", async (req, res) => {
  //sending a req fron frontend to this endpoint we need to fill req.body with that data of the new product
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.send(savedProduct);
});

app.delete("/api/products/:id", async (req, res) => {
  //the function comes from the product model.  req.params.id = :id
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  res.send(deletedProduct);
});

// 5000 is offically variable default 5000
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("server at http://localhost:5000"));
