const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    "cat", 
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: Sequelize.STRING
        },

        sub_cats: {
            type: Sequelize.JSON
        }

    }, 
    {
        timestamps: false
    }
)