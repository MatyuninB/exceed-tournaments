const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./src/modules/routes/routes');
const dotenv = require('dotenv').config();

const dbURL = process.env.DB_URL;
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex:true});

app.use(bodyParser.json());
app.use(cors());
app.use('/', routes);

app.listen(process.env.PORT || 8000, () => console.log("LET'S ROCK"));
