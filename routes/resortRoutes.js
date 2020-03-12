const express = require('express');

const authController = require('./../controller/authController');
const resortController = require('../controller/resortController');

const Router = express.Router();

Router.route('/')
  .get(resortController.getAllResorts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    resortController.uploadResortImages,
    resortController.resizeResortImages,
    resortController.createResort
  );

Router.route('/:id')
  .get(resortController.getResort)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    resortController.uploadResortImages,
    resortController.resizeResortImages,
    resortController.updateResort
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    resortController.deleteResort
  );

Router.patch(
  '/:id/update-created-resort',
  authController.protect,
  authController.restrictTo('admin'),
  resortController.updateResort
);

module.exports = Router;
