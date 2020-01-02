const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    "country", 
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        sortname: {
            type: Sequelize.STRING
        },

        name: {
            type: Sequelize.STRING
        },

        phonecode: {
            type: Sequelize.INTEGER
        },

        currency_name: {
            type: Sequelize.STRING
        },

        currency_symbol: {
            type: Sequelize.STRING
        }
    }, 
    {
        timestamps: false
    }
)