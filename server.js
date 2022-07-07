const axios = require('axios')
const rateLimit = require('express-rate-limit')

// Rate Limiter 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})



//MongoDB
require('./config/db');

const Cache = require('./models/Cache');

//API
const API = 'https://zenquotes.io/api/quotes/'

// Get Quote Cache
async function getQuotesInitial() {

  try {
    let response = await axios.get(API)

    let quotes = response.data.map(record => {
       return [record.q, record.a]
    }).filter(record => !record[1].includes('Lincoln'))

    let name = '1'
    const newCache = new Cache({
      name, 
      quotes
     })
  
     newCache.save()
     .then(result => console.log(result))
     .catch(err => {
      console.log(err)
     })
  }

  catch(err) {
    console.log(err)
  }
  
 }

 getQuotesInitial();

 async function getQuotesInterval() {
  try {
    let response = await axios.get(API)
    let quotes = response.data.map(record => {
      return [record.q, record.a]
      }).filter(record => !record[1].includes('Lincoln'))
  Cache.findOneAndUpdate({name: '1'}, {quotes})
  .then(result => console.log(result))
  .catch(err => console.log(err))

 }

 catch(err) {
   console.log(err)
 }
 }
 function quoteInterval() {
  getQuotesInterval();
}

 setInterval(quoteInterval, 3600000)
 
//Express
const express = require('express');
const cors = require('cors')
const app = express();

//rate limiter
app.use(limiter)

// for form data
app.use(express.urlencoded({extended: false}))

// middleware for json
app.use(express.json());

// cross origin resource sharing

// allowed sites
const allowed = ['https://www.quotekeeper.netlify.app', 'https://quotekeeper.netlify.app', 'https://quotekeeper.io', 'https://www.quotekeeper.io']

//if origin is not in allowed sites 
const corsOptions = {
 origin: (origin, callback) => {
  if (allowed.indexOf(origin) !== -1) {
   callback(null, true)
  } else {
   callback(new Error('Not in CORS allowed list'))
  }
 }, 
 optionsSuccessStatus: 200
}

//app.use(cors(corsOptions))

// add back in options before deploying
app.use(cors())

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

const UserRouter = require('./routes/User');
const QuoteRouter = require('./routes/Quotes');
const PasswordResetRouter = require('./routes/PasswordReset');

app.get('/quotebank', (req, res) => {
  Cache.findOne({name: '1'})
  .then(result => {
    res.json(result.quotes)
  })
  .catch(err => console.log(err))
})

app.use('/users', UserRouter);
app.use('/quotes', QuoteRouter);
app.use('/passwordreset', PasswordResetRouter);

//be able to see the error in the browser
app.use(function (err, req, res, next) {
 console.error(err.stack)
 res.status(500).send(err.message);
})

app.listen(port, () => {
 console.log('server running at port ' + port);
})

