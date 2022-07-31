const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const queryGen = require('../utils/queryGenerator');
const db = require('../config/db');
const asyncHandler = require('../middleware/async');

const getSignJwtToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const matchPassword = async function (enteredPassword, storedPassword) {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

const hashPassword = async function (enteredPassword) {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(enteredPassword, salt);
  return password;
};

const createUser = async function (data) {
  const _query = await queryGen.create('users', data);

  const isSuccess = await db.connectDB(_query); //await db.query(_query);

  if (isSuccess) {
    return isSuccess;
  }
  return null;
};

const getUsers = asyncHandler(async function (data) {
  const _query = await queryGen.find(
    'users',
    data['where'] || '',
    data['orderby'] || '',
    data['select'] || '*'
  );

  const isSuccess = await db.connectDB(_query);

  if (isSuccess) {
    return isSuccess;
  }
  return null;
});

const updateUser = asyncHandler(async function (data) {
  const _query = await queryGen.update('users', data['data'], data['where']);

  const isSuccess = await db.connectDB(_query);
  if (isSuccess) {
    return isSuccess;
  }

  return null;
});

module.exports = {
  createUser,
  getUsers,
  matchPassword,
  getSignJwtToken,
  hashPassword,
  updateUser,
};
