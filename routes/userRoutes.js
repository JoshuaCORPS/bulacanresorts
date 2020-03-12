const express = require('express');

const authController = require('./../controller/authController');
const viewController = require('./../controller/viewController');
const userController = require('./../controller/userController');

const Router = express.Router();

Router.post('/login', authController.login);
Router.post('/signup', authController.signup);
Router.get('/logout', authController.logout);
Router.post('/forgot-password', authController.forgotPassword);
Router.route('/reset-password/:token')
  .get(authController.verifyToken, viewController.getResetPass)
  .patch(authController.resetPassword);

Router.use(authController.protect);

Router.patch('/update-my-password', authController.updateMyPassword);

Router.patch(
  '/update-me',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

Router.use(authController.protect);
Router.use(authController.restrictTo('admin'));

Router.get('/', userController.getAllUsers);

Router.route('/:userid')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
