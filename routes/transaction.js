const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../model/user');
const Transaction = require('../model/transaction');
const ethPriceRouter = require('./ethPrice');

// POST method for fetching transactions for a specific user
router.post('/transactions', async (req, res) => {
  try {
    // Find the user with the specified address
    // const user = await User.findOne({ address: req.body.address });

    // if (!user) {
    //   return res.status(404).send('User not found');
    // }

    // Fetch transactions from the Etherscan API
    const apiKey = 'FPIIR6I9BSQC5QCR6WH68PGS7PYRV51YQ9';
    const response = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'txlist',
        address: req.body.address,
        startblock: 0,
        endblock: 'latest',
        sort: 'desc',
        apikey: apiKey
      }
    });

    // Filter out invalid transactions
    const txList = response.data.result.filter((tx) => {
      return tx.isError === '0' && tx.txreceipt_status === '1' && tx.contractAddress === '';
    });

    // Create a new transaction document for each valid transaction, with a reference to the user
    const transactions = await Promise.all(txList.map(async (tx) => {
      const transaction = new Transaction({
        blockNumber: tx.blockNumber,
        timeStamp: tx.timeStamp,
        hash: tx.hash,
        nonce: tx.nonce,
        blockHash: tx.blockHash,
        transactionIndex: tx.transactionIndex,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gas: tx.gas,
        gasPrice: tx.gasPrice,
        isError: tx.isError,
        txreceipt_status: tx.txreceipt_status,
        input: tx.input,
        contractAddress: tx.contractAddress,
        cumulativeGasUsed: tx.cumulativeGasUsed,
        gasUsed: tx.gasUsed,
        confirmations: tx.confirmations,
      });

      return transaction.save();
    }));

    res.send(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send('Error fetching transactions');
  }
});

module.exports = router;
