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

module.exports = {
  register,
  getAllUsers,
};
