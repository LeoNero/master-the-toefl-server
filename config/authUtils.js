'use strict';

const moment = require('moment');
const jwt = require('jwt-simple');
const config = require('../config/config.js');

exports.createJWT = user => {
  let payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };

  return jwt.encode(payload, config.TOKEN_SECRET);
};

exports.handleError = (res, err) => {
    return res.send(400, err);
};

exports.ensureAuthenticated = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }

  let token = req.headers.authorization.split(' ')[1];

  let payload = null;
  
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  } catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }

  req.user = payload.sub;

  next();
};