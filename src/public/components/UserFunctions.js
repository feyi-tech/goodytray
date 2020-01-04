import axios from "axios"
import {ERROR_NET_UNKNOWN, SITE_NAME, SITE_TITLE, API_ROOT, LOGIN_SPAN_IN_SECONDS} from "../utils/Constants"
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser');
import {PORT} from "../utils/Constants"
const browser = require("../utils/Browser");
import { productLink } from "../utils/LinkBuilder";

export const register = function(newUser) {
    return axios.post("api/v1/users/register", {
        username: newUser.username,
        email: newUser.email,
        number: newUser.number,
        password: newUser.password,
        firstname: newUser.firstname,
        lastname: newUser.lastname
    })
    .then(function(res) {
        return res.data
    })
    .catch(err => {
        return {message: ERROR_NET_UNKNOWN}
    })
}

export const login = function(user) {
    return axios.post("api/v1/users/login", {
        email: user.email,
        password: user.password
    })
    .then(function(res) {
        return res.data
    })
    .catch(function(err) {
        return {message: ERROR_NET_UNKNOWN}
    })
}

export const logOut = (req, res, next) => {
    if(req.method.toLowerCase() == "post" && req.body.log_out == "ok") {
        console.log("GOT LG")
        res.cookie('login_token', "out", {
            signed : true, 
            maxAge: LOGIN_SPAN_IN_SECONDS,
            httpOnly: true
        })
        res.redirect("/login")
        
    } else {console.log("GOT NOT LG URL", req.path, req.url, req.method.toLowerCase(), req.body.log_out)}
    next()
}

export const uploadProduct = function(product) {
    if(!localStorage.usertoken) {
        return {status_code: 7, message: "Please login first"}

    } else {
        return axios.post("products/upload", {
            category: product.category,
            sub_category: product.sub_category,
        })
        .then(function(res) {
            return res.data
        })
        .catch(function(err) {
            console.log(err)
        })
    }
}

export const getUser = function(req, idOrEmail) {
    return browser.axios.get(API_ROOT + "users?id="+idOrEmail)
    .then(res => {
        return res.data
    })
    .catch(err => {
        return idOrEmail+err
    })
}

export const getProduct = function(id) {
    return browser.axios.get(API_ROOT + "products/details?id="+id)
    .then(res => {
        return res.data
    })
    .catch(err => {
        return null
    })
}

export const checkUserAuth = function(req, res, next) {
    const locals = {req: JSON.stringify(req.signedCookies), token_user: null, message: null, last_product_cat_id: null}
    if(req.headers || req.signedCookies.login_token || req.cookies.last_product_cat_id || req.signedCookies.last_product_cat_id) {
        
        //last_product_cat_id from header or cookie
        if(req.headers.last_product_cat_id) {
            locals.last_product_cat_id = req.headers.last_product_cat_id
        } else if(req.cookies.last_product_cat_id || req.signedCookies.last_product_cat_id) {
            const unsigned_last_product_cat_id = cookieParser.signedCookie(
                req.cookies.last_product_cat_id 
                || 
                req.signedCookies.last_product_cat_id, 

                process.env.COOKIES_SECRET_KEY)
            if(unsigned_last_product_cat_id) {
                locals.last_product_cat_id = unsigned_last_product_cat_id
            }

        }
        
        //login token from header or cookie
        if(req.headers.authorization) {
            //from header(Authorization: Bearer jwt_token_string).
            //when we split the authorization(nodejs convert to header keys to lowercase automatically) 
            // header value, the string "Bearer will be at the 0 index while the token will be at 1"
            var auth = req.headers.authorization
            auth = auth.split(' ')[1]
            var decoded
            try {
                decoded = jwt.verify(auth, process.env.SECRET_KEY)

                getUser(req, decoded.id)
                .then(data => {
                    locals.token_user = data.user
                    res.locals = locals
                    next()
                }).catch(err => {
                    locals.token_user = null
                    res.locals = locals
                    next()
                })
    
            } catch(e) {
                locals.message = "invalid auth"
                res.locals = locals
                next()
            }

        } else if(req.signedCookies.login_token) {
            const unsigned_login_token = cookieParser.signedCookie(req.signedCookies.login_token, 
                process.env.COOKIES_SECRET_KEY)

            if(!unsigned_login_token) {
                locals.message = "invalid auth on signed token"
                res.locals = locals
                next()

            } else {
                var decoded
                try {
                    decoded = jwt.verify(unsigned_login_token, process.env.SECRET_KEY)
                    getUser(req, decoded.id)
                    .then(data => {
                        locals.token_user = data.user
                        res.locals = locals
                        next()
                    }).catch(err => {
                        locals.token_user = null
                        res.locals = locals
                        next()
                    })
    
                } catch(e) {
                    locals.message = "invalid auth on unsigned token"
                    res.locals = locals
                    next()
                }
            }
        } else {
            locals.message = "No token"
            res.locals = locals
            next()
        }
        

    } else {
        locals.message = "No token"
        res.locals = locals
        next()
    }
}