const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
});

const Role = mongoose.model("Roles", roleSchema);
module.exports = Role;
