
const express = require('express');

const app = express();

app.use(express.json());

require('dotenv').config();


app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})
const mongoose = require('mongoose');
const routes = require('./routes/transaction');
const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString);
const database = mongoose.connection
database.once('connected', () => {
  console.log('Database Connected');
})
database.on('error', (error) => {
  console.log(error)
})
app.use('/api', routes)

const ethPriceRouter = require('./routes/ethPrice');
app.use('/eth-price', ethPriceRouter);
const currBalance = require('./routes/currBalance');
app.use('/curr-balance', currBalance);
