const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const data = require('../store');
const { v4: uuid } = require('uuid');

const app = express();
const { NODE_ENV, API_TOKEN } = require('./config');
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan(morganOption));

function requireAuth(req, res, next) {
  const authValue = req.get('Authorization') || ' ';

  //verify bearer
  if (!authValue.toLowerCase().startsWith('bearer')) {
    return res.status(400).json({ error: 'Missing bearer token' });
  }

  const token = authValue.split(' ')[1];

  if (token !== API_TOKEN) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  next();
}


// eslint-disable-next-line no-unused-vars
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!');
});

app.get('/address', (req, res) => {
  res.json(data);
});

app.post('/address', requireAuth, (req, res) => {
  const id = uuid();
  const { firstName, lastName, address1, address2 = false, city, state, zip } = req.body;

  if (!firstName) {
    return res.status(400);
  }

  if (!lastName) {
    return res.status(400);
  }

  if (!address1) {
    return res.status(400);
  }

  if (!city) {
    return res.status(400);
  }

  if (!state || String(state).length !== 2) {
    return res.status(400);
  }

  if (!zip || String(zip).length !== 5) {
    //put in more error handling info on 5 num
    return res.status(400);
  }

  const newAddress = { id, firstName, lastName, address1, address2, city, state, zip };

  data.push(newAddress);
  res.status(201).json(newAddress);
});

app.delete('/address/:id', (req, res) => {
  const indexOfAddress= data.findIndex(user => user.id = req.params.id);
  data.splice(indexOfAddress, 1);
  console.log(data);
  res.status(204).end();
});


module.exports = app;
