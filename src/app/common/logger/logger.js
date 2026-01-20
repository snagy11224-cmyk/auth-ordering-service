class Logger {
  constructor() {
    //singleton pattern
    if (Logger.instance) {
      return Logger.instance;
    }
    Logger.instance = this;
  }

  //define log function
  //level: info,debug,error,warn
  log(level, message, metadata = {}) {
    const logObject = {
      level: level,
      message: message,
      timestamp: Date.now(),
      ...metadata,
    };
    //this could call external logging services like datadog,loggly,papertrail
    console.log(JSON.stringify(logObject));
  }

  // convenience methods to log at specific levels
  info(message, metadata = {}) {
    this.log("info", message, metadata);
  }
  debug(message, metadata = {}) {
    this.log("debug", message, metadata);
  }
  error(message, metadata = {}) {
    this.log("error", message, metadata);
  }
  warn(message, metadata = {}) {
    this.log("warn", message, metadata);
  }
}

const logger = new Logger();
module.exports = logger;
