'use strict'

const config = require('../config/config.js');
const Task = require('../models/task.js');

const AdminController = {
  home(req, res) {
    res.render('admin/index');
  },

  login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if ((username === config.ADMIN_USERNAME) && (password === config.ADMIN_PASSWORD)) {
      req.session.admin = {username: username};
      res.redirect('/admin/tasks');
    } else {
      res.redirect('/admin');
      res.redirect('/admin/tasks');
    }
  },

  showTask(req, res) {
    Task.findById(req.params.id, (err, task) => {
      res.render('admin/task', {task: task});
    });
  },

  tasks(req, res) {
    Task.find({}, (err, tasks) => {
      res.render('admin/tasks', {tasks: tasks});
    });
  },

  addTask(req, res) {
    let time;

    if (req.body.number == 1 || req.body.number == 2) {
      time = 45;
    } else {
      time = 60;
    }

    let task = new Task({
      number: req.body.number,
      type: req.body.type,
      question: req.body.question,
      audio_url: req.body.audio_url,
      reading: req.body.reading,
      time: time
    });

    task.save(() => {
      console.log("Task saved!");
      res.redirect('/admin/tasks');
    });
  },

  editTask(req, res) {
    Task.findById(req.params.id, (err, task) => {
      res.render('admin/editTask', {task: task});
    });
  },

  updateTask(req, res) {
    Task.findById(req.params.id, (err, task) => {
      task.number = req.body.number;
      task.type = req.body.type;
      task.question = req.body.question;
      task.audio_url = req.body.audio_url;
      task.reading = req.body.reading;

      task.save(() => {
        console.log("Task updated!");
        res.redirect('/admin/tasks');
      });
    });
  },

  destroyTask(req, res) {
    Task.findByIdAndRemove(req.params.id, (err, task) => {
      if (err) {
        console.log(err);
        throw err;
      }

      res.redirect('/admin/tasks');
    });
  }
};

module.exports = AdminController;