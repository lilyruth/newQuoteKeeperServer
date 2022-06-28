const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
 quote: String,
 author: String
})

const Quotes = mongoose.model('Quotes', QuoteSchema);

module.exports = {Quotes, QuoteSchema};