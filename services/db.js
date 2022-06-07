const mysql = require("mysql2/promise");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbConfig = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  connectionLimit: 10
};

async function query(sql, params) {
  const connection = await mysql.createConnection(dbConfig);
  const [results] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query,
};
