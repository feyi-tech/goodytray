const express = require("express")
const states = express.Router()
const cors = require("cors")

const State = require("../models/State")
states.use(cors())
const Sequelize = require("sequelize")
const Op = Sequelize.Op

import {ERROR_DB_OP} from "../utils/Constants"

//get states
states.get("/", function(req, res) {
    const id = req.query.cid
    if(!id) {
        res.json({states: null, message: "No identifier provided"})

    } else {
        State.findAll({
            where: {
                country_id: id
            },
            order: [
                ['name', 'ASC']
            ]
        }).then(states => {
            res.json({states: states})
        })
        .catch((error) => {
            res.json({states: null, message: "An error occurred while trying to get the list"})
        })
    }
})

//get states details
states.get("/details", function(req, res) {
    const id = req.query.id
    if(!id) {
        res.json({details: null, message: "No identifier provided"})

    } else {
        State.findOne({
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

module.exports = states