const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const { SQL_HOST, SQL_PORT, SQL_USER, SQL_PASS, SQL_DB } = require("../util/Util");

const sqlOptions = {
  dialect: 'mysql',
  host: SQL_HOST,
  port: SQL_PORT,
  pool: {
    max: 20,
    idle: 30000
  },
  define: {
    "charset": "utf8mb4",
    "dialectOptions": {
      "collate": "utf8mb4_general_ci"
    }
  },
  timezone: '+09:00',
  logging: false
}

const sequelize = new Sequelize(SQL_DB, SQL_USER, SQL_PASS, sqlOptions);
const db ={};

fs.readdirSync(__dirname + "/models/").filter(function (file) {
  return (file.indexOf(".") !== 0) && (file !== "app.js");
}).forEach(function (file) {
  const model = require(path.join(__dirname + "/models/", file))(
    sequelize,
    Sequelize.DataTypes
  );
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.sync({force: false}).then(() => {
  console.log("MariaDB Connected!!");
}).catch(e => {
  console.log(e);
  console.log("MariaDB Connect Failed");
});

module.exports = db;