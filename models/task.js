'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = Schema({
  number: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    required: true
  },

  question: {
    type: String,
    required: true
  },

  audio_url: {
    type: String
  },

  reading: {
    type: String
  },

  time: {
    type: Number
  },
  
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', QuestionSchema);
