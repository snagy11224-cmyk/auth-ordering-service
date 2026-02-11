const prisma = require('../../common/DB/prisma');
const {
  ProductNotFoundError,
  ProductOutOfStockError,
  UserNotFoundError,
  OrderNotFoundError,
  OrderCannotBeCancelledError,
  UnauthorizedOrderAccessError,
  EmptyOrderItemsError,
} = require('../errors');

//import ensureUserExists from user service to check if user exists before creating order
const { ensureUserExistsById } = require('../../users/services/user.services'); 

class OrderService {
  constructor({
    orderRepo,
    orderItemRepo,
    productRepo,
    userService,
  }) {
    this.orderRepo = orderRepo;
    this.orderItemRepo = orderItemRepo;
    this.productRepo = productRepo;
    this.userService = userService;
  }

 ////////////////////////////////////////
 //create order - checks stock, creates order + items, updates stock
  async createOrder({ email, items, details }) {
  const user = await this.userService.findByEmail(email);
  if (!user) {
  throw UserNotFoundError;
}
const userId = user.id;

    if (!items || items.length === 0) {
        throw EmptyOrderItemsError;
    }

    const productIds = items.map((i) => i.productId);
    //fetch products
    const products = await this.productRepo.findManyByIds(productIds);

    if (products.length !== productIds.length) {
        throw ProductNotFoundError;
    }

    //check stock + calculate total
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = products.find(
        (p) => p.id === item.productId
      );

      if (product.stock < item.quantity) {
        throw ProductOutOfStockError;
      }

      total += product.price * item.quantity;

      orderItemsData.push({
        productId: product.id,
        price: product.price,
        quantity: item.quantity,
      });
    }

    //TRANSACTION - create order, order items, update stock
    const order = await prisma.$transaction(async (tx) => {
      // create order
      const createdOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: 'PENDING',
          details,
        },
      });

      // create order items
      await tx.orderItem.createMany({
        data: orderItemsData.map((i) => ({
          ...i,
          orderId: createdOrder.id,
        })),
      });

      // update stock
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return createdOrder;
    });

    return order;
  }

  //////////////////////////////////////////
  // get orders for a user
  async getOrdersByUser(email) {
    const user = await this.userService.findByEmail(email);
    const userId = user.id;


    return this.orderRepo.findByUserId(userId);
  }

//////////////////////////////////////////
// get order details - includes items and product details
  async getOrderDetails({ orderId, email }) {
    const user = await this.userService.findByEmail(email);
    const userId = user.id;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
        throw OrderNotFoundError;
    }

    if (order.userId !== userId) {
        throw UnauthorizedOrderAccessError;
    }

    return order;
  }



/////////////////////////////////////////
// cancel order - only if pending, restores stock
  async cancelOrder({ orderId, email }) {
  const user = await this.userService.findByEmail(email);
  const userId = user.id;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw OrderNotFoundError;
  }

  if (order.userId !== userId) {
    throw UnauthorizedOrderAccessError;
  }

  if (order.status !== 'PENDING') {
    throw OrderCannotBeCancelledError;
  }

  await prisma.$transaction(async (tx) => {
    //update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    //restore stock
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { increment: item.quantity },
        },
      });
    }
  });

  return { success: true };
}

//will add admin function to update order status in future (e.g. mark as shipped)
// && add stock to the product
}

module.exports = OrderService;
