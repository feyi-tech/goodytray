const express = require("express")
const sub_cats = express.Router()
const cors = require("cors")

const SubCat = require("../models/SubCat")
sub_cats.use(cors())
const Sequelize = require("sequelize")
const Op = Sequelize.Op

import {ERROR_DB_OP} from "../utils/Constants"

//get sub_cats
sub_cats.get("/", function(req, res) {
    const id = req.query.cid
    if(!id) {
        res.json({sub_cats: null, message: "No identifier provided"})

    } else {
        SubCat.findAll({
            where: {
                cat_id: id
            },
            order: [
                ['name', 'ASC']
            ]
        }).then(subCats => {
            res.json({sub_cats: subCats})
        })
        .catch((error) => {
            res.json({sub_cats: null, message: "An error occurred while trying to get the list"})
        })
    }
})

//get sub_cats details
sub_cats.get("/details", function(req, res) {
    const id = req.query.id
    if(!id) {
        res.json({details: null, message: "No identifier provided"})

    } else {
        SubCat.findOne({
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

module.exports = sub_cats