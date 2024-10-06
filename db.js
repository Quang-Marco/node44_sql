import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "node44_youtube",
  port: 3306,
});

export default pool;
