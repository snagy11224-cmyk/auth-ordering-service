const { v4: uuidv4 } = require("uuid");
module.exports=(req,res,next)=>{
const correlationId = uuidv4();

  req.correlationId = correlationId;
  res.setHeader("X-Correlation-Id", correlationId);
 next();
}