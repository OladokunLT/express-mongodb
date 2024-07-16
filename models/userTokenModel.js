const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const userTokenCollection = mongoose.model("userToken", userTokenSchema);

module.exports = { userTokenCollection };
