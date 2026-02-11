const express = require("express"); 

const dotenv = require("dotenv");
dotenv.config(); // to be able to config .env vars using 'process.env.VAR_NAME'

const userRouter = require("./app/users/routes");

const orderRoutes = require("./app/Orders/routes");
const orderController = require("./app/Orders/controllers/order.controller");
const OrderService = require('./app/Orders/services/order.services');
const orderRepo = require('./app/Orders/repositories/order.repository');
const orderItemRepo = require('./app/Orders/repositories/orderItem.repository');
const productRepo = require('./app/Orders/repositories/product.repository');

const userService = require('./app/users/services/user.services');

const {authMiddleware} = require("./app/middleWares/auth.middleWare");
const ErrorHandler = require("./app/common/error/errorHandler"); 
const correlationId = require("./app/common/correlation/correlationId");
const requestTimeMiddleware = require("./app/common/logger/requestTimeHelper");

const productRoutes = require('./app/Orders/product.routes');
const productController = require('./app/Orders/controllers/product.controller');
const ProductService = require('./app/Orders/services/product.services');


const app= express();
app.use(express.json()); 
const port = 4000; 

app.use(correlationId)
app.use(requestTimeMiddleware);


app.use('/users', userRouter);

const orderService = new OrderService({
  orderRepo,
  orderItemRepo,
  productRepo,
  userService,
});
const orderControllerInstance = {
  createOrder: orderController.createOrder(orderService),
  cancelOrder: orderController.cancelOrder(orderService),
  getOrderDetails: orderController.getOrderDetails(orderService),
  getMyOrders: orderController.getMyOrders(orderService),
};

const productService = new ProductService({ productRepo });
const productControllerInstance = {
  createProduct: productController.createProduct(productService),
};

console.log('authMiddleware:', typeof authMiddleware);
console.log('orderRoutes:', typeof orderRoutes);
app.use('/orders', authMiddleware, orderRoutes(orderControllerInstance));
app.use('/products',authMiddleware,productRoutes(productControllerInstance));

app.use(ErrorHandler);


//we can call users as a mini router app -- from main express app
// to call user endpoints we will use "/users" as prefix

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
