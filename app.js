const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const formData = require("express-form-data");
const routes = require('./src/modules/routes/routes');
const dotenv = require('dotenv').config();
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET,
  secure: true
});

const dbURL = process.env.DB_URL;
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex:true});

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use(formData.parse());
app.use('/', routes);

app.listen(process.env.PORT || 8000, () => console.log("LET'S ROCK"));
