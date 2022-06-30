const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();


// BcryptJS
const bcrypt = require('bcryptjs');
let salt = bcrypt.genSaltSync(10);

//User model 
const User = require('../models/User');

// Register
router.post('/register', (req, res) => {
 let { name, email, password } = req.body;
 name = name.trim();
 email = email.trim();
 password = password.trim();

const NAME_REGEX = /^[a-zA-Z][a-zA-Z-_' ]{1,23}$/
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const name_result = NAME_REGEX.test(name);
const email_result = EMAIL_REGEX.test(email);
const password_result = PASSWORD_REGEX.test(password);

if (!name_result || !email_result || !password_result) {
 res.status(403).send()
}
else {
 User.findOne({ email })
 .then(result => {
  if (result) {
   res.json({ message: 'The email aready exists' })
  } else if (!result) {
   bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
     const newUser = new User({
      name,
      email,
      password: hash
     })

     newUser.save().then(record => {
      res.json({ status: 'success', message: 'registration successful'})

     }).catch(err => {
      res.json(err)
      console.log(err)
     })
    })
   })

  }
 })
 .catch(err => {
  console.log(err)
  res.json(err)
 })
}
})


 

// Sign in 
router.post('/login', (req, res) => {
 let { email, password } = req.body;

 email = email.trim();
 password = password.trim();

 User.findOne({ email })
  .then(record => {
   if (record) {
    let hash = record.password;
    bcrypt.compare(password, hash)
     .then(result => {
      if (result) {
       const accessToken = jwt.sign(
        { "email": email }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '7200s' }
       );
       let id = record.id
       res.json({ status: 'success', message: 'login successful', accessToken, id })
      } else {
       res.json({ status: 'failed', message: 'invalid password entered' })
      }
     })
     .catch(err => {
      res.json(err)
      console.log(err)
     })
   } else {
    res.json({ status: 'failed', message: 'no user found' })
   }
  })
  .catch(err => {
   console.log(err)
   res.json(err)
  })

})

module.exports = router;