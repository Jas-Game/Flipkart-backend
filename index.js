const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());

const { router: authRoutes, authenticateJWT } = require("./auth");
const cartRoutes = require("./cart");
app.use(authRoutes);
app.use(cartRoutes);

mongoose.connect(
  "mongodb+srv://Jasvanth:Jasvanth1010@fullstack-mern-blog-v1.irx6lw4.mongodb.net/ecommerce",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.get("/products", async (req, res) => {
  try {
    const products = await produc.find();
    res.json(products);
  } catch {
    res.status(500).json({ error: "there is internal server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "the items that you were searching for does not exits",
      });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json();
  }
});

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
