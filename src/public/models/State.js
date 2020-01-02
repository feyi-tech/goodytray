const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    "state", 
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: Sequelize.STRING
        },

        country_id: {
            type: Sequelize.INTEGER
        }
    }, 
    {
        timestamps: false
    }
)