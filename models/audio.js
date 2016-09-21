'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const shortid = require('shortid');

const AudioSchema = Schema({
  shortId: {
    type: String, 
    unique: true, 
    default: shortid.generate
  },

  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },

  task: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task'
  },

  anonymous: {
    type: Number,
    default: 0
  },

  feedbacks: [
    {
      type: Schema.Types.ObjectId, ref: 'Feedback'
    }
  ],

  uploadDate: {
    type: Date,
    default: Date.now
  }
});

AudioSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Audio', AudioSchema);
