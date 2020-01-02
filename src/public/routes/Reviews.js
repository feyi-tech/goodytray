const express = require("express")
const reviews = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Review = require("../models/Review")
const User = require("../models/User")

reviews.use(cors())

import {checkUserAuth} from "../components/UserFunctions"
import { DISTINCNT_MESSAGES_PER_HOUR, ERROR_DB_OP, REVIEWS_PER_PAGE } from "../utils/Constants"
import { userDetails } from "../utils/ExpressFunc"
const db = require("../database/db")
const Sequelize = require("sequelize")

reviews.get("/", checkUserAuth, (req, res) => {
    const page = req.query.page && !isNaN(parseInt(req.query.page))? parseInt(req.query.page) : 1
    var hasNext = false, hasPrev = page > 1
    if(!req.query.product_id || isNaN(parseInt(req.query.product_id))) {
        res.json({status: -1, message: "No product id provided", reviews: null, has_prev: hasPrev, has_next: hasNext})

    } else {
        //get total reviews
        db.sequelize.query("SELECT COUNT(id) AS user_id FROM reviews WHERE product_id = ?", {
            replacements: [req.query.product_id],
            raw: false, 
            type: Sequelize.QueryTypes.SELECT,
            model: Review,
            mapToModel: true
        })
        .then(review => {
            var totalRows = review[0].user_id
            hasNext = page < Math.ceil(totalRows / REVIEWS_PER_PAGE)
            if(totalRows == 0) {
                res.json({status: 0, message: "No match found", reviews: null, has_prev: hasPrev, has_next: hasNext})

            } else {
                const offset = (page - 1) * REVIEWS_PER_PAGE

                //get the reviews
                db.sequelize.query("SELECT reviews.*, users.username AS writer_username, users.firstname AS writer_firstname, users.lastname AS writer_lastname, users.profile_photo AS writer_profile_photo FROM reviews, users WHERE reviews.product_id = ? AND users.id = reviews.user_id ORDER BY reviews.created DESC LIMIT ?, ?", {
                    replacements: [req.query.product_id, offset, REVIEWS_PER_PAGE],
                    raw: false, 
                    type: Sequelize.QueryTypes.SELECT,
                    model: Review,
                    mapToModel: true
                })
                .then(reviews => {
                    res.json({status: 1, message: "Success", reviews: reviews, has_prev: hasPrev, has_next: hasNext})
    
                    
                })
                .catch(e => {
                    res.json({status: -1, message: ERROR_DB_OP+e, reviews: null, has_prev: hasPrev, has_next: hasNext})
                })
            
            }
        })
        .catch(e => {
            res.json({status: -1, message: ERROR_DB_OP, reviews: null, has_prev: hasPrev, has_next: hasNext})
        })
    }
})

reviews.post("/post", checkUserAuth, (req, res) => {
    if(!res.locals.token_user) {
        res.redirect("/login")

    } else {
        const user = res.locals.token_user
        var error = ""
        const review = {}
        if(!req.text || req.text.length == 0) {
            error = "Please enter your review body"

        } else {
            review.body = req.text
        }

        if(!req.to_id || req.to_id < 0) {
            error = "No recipient provided"

        } else {
            //check if the user is spamming by checking the number of reviews 
            // sent to different users within an hour
            const dateAgo = new Date()
            dateAgo.setHours(dateAgo.getHours() - 1)
            
            db.sequelize.query("SELECT COUNT(DISTINCT to_id) AS product_id from reviews WHERE from_id = ? AND created >= ?", {
                replacements: [user.id, dateAgo],
                raw: false, 
                type: Sequelize.QueryTypes.SELECT,
                model: Review,
                mapToModel: true
            })
            .then(review => {
                if(!review.product_id > DISTINCNT_MESSAGES_PER_HOUR) {
                    res.json({status: 0, review: "You are sending reviews too fast. Please try again later"})

                } else {
                    //check if recipent exists
                    var recipent = userDetails(req.to_id);
                    if(!recipent.user) {
                        res.json({status: 0, review: "The recipient does not exist"})

                    } else {
                        res.json({status: 0, review: recipent.user})
                        if(req.product_id && !isNaN(parseInt(req.product_id)) && parseInt(req.product_id) > -1) {
                            body.product_id = req.product_id

                        } else {
                            body.product_id = -1
                        }
                        body.created = new Date()
                        Review.create(body)
                        .then(review => {
                            res.json({status: 1, review: "Review sent"})
                        })
                        .catch(e => {
                            res.json({status: 0, review: ERROR_DB_OP})
                        })
                    }
                }
            })
        }
    }
})

module.exports = reviews