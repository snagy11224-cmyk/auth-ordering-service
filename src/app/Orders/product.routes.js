const express = require('express');
const adminMiddleware = require('../../app/middleWares/admin.middleware');

module.exports = (productController) => {
  const router = express.Router();

  router.post(
    '/',
    adminMiddleware,
    productController.createProduct
  );

  return router;
};
