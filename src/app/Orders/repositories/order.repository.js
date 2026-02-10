const prisma = require('../../common/DB/prisma');

exports.create = async (data) => {
  return prisma.order.create({
    data,
  });
};

exports.findById = async (id) => {
  return prisma.order.findUnique({
    where: { id },
  });
};

exports.findByUserId = async (userId) => {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

exports.updateStatus = async ({ orderId, status }) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};
