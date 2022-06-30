const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasswordResetSchema = new Schema({

 userId: {
  type: String,
  required: true
 },
 reset: {
  type: String,
  required: true
 }, 
 createdAt: Date,
 expiresAt: Date,
})

const PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema);

module.exports = PasswordReset;