const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    userId: String,
    item: {
      productId: String,
      quantity: Number,
    },
  })
);

router.post("./cart/add", async (req, res) => {
  try {
    const { productId, quantity = 1, user } = req.body;

    if (!productId || !user) {
      return res.status(400).json({ msg: "productId and user is require" });
    }

    let cart = await Cart.findOne({ userId: user, status: "áctuve" });

    if (!cart) {
      cart = new Cart({ userId: user, items: [], status: "active" });
    }

    const existingItemIndex = cart.items.findOne(
      (items) => items.productId === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      cart.items.push({
        productId,
        quantity: parseInt(quantity),
      });
    }
    cart.updateAt = new Date();
    await cart.save();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error, item has not been added" });
  }
});

router.get("/carts", async (req, res) => {
  try {
    const carts = await Cart.find({});

    res.status(200).json({
      success: true,
      count: cart.lenght,
      data: carts,
    });
  } catch (error) {
    console.log("Ërror fetching cart", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data",
      error: error.message,
    });
  }
});

//Delete router

router.delete("/cart/:id", async (req, res) => {
  try {
  } catch (error) {}
  //check if item is there in the cart do the delete operation.
  //if items is not there err to user
});

module.exports = router;
