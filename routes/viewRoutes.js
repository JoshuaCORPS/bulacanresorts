const express = require('express');

const authController = require('./../controller/authController');
const viewController = require('./../controller/viewController');

const Router = express.Router();

Router.get('/', authController.isLoggedIn, viewController.getOverview);
Router.get(
  '/login',
  authController.isLoggedIn,
  authController.alreadyLoggedIn,
  viewController.getLogin
);
Router.get(
  '/signup',
  authController.isLoggedIn,
  authController.alreadyLoggedIn,
  viewController.getSignup
);
Router.get(
  '/forgot-password',
  authController.isLoggedIn,
  authController.alreadyLoggedIn,
  viewController.getForgetPass
);
Router.route('/resort/:slug')
  .get(authController.isLoggedIn, viewController.getResort)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    viewController.editResort
  );

Router.route('/resort/:slug/edit').get(
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getEditResort
);

Router.get('/me', authController.protect, viewController.getAccount);

module.exports = Router;
