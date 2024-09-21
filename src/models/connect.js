import { Sequelize } from "sequelize";

const sequelize = new Sequelize("node44_youtube", "root", "123456", {
  host: "localhost",
  port: 3307,
  dialect: "mysql",
});

export default sequelize;
