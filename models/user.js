const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, minLength: 4 },
  password: { type: String, requird: true },
});

module.exports = mongoose.model("User",UserSchema);