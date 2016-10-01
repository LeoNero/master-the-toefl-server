'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: {
    type: String,
    required: true
  },

  facebook: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },

  points: {
    type: Number,
    default: 2
  },

  audios: [
    {
      type: Schema.Types.ObjectId, ref: 'Audio'
    }
  ],

  feedbacks: [
    {
      type: Schema.Types.ObjectId, ref: 'Feedback'
    }
  ],

  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);