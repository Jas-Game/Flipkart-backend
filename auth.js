const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrptjs = require("bcryptjs");
const router = express.Router();

const user = mongoose.model(
  "Úser",
  new mongoose.Schema({ email: String, password: String })
);

//sinup router
router.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exits" });
  }
  const hashedPassword = await bcrypt.hash({ password });
  const user = user({ email, password: hashedPassword });
  await user.save();
  const token = jwt.sign({ userId: user._id }, "secret", { expiriesIn: "1h" });
  res.status(200).json({ token });
});

//login router
router.post("/auth/login", async (req, res) => {
  const { emal, password } = req.bod;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });
    res.status(200).json({ token });
  } else {
    res.status(400).json({ error: "Ïnvalid credentials" });
  }
});

//jwt middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.header.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secret", (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports = { router, authenticateJWT };
