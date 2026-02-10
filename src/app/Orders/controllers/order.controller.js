//import services
const orderService = require("../../Orders/services/order.services");

exports.createOrder = (orderService) => async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items, details } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Order items are required',
      });
    }

    const order = await orderService.createOrder({
      userId,
      items,
      details,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};


exports.cancelOrder = (orderService) => async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    await orderService.cancelOrder({ orderId, userId });

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
    });
  } catch (err) {
    next(err);
  }
};


exports.getOrderDetails = (orderService) => async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await orderService.getOrderDetails({
      orderId,
      userId,
    });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};


exports.getMyOrders = (orderService) => async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await orderService.getOrdersByUser(userId);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};
