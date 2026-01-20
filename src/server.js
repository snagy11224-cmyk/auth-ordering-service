const express = require("express"); 
const userRouter = require("./app/users/routes");
const ErrorHandler = require("./app/common/error/errorHandler"); 
const correlationId = require("./app/common/correlation/correlationId");
const app= express();
app.use(express.json()); 
const port = 4000; 

app.use(correlationId)

app.use('/users', userRouter);
app.use(ErrorHandler);

//we can call users as a mini router app -- from main express app
// to call user endpoints we will use "/users" as prefix

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
