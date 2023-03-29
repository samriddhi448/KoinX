const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../model/transaction');

// GET method for fetching balance and price for a specific user
router.get('/user/:address', async (req, res) => {
  try {
    const address = req.params.address;
    
    // Find transactions where user is either sender or receiver
    const txList = await Transaction.find({
      $or: [{ from: address }, { to: address }],
      isError: '0',
      txreceipt_status: '1',
      contractAddress: ''
    });
    
    // Calculate balance of user
    let balance = 0;
    for (let i = 0; i < txList.length; i++) {
      const tx = txList[i];
      if (tx.from === address) {
        balance -= parseFloat(tx.value);
      } else {
        balance += parseFloat(tx.value);
      }
    }
    
    // Fetch current ETH price
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const ethPrice = response.data.ethereum.usd;
    
    res.send({ balance, ethPrice });
  } catch (error) {
    console.error('Error fetching user balance and ETH price:', error);
    res.status(500).send('Error fetching user balance and ETH price');
  }
});

module.exports = router;
