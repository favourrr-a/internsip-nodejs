
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  age: { type: Number, min: 18, max: 99 },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
