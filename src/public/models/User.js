const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    "user", 
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        username: {
            type: Sequelize.STRING,
        },

        firstname: {
            type: Sequelize.STRING,
        },

        lastname: {
            type: Sequelize.STRING,
        },

        profile_photo: {
            type: Sequelize.STRING,
        },

        email: {
            type: Sequelize.STRING,
        },

        password: {
            type: Sequelize.STRING,
        },

        number: {
            type: Sequelize.STRING,
        },

        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },

        last_seen: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },

        validated: {
            type: Sequelize.INTEGER,
        },

        ver_key: {
            type: Sequelize.STRING,
        },

        cookie: {
            type: Sequelize.STRING,
        },

        cookie_exp: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },

        rank: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
    }, 
    {
        timestamps: false
    }
)