const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  oauthId: String,
  displayName: String
});

mongoose.model('users', userSchema);