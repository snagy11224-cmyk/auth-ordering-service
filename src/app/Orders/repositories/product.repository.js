const prisma = require('../../common/DB/prisma');

exports.findById = async (id) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

exports.findManyByIds = async (ids) => {
  return prisma.product.findMany({
    where: {
      id: { in: ids },
    },
  });
};

exports.create = async ({ name, price, stock }) => {
  return prisma.product.create({
    data: {
      name,
      price,
      stock,
    },
  });
};

exports.updateStock = async ({ productId, stock }) => {
  return prisma.product.update({
    where: { id: productId },
    data: { stock },
  });
};
