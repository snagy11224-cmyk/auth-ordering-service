const {prismaClient} = require("@prisma/client"); //prisma client--> to interact with the database
const prisma = new prismaClient(); //open connection to the database && called once in the app
module.exports = prisma;