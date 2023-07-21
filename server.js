const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const connectDB = require('./db');
const connectPC = require('./pc')
const bodyParser = require('body-parser');
const user = require('./routes/api/user');
const difficulty = require('./routes/api/difficulty');
const skill = require('./routes/api/skill');
const attribute = require('./routes/api/attribute');
const ability = require('./routes/api/ability')
const unregisteredQueue = require('./routes/api/unregisteredQueue')
const message = require('./routes/api/message')

const app = express();

// Use environment variable for port or fallback to 5000
const port = process.env.PORT || 5001;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS, DELETE');
    next();
});

app.enable('trust proxy');
app.use(morgan("dev"));
app.use(helmet());

connectDB();
connectPC();

app.use('/api/v1/user', user);
app.use('/api/v1/difficulty', difficulty);
app.use('/api/v1/skill', skill);
app.use('/api/v1/attribute', attribute);
app.use('/api/v1/ability', ability)
app.use('/api/v1/unrQueue', unregisteredQueue)
app.use('/api/v1/message', message)

//Handle uncaught exception
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
  process.exit(1);
});

//Error handling middleware
app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`API Server listening on port ${port}`))