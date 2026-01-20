const logger = require("../logger/logger");

module.exports = (err, req, res, next) => {
  const operational = err.isOperational;

  logger.error(err.message, {
    stack: err.stack,
    statusCode: err.statusCode,
    operational: operational,
    body: req.body,
  });

  if (operational) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: "something went wrong" });
  }


};
