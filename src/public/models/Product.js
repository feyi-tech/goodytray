const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    "product", 
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        user_id: {
            type: Sequelize.INTEGER,
        },

        cat_id: {
            type: Sequelize.INTEGER,
        },

        sub_cat_id: {
            type: Sequelize.INTEGER,
        },

        country_id: {
            type: Sequelize.INTEGER,
        },

        state_id: {
            type: Sequelize.INTEGER,
        },

        city_id: {
            type: Sequelize.INTEGER,
        },

        title: {
            type: Sequelize.STRING,
        },

        description: {
            type: Sequelize.STRING,
        },

        currency_symbol: {
            type: Sequelize.STRING,
        },

        price: {
            type: Sequelize.INTEGER,
        },

        global_price: {
            type: Sequelize.INTEGER,
        },

        attrs: {
            type: Sequelize.STRING,
        },

        photos: {
            type: Sequelize.STRING,
        },

        views: {
            type: Sequelize.INTEGER,
        },

        contact_views: {
            type: Sequelize.INTEGER,
        },

        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },

        last_update: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },

        cat_name: {
            type: Sequelize.STRING,
        },

        sub_cat_name: {
            type: Sequelize.STRING,
        },

        country_name: {
            type: Sequelize.STRING,
        },

        state_name: {
            type: Sequelize.STRING,
        },

        city_name: {
            type: Sequelize.STRING,
        },

        reviews: {
            type: Sequelize.INTEGER,
        },

        sponsored: {
            type: Sequelize.BOOLEAN,
        },

        is_draft: {
            type: Sequelize.BOOLEAN,
        }
    }, 
    {
        timestamps: false
    }
)