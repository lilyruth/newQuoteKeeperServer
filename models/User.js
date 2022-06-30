const mongoose = require('mongoose');
const {Quotes, QuoteSchema} = require('./Quote.js')
const {PasswordReset, PasswordResetSchema} = require ('./PasswordReset')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
 name: {
  type: String,
  required: true
 },
 email: {
  type: String,
  required: true
 },
 password: {
  type: String,
  required: true
 },
 quotes: [QuoteSchema]
})

const User = mongoose.model('User', UserSchema);

module.exports = User;