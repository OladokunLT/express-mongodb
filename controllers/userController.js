const bcrypt = require("bcrypt");
const { userCollection } = require("../models/users");
const { v4 } = require("uuid");
const { sendEmail } = require("../utils/emailerUtil");

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
      ", Use this link to verify your email http://localhost/3000/users/auth/verify-email/" +
      token
  );

  res.status(201).send({
    isSuccessful: true,
    message: "Kindly check your email to verify it",
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
  const userToken = jwt.sign({
    userId: user._id,
    email: user.email,
  });

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
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
