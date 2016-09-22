'use strict'

const apiController = require('../controllers/api.js');
const authUtils = require('../config/authUtils.js');

const cors = require('cors');

module.exports = (app, corsOptions) => {
  app.options('*', cors(corsOptions));

  app.get('/api/tasks/:number', cors(corsOptions), apiController.getTasksByNumber);

  app.get('/api/audios/:page', cors(corsOptions), apiController.getAllAudios);
  app.get('/api/audio/:shortId', cors(corsOptions), apiController.getAudioById);
  app.post('/api/audio/new', [cors(corsOptions), authUtils.ensureAuthenticated], apiController.newAudio);
  app.delete('/api/audio/:id', [cors(corsOptions), authUtils.ensureAuthenticated], apiController.deleteAudioById);

  app.post('/api/feedback/new', [cors(corsOptions), authUtils.ensureAuthenticated], apiController.newFeedback);
  app.get('/api/audio/:shortId/feedbacks', cors(corsOptions), apiController.getAudioFeedbacks);
  app.delete('/api/feedback/:id', [cors(corsOptions), authUtils.ensureAuthenticated], apiController.deleteFeedbackById);

  app.post('/api/user/change_pontuation', [cors(corsOptions), authUtils.ensureAuthenticated], apiController.changeUserPontuation)

  app.post('/api/contact/new', cors(corsOptions), apiController.newContact);
};