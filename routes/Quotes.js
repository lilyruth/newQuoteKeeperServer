const express = require('express');
const quoteRouter = express.Router();
const User = require('../models/User');
const verifyJWT = require('../middleware/verifyJWT');

quoteRouter.route('/:userId')
.get(verifyJWT, (req,res) => {
 User.findById(req.params.userId)
 .then(response => {
  if (!response) {
   res.status(404).send(); 
  } else {
   res.json(response.quotes); 
  }
 }).catch(err => {
  res.send(err)
  console.log(err)
 }).catch(err => {
  res.send(err)
  console.log(err)
 })
})

.post(verifyJWT, (req,res) => {
 let {quote, author} = req.body;
 User.findById(req.params.userId)
 .then(User => {
  User.quotes.push({quote,author})
  User.save()
  res.status(200).send({quote, author})
 }).catch(err => {
  res.json(err)
  console.log(err)
 })
 .catch(err => {
  res.json(err)
  console.log(err)
 })
})


quoteRouter.route('/:userId/random')
.get(verifyJWT, (req,res) => {
 User.findById(req.params.userId)
 .then(response => {
  if (!response) {
   res.status(404).send()
  } else {
    let length = response.quotes.length;
    let index = Math.floor(Math.random() * length)
    res.json(response.quotes[index])
   }
  }).catch(err => {
   res.json(err)
   console.log(err)
  })
  .catch(err => {
   res.json(err)
   console.log(err)
  })
})

quoteRouter.route('/:userId/:favoriteId')
.delete(verifyJWT, (req,res) => {
 User.findById(req.params.userId)
  .then(User => {
   if (User.quotes.id(req.params.favoriteId)) {
    User.quotes.id(req.params.favoriteId).remove()
    User.save()
    res.status(204).send()
   }
   res.status(404).send()
  })
  .catch(err => {
   res.json(err)
   console.log(err)
  })
  .catch(err => {
   res.json(err)
   console.log(err)
  })
})

    
module.exports = quoteRouter;