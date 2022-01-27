const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name : String,
    firstName : String,
    email : String,
    password : String,
    userJouneys : { type: mongoose.Schema.Types.ObjectId, ref: 'journeys' },
  });
  
  var UserModel = mongoose.model('users', userSchema);

  module.exports = UserModel; 