const {users} = require('../models/user');
const prisma = require("../../common/DB/prisma");

//used async here because we will interact with the database and it returns promises
//so we can apply event loop concept

exports.findEmail = async(email) => {
  //return users.find((u) => u.email === email);
  return prisma.user.findUnique({ where: { email } });
}   

exports.create = async(email,hashedPassword) => {
  /*const user = { email, password: hashedPassword }; 
  users.push(user);
  return user;*/
  return prisma.user.create({ data: { email, password: hashedPassword } });
}   