const express = require("express");
const logger = require("morgan");
const uid = require("uuid");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userRoute = require("./routes/routes");

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
// moved to models/users.js
/*
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
*/

// user model --------------------------
// const userCollection = mongoose.model("users", userSchema);

// Route Create users ----------------
// moved to routes/routes and controllers/userController
/*
server.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  await userCollection.create({
    fullName,
    email,
    password: hashedPassword,
  });
  res.status(200).send({
    message: "User created succesfully",
  });
});
*/
// Get all users ---------------------
// server.get("/", async (req, res) => {
//   const users = await userCollection.find({});

//   res.send(users);
// });

// get single user
// server.get("/user/:id", async (req, res) => {
//   const user = await userCollection.findById(req.params.id);

//   res.send(user);
// });

// server.patch("/user/:id", async (req, res) => {
//   const userId = req.params.id;
//   const { password } = req.body;
//   const user = await userCollection.findByIdAndUpdate(userId, { password });
//   console.log(user);

//   res.send({
//     message: "user password record updated sucessfully",
//   });
// });

//

server.use("/users", userRoute);

server.listen(3000, () => console.log("server is up"));
