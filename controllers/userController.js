const bcrypt = require("bcrypt");
const { userCollection } = require("../models/users");
const { v4 } = require("uuid");
const { sendEmail } = require("../utils/emailerUtil");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const token = v4();

  await userCollection.create({
    fullName,
    email,
    password: hashedPassword,
    authToken: token,
    authPurpose: "verify-email",
  });

  await sendEmail(
    email,
    "verify email",
    "Hello " +
      fullName +
      ", Use this link to verify your email http://localhost:3000/users/auth/verify-email/" +
      token
  );

  res.status(201).send({
    isSuccessful: true,
    message: "Kindly check your email to verify it",
    token,
  });
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  const doesUserExit = await userCollection.exists({
    authToken: token,
    authPurpose: "verify-email",
  });

  if (!doesUserExit) {
    res.status(404).send({
      isSuccessful: false,
      message: "User does not exist",
    });
    return;
  }

  await userCollection.findOneAndUpdate(
    { authToken: token, authPurpose: "verify-email" },
    { isEmailVerified: true, authToken: "", authPurpose: "" }
  );

  res.send({
    isSuccessful: true,
    message: "Email verification is successful",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userCollection.findOne({ email });
  console.log("value of user is: ", user);
  if (!user) {
    res.status(404).send({
      isSuccessful: false,
      message: "Not found",
    });
    return;
  }

  const doPasswordMatch = bcrypt.compareSync(password, user.password);

  if (!doPasswordMatch) {
    res.status(400).send({ isSuccessful: false, message: "Bad request" });
    return;
  }

  // Encrypting the userID and userEmail using jwt
  const userToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.AUTH_KEY
  );

  res.status(201).send({
    isSuccessful: true,
    userDetails: {
      fullName: user.fullName,
      email: user.email,
    },
    userToken,
    message: "Login successful",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const doesEmailExist = await userCollection.exists({ email });

  if (!doesEmailExist) {
    res.status(400).send({
      isSuccefull: false,
      message: "Email is not in our database",
    });
    return;
  }

  const userToken = v4();
  const user = await userCollection.findOne({ email });
  const uniqueId = jwt.sign(
    {
      userId: user._id,
      userToken,
    },
    process.env.AUTH_KEY
  );

  // storing password reset token
  await userCollection.findOneAndUpdate(
    { email },
    { passwordResetToken: uniqueId }
  );

  res.status(201).send({
    isSuccessful: true,
    uniqueId,
    message: "Use the uniqueID to reset your password",
  });
};

const resetPassword = async (req, res) => {
  const { password, passwordResetToken } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  // "password": "$2b$10$UP/Upfe/pZk6tGXPPC4xuuyxF0qWcHNf3eIjh6ipPcBOwgdTAG3Oe"

  const doTokenExist = await userCollection.exists({ passwordResetToken });
  if (!doTokenExist) {
    res.send({
      isSuccefull: false,
      message: "Token incorrect",
    });
    return;
  }

  await userCollection.findOneAndUpdate(
    { passwordResetToken },
    { password: hashedPassword, passwordResetToken: "" }
  );

  res.status(201).send({
    isSuccefull: true,
    message: "Password reset successful",
  });
};

// Get All Users
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
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
