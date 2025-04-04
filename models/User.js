const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const BaseUserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
}, { discriminatorKey: 'userType', timestamps: true });

BaseUserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

module.exports = mongoose.model('User', BaseUserSchema);
