'use strict'

const adminController = require('../controllers/admin.js');
const isAdminAuthenticated = require('../middlewares/isAdminAuthenticated.js');

module.exports = app => {
  app.get('/admin', adminController.home);
  app.post('/admin/login', adminController.login);

  app.get('/admin/tasks', isAdminAuthenticated, adminController.tasks);
  app.get('/admin/task/:id', isAdminAuthenticated, adminController.showTask);

  app.post('/admin/task/add', isAdminAuthenticated, adminController.addTask);
  
  app.get('/admin/task/:id/edit', isAdminAuthenticated, adminController.editTask);
  app.put('/admin/task/:id', isAdminAuthenticated, adminController.updateTask);

  app.delete('/admin/task/:id', isAdminAuthenticated, adminController.destroyTask);
};