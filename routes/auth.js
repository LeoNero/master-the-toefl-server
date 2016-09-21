'use strict'

const User = require('../models/user.js');
const authController = require('../controllers/auth.js');
const authUtils = require('../config/authUtils.js');

const cors = require('cors');

module.exports = (app, corsOptions) => {
  app.options('*', cors(corsOptions));

  app.post('/auth/facebook', cors(corsOptions), authController.facebook);
  app.get('/auth/me', [cors(corsOptions), authUtils.ensureAuthenticated], authController.getMe);
};