const express = require('express');

module.exports = (orderController) => {
  const router = express.Router();

  router.post('/', orderController.createOrder);
  router.get('/me', orderController.getMyOrders);
  router.get('/:orderId', orderController.getOrderDetails);
  router.patch('/:orderId/cancel', orderController.cancelOrder);

  return router;
};
