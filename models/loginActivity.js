const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const loginActivitySchema = new Schema({
  token: { type: String, required: true },
  userId: {type: mongoose.Types.ObjectId, ref: "User", required: true},
  loginDate: {type: Date, required: true}
});

module.exports = mongoose.model('loginActivity', loginActivitySchema);
