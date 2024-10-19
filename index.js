const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');

mongoose
  .connect('mongodb://127.0.0.1:27017/GoogleDB')
  .then(() => {
    console.log('Connecting to mongodb...');
  })
  .catch((e) => {
    console.log(e);
  });

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(8080, () => {
  console.log('Server running on port 8080.');
});
