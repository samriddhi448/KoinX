const mongoose = require('mongoose');

const ethPriceSchema = new mongoose.Schema({
  price: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EthPrice', ethPriceSchema);
