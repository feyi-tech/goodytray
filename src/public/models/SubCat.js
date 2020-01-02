const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    "sub_cat", 
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        cat_id: {
            type: Sequelize.INTEGER
        },

        name: {
            type: Sequelize.STRING
        }
    }, 
    {
        timestamps: false
    }
)