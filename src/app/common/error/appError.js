class AppError extends Error{
    //default statusCode 500
    constructor(message,statusCode=500, isOperational=true){
        super(message);
        this.statusCode=statusCode;
        this.isOperational=isOperational;            
        Error.captureStackTrace(this,this.constructor);
    }
}
module.exports=AppError;
