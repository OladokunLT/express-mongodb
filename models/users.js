const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    // loggedInUser: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "users",
    // },
    email: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    authToken: {
      type: String,
    },
    authPurpose: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// user model --------------------------
const userCollection = mongoose.model("users", userSchema);

module.exports = {
  userCollection,
};
