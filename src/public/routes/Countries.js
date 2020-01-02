const express = require("express")
const countries = express.Router()
const cors = require("cors")

const Country = require("../models/Country")
countries.use(cors())
const Sequelize = require("sequelize")
const Op = Sequelize.Op

import {ERROR_DB_OP} from "../utils/Constants"
const db = require("../database/db")

//get countries
countries.get("/", function(req, res) {
    const includeCurrencySymbols = req.query.include_currency_symbols && req.query.include_currency_symbols == 1
    Country.findAll({
        order: [
            ['name', 'ASC']
        ]
    })
    .then(countries => {
        if(!includeCurrencySymbols) {
            res.json({countries: countries})

        } else {
            db.sequelize.query("SELECT DISTINCT currency_symbol from countries WHERE currency_symbol != '' ", {
                raw: false, 
                type: Sequelize.QueryTypes.SELECT,
                model: Country,
                mapToModel: true
            })
            .then(symbols => {
                const cs = []
                for(var s = 0; s < symbols.length; s++) {
                    cs[s] = symbols[s].currency_symbol
                }
                res.json({countries: countries, currency_symbols: cs})
            })
            .catch(error2 => {
                res.json({countries: countries, currency_symbols: cs})
            })
        }
    })
    .catch(error => {
        res.json({countries: null, message: ERROR_DB_OP+error})
    })
})

//get countries details
countries.get("/details", function(req, res) {
    const id = req.query.id
    if(!id) {
        res.json({details: null, message: "No identifier provided"})

    } else {
        Country.findOne({
            where: {
                id: id
            }
        }).then((product) => {
            res.json({details: product})
        })
        .catch((error) => {
            res.json({details: null, message: "An error occurred while trying to get the list"})
        })
    }
})

module.exports = countries