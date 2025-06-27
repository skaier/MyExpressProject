const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const configureServer = (app) => {
  // Security middleware
  app.use(helmet());
  app.use(cors());
  
  // Request logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};

module.exports = configureServer;