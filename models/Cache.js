const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const CacheSchema = new Schema({
 name: {
  type: String,
  required: true
 },
 quotes: []
})

const Cache = mongoose.model('Cache', CacheSchema);

module.exports = Cache;