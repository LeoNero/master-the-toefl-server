'use strict'

const User = require('../models/user.js');
const Task = require('../models/task.js');
const Audio = require('../models/audio.js');
const Feedback = require('../models/feedback.js');

const request = require('request');
const jwt = require('jwt-simple');
const authUtils = require('../config/authUtils.js');
const config = require('../config/config.js');

const AuthController = {
  facebook(req, res) {
    const accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
    const graphApiUrl = 'https://graph.facebook.com/v2.3/me';
    
    let facebookSecret;

    if (req.body.clientId == '1546232092069197') {
      facebookSecret = config.FACEBOOK_SECRET_DEV;
    } else {
      facebookSecret = config.FACEBOOK_SECRET_PROD;
    }

    const params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: facebookSecret,
      redirect_uri: req.body.redirectUri
    };

    request.get({ url: accessTokenUrl, qs: params, json: true }, (err, response, accessToken) => {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: accessToken.error.message });
      }

      request.get({ url: graphApiUrl, qs: accessToken, json: true }, (err, response, profile) => {
        if (response.statusCode !== 200) {
          return res.status(500).send({ message: profile.error.message });
        }

        if (req.headers.authorization) {
          User.findOne({ facebook: profile.id }, (err, existingUser) => {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
            }

            let token = req.headers.authorization.split(' ')[1]; 
            let payload = jwt.decode(token, config.TOKEN_SECRET);

            User.findById(payload.sub, (err, user) => {
              if (!user) {
                console.log("User not found");
                return res.status(400).send({ message: 'User not found' });
              }

              user.name = user.name || profile.name;
              user.email = user.email || profile.email;
              user.facebook = user.facebook || profile.id;

              user.save(() => {
                let token = authUtils.createJWT(user);
                console.log("User saved! 1");
                res.send({ token: token });
              });
            });
          });
        } else {
          User.findOne({ facebook: profile.id }, (err, existingUser) => {
            if (existingUser) {
              let token = authUtils.createJWT(existingUser);
              console.log("User found");
              return res.send({ token: token });
            }

            let user = new User();

            user.name = profile.name;
            user.email = profile.email;
            user.facebook = profile.id;

            user.save((err) => {
              if (err) {
                console.log(err);
              }

              let token = authUtils.createJWT(user);

              console.log("User saved! 2");
              res.send({ token: token });
            });
          });
        }
      });
    });
  },

  getMe(req, res) {
    User
      .findById(req.user) 
      .populate({
        path: 'audios',
        model: 'Audio',
        populate: {
          path: 'task',
          model: 'Task'
        }
      })
      .populate({
        path: 'feedbacks',
        model: 'Feedback',
        populate: {
          path: 'audio',
          model: 'Audio'
        }
      })
      .exec((err, user) => {
        if (!user) {
          return res.status(404).send({message: 'User not found'});
        }

        res.send(user);
    });
  }
};

module.exports = AuthController;