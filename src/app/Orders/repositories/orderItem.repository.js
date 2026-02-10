const prisma = require('../../common/DB/prisma');

exports.createMany = async (items) => {
  return prisma.orderItem.createMany({
    data: items,
  });
};

exports.findByOrderId = async (orderId) => {
  return prisma.orderItem.findMany({
    where: { orderId },
  });
};
