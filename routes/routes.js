const express = require("express");
const { register, getAllUsers } = require("../controllers/userController");
const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.get("/", getAllUsers);

module.exports = userRoute;
