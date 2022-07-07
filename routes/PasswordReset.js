const express = require('express');
const resetPasswordRouter = express.Router();
const nodemailer = require('nodemailer');
const PasswordReset = require('../models/PasswordReset');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// transporter
const transporter = nodemailer.createTransport({
 service: "outlook",
 auth: {
  user: process.env.AUTH_EMAIL,
  pass: process.env.AUTH_PASS,
 },
})

// BcryptJS
const bcrypt = require('bcryptjs');
let salt = bcrypt.genSaltSync(10);


// password reset email function 

resetPasswordRouter.post('/request', (req, res) => {
 let { email} = req.body;
 let redirectUrl = 'https://quotekeeper.io/passwordreset/reset'
 email = email.trim();
 let reset = uuidv4().replace(/-/g, '').slice(0, 14)

 bcrypt.genSalt(10, function (err, salt) {
  bcrypt.hash(reset, salt, function (err, hash) {

   User.findOne({ email })
    .then(result => {
     if (!result) {
      res.status(404).send('email not found')
     }

     else {
     let user = result.email;
     //console.log(result.email, reset)

     PasswordReset.findOneAndDelete({ userId: user })
      .catch(err => console.log(err))

     const newPasswordReset = new PasswordReset({
      userId: user,
      reset: hash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000
     })

     newPasswordReset.save()
      .then(result => {
       transporter.sendMail(mailOptions)
        .then(() => {
         res.status(200).send('password reset email sent')
        })
        .catch(err => console.log(err, 'reset email failed to send'))
      })
      .catch(err => {
       console.log(err)
      })
     }
    })
    .catch(err => {
     console.log(err)
    })
 
  })
 })
 
 
 const mailOptions = {
  from: process.env.AUTH_EMAIL,
  to: email,
  subject: "QuoteKeeper: Reset your password",
  html: `<p>You received this email because a reset password link was requested.</p><p>This link expires in one hour.</p><p>Click <a href=${redirectUrl}>here</a> to reset your password.</p><p>Your temporary password is <strong>${reset}</strong>.</p><p><em>Make each day a new horizon. ~ Christopher McCandless</em></p>`
 }
})

resetPasswordRouter.post('/reset', (req, res) => {
 
 let { email, resetString, password } = req.body;

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const password_result = PASSWORD_REGEX.test(password);

if (!password_result) {
 res.status(403).send('Enter a valid password')
}

else {
 
 PasswordReset.findOne({ email })
  .then(result => {
   if (result) {
    if (result.expiresAt < Date.now()) {
     res.status(410).send('Reset link has expired')
    }
    let reset = result.reset;
    bcrypt.compare(resetString, reset)
     .then(result => {
      if (result) {

       bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {

         User.findOneAndUpdate({ email }, { password: hash })
          .then(res.status(201).send('Password successfully updated.'))
          .catch(err => {
           res.status(400).send('Unable to update password. Please try again.')
          })
        })
       })
      }
      else {
       res.status(403).send('Reset key does not match. Please try again.')
      }
     })
     .catch(error => {
      console.log(error)
     })
   }
   else {
    res.status(404).send('could not locate record')
   }
  })
  .catch(err => {
   console.log(err)
   res.status(404).send('could not locate record')
  })
  PasswordReset.findOneAndDelete({email})
  .catch(err => console.log(err))
 }
})


module.exports = resetPasswordRouter;