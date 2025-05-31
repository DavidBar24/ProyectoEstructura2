require('dotenv').config();

module.exports = {
  SECRETO_JWT: process.env.JWT_SECRET || 'secreto_desarrollo_123'
};