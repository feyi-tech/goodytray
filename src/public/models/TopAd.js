const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    "top_ad", 
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        user_id: {
            type: Sequelize.INTEGER,
        },

        product_id: {
            type: Sequelize.INTEGER,
        },

        clicks: {
            type: Sequelize.INTEGER,
        },

        max_clicks: {
            type: Sequelize.INTEGER,
        },

        group_views: {
            type: Sequelize.INTEGER,
        },

        max_group_views: {
            type: Sequelize.INTEGER,
        },

        start_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },

        end_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, 
    {
        timestamps: false
    }
)