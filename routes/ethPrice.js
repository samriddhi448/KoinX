const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const EthPrice = require('../model/ethPriceSchema');

async function fetchAndStoreEthPrice() {
  console.log('Fetching eth price')
  try {
    console.log('Fetching eth price inside transaction')
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
    console.log('12345',response.data);
    const ethPrice = new EthPrice({ price: response.data.ethereum.inr });
    await ethPrice.save();
    console.log('Ethereum price saved to database:', ethPrice);
  } catch (error) {
    console.error('Error fetching Ethereum price:', error);
  }
}
setInterval(fetchAndStoreEthPrice, 60000);


// Route to retrieve the latest ETH price
router.get('/', async (req, res) => {
  try {
    // Find the latest ETH price in the database
    const ethPrice = await EthPrice.findOne().sort({ createdAt: -1 });

    if (!ethPrice) {
      return res.status(404).send('No ETH price found in the database');
    }

    res.send({ price: ethPrice.price });
  } catch (error) {
    console.error('Error retrieving ETH price:', error);
    res.status(500).send('Internal server error');
  }
});

// Export the router

module.exports = router;
