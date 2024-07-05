const express = require("express");
const logger = require("morgan");
const uid = require("uuid");
const mongoose = require("mongoose");

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(logger("dev"));

const connection = mongoose.connect("mongodb://localhost:27017/kc-stage4");
connection
  .then(() => console.log("connection successful to mongodg database"))
  .catch((error) =>
    console.log("Error occur while trying to connect. Error ", error)
  );

// user schema used for validation--------------------------
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
});

// user model --------------------------
const userCollection = mongoose.model("users", userSchema);

// Route Create users ----------------
server.post("/user", async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;

  await userCollection.create({
    userName,
    userEmail,
    userPassword,
  });
  res.send("User created succesfully");
});

// Get all users ---------------------
server.get("/", async (req, res) => {
  const users = await userCollection.find({});

  res.send(users);
});

server.listen(3000, () => console.log("server is up"));
