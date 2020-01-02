const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    "message", 
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        user_id: {
            type: Sequelize.INTEGER
        }, 

        product_id: {
            type: Sequelize.INTEGER
        },

        weight: {
            type: Sequelize.INTEGER
        },

        body: {
            type: Sequelize.STRING
        },

        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, 
    {
        timestamps: false
    }
)