const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
  exposedHeaders: ['Authorization']
}));

app.use(express.json());

// Importar rutas
const rutastest = require('./rutastest');
app.use('/api', rutastest);

module.exports = app;