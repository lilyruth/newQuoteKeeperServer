const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
require('dotenv').config();
const verifyJWT = require('../middleware/verifyJWT');


// BcryptJS
const bcrypt = require('bcryptjs');
let salt = bcrypt.genSaltSync(10);

// transporter
const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
})

//User model 
const User = require('../models/User');

// Register
router.post('/register', (req, res) => {
  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim().toLowerCase();
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
          res.status(409).send('The email aready exists')
        } else if (!result) {
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
              const newUser = new User({
                name,
                email,
                password: hash
              })

              newUser.save()
                .then(result => {
                  transporter.sendMail(mailOptions)
                })
                .catch(err => {
                  res.send(err)
                  console.log(err)
                })
                .then(res.status(201).send('registration successful'))
                .catch(err => console.log(err))
            })
          })

        }
      })
      .catch(err => {
        console.log(err)
        res.send(err)
      })

    //Mail options 

    const homepage = 'https://quotekeeper.io'
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Thank you for joining QuoteKeeper!",
      html: `<p>Thank you for registering for QuoteKeeper!</p><p>Click <a href=${homepage}>here</a> to login.</p><p><em>What you get by achieving your goals is not as important as what you become by achieving your goals. ~ Henry David Thoreau</em></p>`
    }
  }
})




// Sign in 
router.post('/login', (req, res) => {
  let { email, password } = req.body;

  email = email.trim().toLowerCase();
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
              let name = record.name
              res.json({ accessToken, id, name })
            } else {
              res.status(403).send('invalid password entered')
            }
          })
          .catch(err => {
            res.json(err)
            console.log(err)
          })
      } else {
        res.status(404).send('no user found')
      }
    })
    .catch(err => {
      console.log(err)
      res.json(err)
    })

})

router.route('/delete')
.post(verifyJWT, (req, res) => {

  let { email, password } = req.body;

  email = email.trim().toLowerCase();
  password = password.trim();

  User.findOne({ email })
    .then(record => {
      if (record) {
        let hash = record.password;
        bcrypt.compare(password, hash)
          .then(result => {
            if (result) {
              User.deleteOne({email})
              .then(res.json({message: 'User account successfully deleted.'}))
              .catch(err => {
                console.log(err)
              })
            } else {
              res.status(403).send('invalid password entered')
            }
          })
          .catch(err => {
            res.json(err)
            console.log(err)
          })
      } else {
        res.status(404).send('no user found')
      }
    })
    .catch(err => {
      console.log(err)
      res.json(err)
    })




})
  

module.exports = router;