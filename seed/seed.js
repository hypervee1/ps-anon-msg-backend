// import { createUserTableSql, dropUserTableSQL } from './sql.js';
// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

const {
  createUserTableSql,
  dropUserTableSQL,
  createMessageTableSql,
  dropMessageTableSQL,
} = require('./sql');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config({ path: '../config/config.env' }); // Load env vars

console.log(process.env.DATABASE_URL);
const loadAndSaveData = async () => {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    await connection.query(dropUserTableSQL);
    console.log('***Drop User table***');

    await connection.query(createUserTableSql);
    console.log('***Create User Table***');

    await connection.query(dropMessageTableSQL);
    console.log('***Drop messages table***');

    await connection.query(createMessageTableSql);
    console.log('***Create messages Table***');
  } catch (error) {
    console.error(error);
  }
};

loadAndSaveData().then((res) => {
  process.exit(0);
});
