'use strict'

const Task = require('../models/task.js');
const Audio = require('../models/audio.js');
const User = require('../models/user.js');
const Feedback = require('../models/feedback.js');

const sendEmail = require('../mailers/send-email-contact.js');

const sanitize = require('mongo-sanitize');

const authUtils = require('../config/authUtils.js');

const multiparty = require('multiparty');
const fs = require('fs');

const ApiController = {
  getTasksByNumber(req, res) {
    Task.find({number: sanitize(req.params.number)}, (err, tasks) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.send(tasks);
      }
    });
  },

  getAllAudios(req, res) {
    Audio
      .paginate({}, { page: req.params.page, limit: 9, populate: ['postedBy', 'task'], sortBy: {date: -1} }, (err, result) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.send({audios: result.docs, total_pages: result.pages});
        }
      });
  },

  getAudioById(req, res) {
    Audio
      .find({'shortId': sanitize(req.params.shortId)})
      .populate('task')
      .populate('feedbacks')
      .exec((err, audio) => {
        if (err) {
          res.status(500).json(err);
        } 

        if (!audio) {
          return res.status(404).send({message: 'Audio not found'});
        }

        res.send(audio[0]);
    });
  },

  newAudio(req, res) {
    const form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
      let user_id = fields.user_id[0];
      let task_id = fields.task_id[0];
      let anonymous = fields.anonymous[0];

      let audio = new Audio({
        postedBy: user_id,
        task: task_id,
        anonymous: anonymous
      });

      audio.save((err) => {
        if (err) {
          res.status(500).json(err);
        }

        let tmp_path = files.file[0].path;

        let target_path = __dirname + '/../uploads/' + audio._id + '.wav';

        fs.renameSync(tmp_path, target_path);

        User.findById(user_id, (err, user) => {
          if (err) {
            res.status(500).json(err);
          }

          user.audios.push(audio._id);

          user.save((err) => {
            if (err) {
              res.status(500).json(err);
            }

            console.log("Audio saved to user!");
          });
        });

        res.send(audio);
      });
    });
  },

  newFeedback(req, res) {
    let user_id = sanitize(req.body.user_id);
    let audio_id = sanitize(req.body.audio_id);

    let feedback = new Feedback({
      score: sanitize(req.body.scoreGiven),
      comment: sanitize(req.body.commentGiven),
      postedBy: user_id,
      audio: audio_id
    });

    feedback.save((err) => {
      if (err) {
        throw err;
      }

      User.findById(user_id, (err, user) => {
        if (err) {
          res.status(500).json(err);
        }

        user.feedbacks.push(feedback._id);

        user.save((err) => {
          if (err) {
            res.status(500).json(err);
          }
        });
      });

      Audio.findById(audio_id, (err, audio) => {
        if (err) {
          res.status(500).json(err);
        }

        audio.feedbacks.push(feedback._id);

        audio.save((err) => {
          if (err) {
            res.status(500).json(err);
          }
        });
      });  

      console.log(feedback);
      res.send(feedback);
    });
  },

  getAudioFeedbacks(req, res) {
    Audio.find({'shortId': sanitize(req.params.shortId)}, (err, audio) => {
      if (err) {
        res.status(500).json(err);
      }

      Feedback
        .find({'audio': audio[0]._id})
        .populate('postedBy')
        .exec((err, feedbacks) => {
          if (err) {
            res.status(500).json(err);
          } 

          res.send(feedbacks);
        });
    });
  },

  deleteFeedbackById(req, res) {
    Feedback.findByIdAndRemove(req.params.id, (err, feedback) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }

      res.send({msg: 'Feedback removed!'});
    });
  },

  deleteAudioById(req, res) {
    Audio.findByIdAndRemove(req.params.id, (err, audio) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }

      res.send({msg: 'Audio removed!'});
    });
  },

  newContact(req, res) {
    let contactText = req.body.contactText;

    sendEmail(contactText, (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      
      res.send({msg: response});
    });
  }
};

module.exports = ApiController;