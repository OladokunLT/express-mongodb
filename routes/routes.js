const express = require("express");
const {
  register,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.get("/", getAllUsers);
userRoute.get("/user/:id", getSingleUser);
userRoute.put("/user/:id", updateUser);
userRoute.delete("/user/:id", deleteUser);

module.exports = userRoute;
