const bcrypt = require("bcrypt");
const { userCollection } = require("../models/users");
const { get } = require("mongoose");

const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  await userCollection.create({
    fullName,
    email,
    password: hashedPassword,
  });

  res.send({
    message: "User created successfully",
  });
};

const getAllUsers = async (req, res) => {
  res.send(await userCollection.find({}));
};

const getSingleUser = async (req, res) => {
  const user = await userCollection.findById(req.params.id);

  res.send(user);
};

const updateUser = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  await userCollection.findByIdAndUpdate(req.params.id, {
    email,
    password: hashedPassword,
  });

  res.send("user updated successfully");
};

const deleteUser = async (req, res) => {
  await userCollection.findByIdAndDelete(req.params.id);

  res.send("user deleted");
};

module.exports = {
  register,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
