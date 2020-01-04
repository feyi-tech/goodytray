const dotenv = require('dotenv')
const result = dotenv.config({ path: 'env/.env' })
const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

if(process.env.SSL_SQL_KEY && process.env.SSL_SQL_CHAIN && process.env.SSL_SQL_CA) {
    const dialectOptions = {
        ssl: process.env.SSL_SQL_KEY,
        cert: process.env.SSL_SQL_CHAIN,
        ca: process.env.SSL_SQL_CA
    }

    sequelize.dialectOptions = dialectOptions;
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;