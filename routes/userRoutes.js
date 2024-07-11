const express = require("express");
const {
  register,
  verifyEmail,
  login,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.get("/auth/verify-email/:token", verifyEmail);
userRoute.post("/login", login);
userRoute.get("/", getAllUsers);
userRoute.get("/user/:id", getSingleUser);
userRoute.put("/user/:id", updateUser);
userRoute.delete("/user/:id", deleteUser);

module.exports = userRoute;
