const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../models/User")
const Sequelize = require("sequelize")
const Op = Sequelize.Op

const fileUploader = require("../utils/FileUploader")

users.use(cors())
import {isValidEmail, isValidNumber, jsonEmpty} from "../utils/Funcs"
import {ERROR_DB_OP, LOGIN_SPAN_IN_SECONDS, USERS_PHOTOS_CLIENT_DIR, USERS_PHOTOS_SERVER_DIR} from "../utils/Constants"
import {checkUserAuth} from "../components/UserFunctions"
const cryptoRandomString = require('crypto-random-string');

import {mail} from "../utils/Mailer"
import fs from "fs"

//import { constants } from "fs"

const validOnReg = 0
//register
users.post("/register", function(req, res) {
    const today = new Date()
    const userData = {
        email: req.body.email == null? "" : req.body.email.trim(),
        password: req.body.password == null? "" : req.body.password.trim(),
        number: req.body.number == null? "" : req.body.number.trim(),
        firstname: req.body.firstname == null? "" : req.body.firstname.trim(),
        lastname: req.body.lastname == null? "" : req.body.lastname.trim(),
        created: today,
        var_key: "verkey",
        validated: validOnReg
    }

    const form_errors = {}
    if(!isValidEmail(userData.email)) {
        form_errors.email_error = "Please enter a valid email address"
    }
    if(!isValidNumber(userData.number)) {
        form_errors.number_error = "Please enter a valid phone number"
    }
    if(userData.firstname.length < 2) {
        form_errors.firstname_error = "Please enter your firstname"
    }
    if(userData.password.length == 0) {
        form_errors.password_error = "Please enter your password"

    } else if(userData.password.length < 6) {
        form_errors.password_error = "Your password is too short"
    }

    
    if(form_errors.email_error == null) {
        User.findOne({
            where: {
                email: userData.email
            }
    
        }).then(function(user) {
            if(!user) {
                if(!jsonEmpty(form_errors)) {
                    res.json({status: 0, message: null, login_token: null, form_errors: form_errors})

                } else {
                    bcrypt.hash(userData.password, 10, function(err, hash) {
                        userData.password = hash
                        User.create(userData)
                        .then(function(user) {
                            var message
                            var login_token

                            //send email verification link here
                            message = "Registration successfull. You can login now."
                            token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {
                                expiresIn: "7d"
                            })
                            res.cookie('login_token', token, {
                                signed : true, 
                                maxAge: LOGIN_SPAN_IN_SECONDS * 1000,
                                httpOnly: true
                            })
                            res.json({status: 1, message: message, login_token: token, form_errors: null})
                        })
                        .catch(function(err) {
                            console.log("REG_ERROR: "+err)
                            res.status(400).json({status: 0, message: ERROR_DB_OP, login_token: null, form_errors: null})
                        })
                    })
                }
    
            } else {
                form_errors.email_error = "The email address has already been used."
                res.json({status: 0, message: null, login_token: null, form_errors: form_errors})
            }
        })
        .catch(function(err) {
            console.log("REG_ERROR_CHECK_EMAIL: "+err)
            res.status(400).json({status: 0, message: ERROR_DB_OP, login_token: null, form_errors: null})
        })

    } else {
        res.json({status: 0, message: null, login_token: null, form_errors: form_errors})
    }
})

//login
users.post("/login", function(req, res) {
    const userData = {
        email: req.body.email == null? "" : req.body.email.trim(),
        password: req.body.password == null? "" : req.body.password.trim()
    }
    const form_errors = {}
    if(userData.email.length == 0) {
        form_errors.email_error = "Please enter your email address"
    }
    if(userData.password.length == 0) {
        form_errors.password_error = "Please enter your password"
    }

    if(jsonEmpty(form_errors)) {
        User.findOne({
            where: {
                email: userData.email
            }
        })
        .then(function(user) {
            if(user) {
                if(bcrypt.compareSync(userData.password.trim(), user.password)) {
                    let token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {
                        expiresIn: "7d"
                    })
                    res.cookie('login_token', token, {
                        signed : true, 
                        maxAge: LOGIN_SPAN_IN_SECONDS * 1000,
                        httpOnly: true
                    })
                    res.json({status: 1, message: null, login_token: token, form_errors: null})
    
                } else {
                    form_errors.password_error = "Wrong password"
                    res.json({status: 0, message: null, login_token: null, form_errors: form_errors})
                }

            } else {
                form_errors.email_error = "No account exists with your email address. Please create an account now."
                res.json({status: 0, message: null, login_token: null, form_errors: form_errors})
            }
        })
        .catch(function(err) {
            res.status(400).json({status: 0, message: ERROR_DB_OP+err, login_token: null, form_errors: form_errors})
        })

    } else {
        res.json({status: 0, message: null, login_token: null, form_errors: form_errors})
    }
})

users.use(["/update_password", "/update_profile"], checkUserAuth)
users.post("/update_password", (req, res) => {
    if(!res.locals.token_user) {
        res.json({success: false, auth_required: true})

    } else {
        var errors = {}
        var hasErrors = false
        if(!req.body.new_password || req.body.new_password.length == 0) {
            errors.new_password = "Please enter your new password"

        } else if(req.body.new_password.length < 6) {
            errors.new_password = "Your new password is too short"

        }
        if(!req.body.password || req.body.password.length == 0) {
            errors.password = "Please enter your password"

        } 
        if(hasErrors) {
            res.json({success: false, errors: errors})

        } else {
            User.findOne({
                where: {
                    id: res.locals.token_user.id
                }
            })
            .then(user => {
                if(user) {
                    if(!bcrypt.compareSync(req.body.password.trim(), user.password)) {
                        errors.password = "Wrong password!"
                        res.json({success: false, errors: errors})

                    } else {
                        bcrypt.hash(req.body.new_password, 10, function(err, hash) {
                            user.update({password: hash})
                            .then(function(user) {
                                res.json({success: true})
                            })
                            .catch(function(err) {
                                res.status(400).json({success: false, error: ERROR_DB_OP+"_ERR0R 1_"+err})
                            })
                        })
                    }
    
                } else {
                    res.json({success: false, auth_required: true})
                }
            })
            .catch(error => {
                res.json({success: false, error: ERROR_DB_OP+error})
            })
        }
        
    }
})
users.post("/update_profile", (req, res) => {
    if(!res.locals.token_user) {
        res.json({success: false, auth_required: true})

    } else {
        const data = {}
        var firstname = req.body.fname || req.body.firstname
        var lastname = req.body.lname || req.body.lastname
        var number = req.body.number
        if(firstname && firstname.length > 0) {
            data.firstname = firstname
        }
        if(lastname && lastname.length > 0) {
            data.lastname = lastname
        }
        if(number && lastname.length > 0) {
            data.number = number
        }
        User.findOne({
            where: {
                id: res.locals.token_user.id
            }
        })
        .then(user => {
            if(user) {
                user.update(data)
                res.json({success: true})

            } else {
                res.json({success: false, auth_required})
            }
        })
        .catch(err => {
            res.json({success: false, error: ERROR_DB_OP})
        })
    }
})

users.post("/logout", (req, res) => {
    res.cookie('login_token', "out", {
        signed : true, 
        maxAge: new Date() - LOGIN_SPAN_IN_SECONDS,
        httpOnly: true
    })
    res.json({link: '/', b: JSON.stringify(req.body)})
})

//userdata
users.get("/", (req, res) => {
    var id = req.query.id;
    if(id == null) {
        res.status(400).json({user: null, error: "Bad request"})

    } else {
        id = decodeURIComponent(id)
        User.findOne({
            where: {
                [Op.or]: [{id: {[Op.eq]: id}}, {email: {[Op.eq]: id}}]
            }, 
            attributes: {
                exclude: ['password', 'cookie', 'cookie_exp', 'validated', 'ver_key']
            }
        })
        .then(user => {
            if(user) {
                res.status(200).json({user: user, error: null})

            } else {
                res.status(404).json({user: null, error: "not found"})
            }
        })
        .catch(error => {
            console.log(req.url + " error: " + error)
            res.status(500).json({user: null, error: ERROR_DB_OP})
        })
    }
})

users.post("/mail-key", (req, res) => {
    const allowed_type = ["email_ver", "password_reset"]
    const type = req.query.type
    const email = req.body.email
    if(allowed_type.includes(type)) {
        res.status(400).json({message: "Invalid type", status: 0})

    } else {

    }
})

users.post("/upload/profile-photo", checkUserAuth, (req, res) => {
    if(!res.locals.token_user) {
        res.redirect("/login")

    } else {
        const uploader = fileUploader.singleUserUpload('photo')
        uploader(req, res, err => {
            if (err instanceof fileUploader.MULTER_ERROR) {
                return res.status(200).json({status: err.code == "LIMIT_FILE_SIZE"?3:0, message: err.message})
            } else if (err) {
                return res.status(200).json({status: 0, message: err})
            }
            const filePath = USERS_PHOTOS_CLIENT_DIR + req.file.filename
            User.findOne({
                where: {
                    id: res.locals.token_user.id
                }
            })
            .then(user => {
                if(user) {
                    const old_photo = user.profile_photo
                    user.update({profile_photo: filePath})
                    .then(user => {
                        if(old_photo.length > 0) {
                            //delete previous photo
                            const deletePath = USERS_PHOTOS_SERVER_DIR + "/" + old_photo.split("/")[old_photo.split("/").length - 1]
                            try {
                                fs.unlinkSync(deletePath)
                                return res.status(200).json({status: 1, message: "Upload successfull"})

                            } catch(e) {
                                return res.status(200).json({status: 1, message: "Upload successfull"})
                            }

                        } else {
                            return res.status(200).json({status: 1, message: "Upload successfull"})
                        }
                    })
                    .catch(e => {
                        return res.status(200).json({status: 0, message: ERROR_DB_OP})
                    })

                } else {
                    return res.status(200).json({status: 0, message: "Upload failed"})
                }
            })
            .catch(e => {
                return res.status(200).json({status: 0, message: ERROR_DB_OP})
            })
        })
    }
})

module.exports = users