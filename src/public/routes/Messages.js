const express = require("express")
const messages = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Message = require("../models/Message")
const User = require("../models/User")

messages.use(cors())

import {checkUserAuth} from "../components/UserFunctions"
import { DISTINCNT_MESSAGES_PER_HOUR, ERROR_DB_OP } from "../utils/Constants"
import { userDetails } from "../utils/ExpressFunc"
const db = require("../database/db")
const Sequelize = require("sequelize")

messages.use(checkUserAuth)

messages.get("/threads", (req, res) => {
    const page = req.query.page && !isNaN(parseInt(req.query.page))? req.query.page : 1
    const rowsPerPage = 20
    var hasNext = false, hasPrev = false
    if(!res.locals.token_user) {
        res.json({success: false, auth_required: true})

    } else {
        const user = res.locals.token_user
        const offset = (page - 1) * rowsPerPage
        db.sequelize.query("SELECT messages.*, products.photos as product_photos, products.price as product_price, products.currency_symbol as product_currency_symbol, products.title as product_title, users.number as user_number, users.profile_photo as user_photo, users.firstname as user_firstname, users.lastname as user_lastname FROM messages, products, users WHERE messages.from_id = ? AND products.id = messages.product_id AND users.id = messages.to_id OR messages.to_id = ? AND users.id = messages.from_id AND products.id = messages.product_id GROUP BY messages.thread_id ORDER BY messages.id DESC LIMIT ?, ?", {
            replacements: [user.id, user.id, offset, rowsPerPage],
            raw: false,
            type: Sequelize.QueryTypes.SELECT,
            model: Message,
            mapToModel: false
        })
        .then(data => {
            if(!data) {
                res.status(200).json({success: false, list: []})

            } else {
                res.status(200).json({success: true, list: data})
            }
        })
        .catch(e => {
            res.status(503).json({success: true, list: [], error: ERROR_DB_OP+e})
        })
    }

})

messages.get("/threads/:user_id", (req, res) => {
    var userId = req.params.user_id
    if(!res.locals.token_user) {
        res.json({success: false, auth_required: true})

    } else {
        const user = res.locals.token_user
        const limit = 20
        db.sequelize.query("SELECT messages.*, products.photos as product_photos, products.title as product_title FROM messages, products WHERE products.id = messages.product_id AND messages.from_id = ? AND messages.to_id = ? OR products.id = messages.product_id AND messages.from_id = ? AND messages.to_id = ? ORDER BY id DESC LIMIT ?", {
            replacements: [user.id, userId, user.id, userId, limit],
            raw: false,
            type: Sequelize.QueryTypes.SELECT,
            model: Message,
            mapToModel: true
        })
        .then(data => {
            if(!data) {
                res.status(200).json({success: false, list: []})

            } else {
                res.status(200).json({success: true, list: data.reverse()})
            }
        })
        .catch(e => {
            res.status(503).json({success: true, list: [], error: ERROR_DB_OP})
        })
    }


})

messages.post("/delete", (req, res) => {
    if(!res.locals.token_user) {
        res.json({success: false, auth_required: true})

    } else {
        const messageId = req.query.message_id && !isNaN(parseInt(req.query.message_id))? req.query.message_id : -1
        if(messageId < 0) {
            res.json({success: false, error: "No message specified"})

        } else {
            const user = res.locals.token_user
            db.sequelize.query("DELETE FROM messages WHERE from_id = ? AND id = ?", {
                replacements: [user.id, messageId]
            })
            .then(message => {
                res.json({success: true})
            })
            .catch(e => {
                res.json({success: false, data: e})
            })
        }
    }
})

messages.post("/send", (req, res) => {
    if(!res.locals.token_user) {
        res.json({success: false, auth_required: true})

    } else {
        const user = res.locals.token_user
        if(!req.body.text || req.body.text.length == 0) {
            res.json({status: 0, message: "Please enter your message body"})

        }

        if(!req.body.to_id || req.body.to_id < 0) {
            res.json({status: 0, message: "No recipient provided"})

        } else if(user.id == parseInt(req.body.to_id)) {
            res.json({status: 0, message: "You can't send a message to yourself"})

        } else {
            //check if the user is spamming by checking the number of messages 
            // sent to different users within an hour
            const dateAgo = new Date()
            dateAgo.setHours(dateAgo.getHours() - 1)
            
            db.sequelize.query("SELECT COUNT(DISTINCT to_id) AS product_id from messages WHERE from_id = ? AND created >= ?", {
                replacements: [user.id, dateAgo],
                raw: false, 
                type: Sequelize.QueryTypes.SELECT,
                model: Message,
                mapToModel: true
            })
            .then(message => {
                if(!message.product_id > DISTINCNT_MESSAGES_PER_HOUR) {
                    res.json({status: 0, message: "You are sending messages too fast. Please try again later"})

                } else {
                    //check if recipent exists
                    userDetails(req.body.to_id)
                    .then(recipient => {
                        if(!recipient || !recipient.user) {
                            res.json({status: 0, message: "The recipient does not exist"})
    
                        } else {
                            var productId = -1
                            if(req.body.product_id && !isNaN(parseInt(req.body.product_id)) && parseInt(req.body.product_id) > -1) {
                                productId = req.body.product_id
    
                            }
                            const messageData = {}
                            messageData.from_id = user.id
                            messageData.to_id = recipient.user.id
                            messageData.product_id = productId
                            messageData.body = req.body.text
                            messageData.thread_id = messageData.from_id < messageData.to_id?
                            messageData.from_id+":"+messageData.to_id
                            :
                            messageData.to_id+":"+messageData.from_id
                            messageData.created = new Date()
                            //res.json({status: 0, message: messageData});
                            Message.create(messageData)
                            .then(msg => {
                                res.json({status: 1, message: "Your message has been successfully sent!"})
                            })
                            .catch(err => {
                                res.json({status: 0, message: ERROR_DB_OP+"ZZ"+err})
                            })
                        }
                    })
                    .catch(e => {
                        res.json({status: 0, message: ERROR_DB_OP+"AA"+e})
                    })
                }
            })
            .catch(e => {
                res.json({status: 0, message: ERROR_DB_OP+"BB"+e})
            })
        }
    }
})

module.exports = messages