const queryGen = require('../utils/queryGenerator');
const db = require('../config/db');

const createMessage = async function (data) {
  const _query = await queryGen.create('messages', data);

  console.log(_query);

  const isSuccess = await db.connectDB(_query); //await db.query(_query);

  if (isSuccess) {
    return isSuccess;
  }
  return null;
};

const getMessage = async function (data) {
  const _query = await queryGen.findOne('messages', data['where']);

  console.log(_query);

  const isSuccess = await db.connectDB(_query);

  if (isSuccess) {
    return isSuccess;
  }
  return null;
};

const getMessages = async function (data) {
  const _query = await queryGen.find('messages', data['where']);
  console.log(_query);

  const isSuccess = await db.connectDB(_query);

  if (isSuccess) {
    return isSuccess;
  }
  return null;
};

const removeMessage = async function (data) {
  console.log(data);
  const _query = await queryGen.update(
    'messages',
    data['data'] || '',
    data['where'] || ''
  );

  console.log(_query);

  const isSuccess = await db.connectDB(_query);

  if (isSuccess) {
    return isSuccess;
  }
  return null;
};
module.exports = {
  createMessage,
  getMessage,
  getMessages,
  removeMessage,
};
