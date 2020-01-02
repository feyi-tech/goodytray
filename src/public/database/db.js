import {SSL_SQL_KEY, SSL_SQL_CHAIN, SSL_SQL_CA, DB_HOST, DB_USER, DB_PASS} from "../utils/Constants"
const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize(DB_HOST, DB_USER, DB_PASS, {
    host: "localhost",
    dialect: "mysql",
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

if(SSL_SQL_KEY, SSL_SQL_CHAIN && SSL_SQL_CA) {
    const dialectOptions = {
        ssl: SSL_SQL_KEY,
        cert: SSL_SQL_CHAIN,
        ca: SSL_SQL_CA
    }

    sequelize.dialectOptions = dialectOptions;
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;