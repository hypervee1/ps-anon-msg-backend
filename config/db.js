const mysql = require('mysql2/promise');

const connectDB = async function (_query) {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    const result = await connection.query(_query);
    if (result) {
      return result;
    } else {
      console.log(
        `Failed to perform query in planetscale database`.red.underline.bold
      );
    }
  } catch (error) {
    console.log(
      `Failed to perform query in planetscale database`.red.underline.bold
    );
  }
};
module.exports = { connectDB };
