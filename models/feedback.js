'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = Schema({
  score: {
    type: Number,
    required: true
  },

  comment: {
    type: String,
    required: true
  },

  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },

  audio: {
    type: mongoose.Schema.ObjectId,
    ref: 'Audio'
  },

  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
