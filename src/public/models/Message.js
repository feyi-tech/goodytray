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

        from_id: {
            type: Sequelize.INTEGER
        },

        to_id: {
            type: Sequelize.INTEGER
        }, 

        product_id: {
            type: Sequelize.INTEGER
        },

        thread_id: {
            type: Sequelize.STRING
        },

        body: {
            type: Sequelize.STRING
        },

        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },

        seen: {
            type: Sequelize.INTEGER
        }
    }, 
    {
        timestamps: false
    }
)