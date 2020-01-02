const express = require("express")
const cities = express.Router()
const cors = require("cors")

const City = require("../models/City")
cities.use(cors())
const Sequelize = require("sequelize")
const Op = Sequelize.Op

import {ERROR_DB_OP} from "../utils/Constants"

//get cities
cities.get("/", function(req, res) {
    const id = req.query.sid
    if(!id) {
        res.json({cities: null, message: "No identifier provided"})

    } else {
        City.findAll({
            where: {
                state_id: id
            },
            order: [
                ['name', 'ASC']
            ]
        }).then(cities => {
            res.json({cities: cities})
        })
        .catch((error) => {
            res.json({cities: null, message: "An error occurred while trying to get the list"})
        })
    }
})

//get cities details
cities.get("/details", function(req, res) {
    const id = req.query.id
    if(!id) {
        res.json({details: null, message: "No identifier provided"})

    } else {
        City.findOne({
            where: {
                id: id
            }
        }).then((details) => {
            res.json({details: details})
        })
        .catch((error) => {
            res.json({details: null, message: "An error occurred while trying to get the list"})
        })
    }
})

module.exports = cities