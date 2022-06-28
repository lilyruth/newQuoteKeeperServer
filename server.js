//MongoDB
require('./config/db');

//Express
const express = require('express');
const cors = require('cors')
const app = express();

// for form data
app.use(express.urlencoded({extended: false}))

// middleware for json
app.use(express.json());

// cross origin resource sharing

// allowed sites
// const allowed = ['https://www.quotekeeper.netlify.app', 'https://quotekeeper.netlify.app', 'http://127.0.0.1', '127.0.0.1', 'http://localhost', 'http://localhost:3000', 'http://localhost:3001']

//if origin is not in allowed sites 
/* const corsOptions = {
 origin: (origin, callback) => {
  if (allowed.indexOf(origin) !== -1) {
   callback(null, true)
  } else {
   callback(new Error('Not in CORS allowed list'))
  }
 }, 
 optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
*/
// add back in options before deploying
app.use(cors())

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

const UserRouter = require('./routes/User');
const QuoteRouter = require('./routes/Quotes');

app.use('/users', UserRouter);
app.use('/quotes', QuoteRouter);

//be able to see the error in the browser
app.use(function (err, req, res, next) {
 console.error(err.stack)
 res.status(500).send(err.message);
})

app.listen(port, () => {
 console.log('server running at port ' + port);
})

