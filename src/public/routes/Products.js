const express = require("express")
const products = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Product = require("../models/Product")
const TopAd = require("../models/TopAd")
const Cat = require("../models/Cat")
const imageEditor = require("../utils/imageEditor")

products.use(cors())
const fileUploader = require("../utils/FileUploader")
//const Jimp = require("jimp")

import {checkUserAuth} from "../components/UserFunctions"
import {truncText, jsonEmpty, randNum} from "../utils/Funcs"
import { ERROR_DB_OP, MAX_PRODUCT_PHOTOS_SIZE, PRODUCTS_PER_PAGE, PRODUCTS_PHOTOS_CLIENT_DIR, SERVER_ADDR, PRODUCTS_PHOTOS_SERVER_DIR } from "../utils/Constants"
const db = require("../database/db")
const Sequelize = require("sequelize")
const Op = Sequelize.Op

import fs from "fs"
import { nameToId, userDetails, EXCHANGE_RATE } from "../utils/ExpressFunc"

const andQuery = function(query, filter) {
    return query.includes("WHERE")? query + " AND " + filter : query + " WHERE " + filter
}
const orQuery = function(query, filter) {
    return query.includes("WHERE")? query + " OR " + filter : query + " WHERE " + filter
}
const orderQuery = function(query, filter) {
    return query.includes("ORDER BY")? query + ", " + filter : query + " ORDER BY " + filter
}
//get products
products.get("/", async function(req, res) {
    const today = new Date()
    const page = req.query.page && !isNaN(parseInt(req.query.page)) && parseInt(req.query.page) > 0? parseInt(req.query.page) : 1
    var hasNext = false, hasPrev = page > 1
    const select = "SELECT * FROM products"
    const selectCount = "SELECT COUNT(id) AS id FROM products"
    var query = ""
    const replacements = []
    
    var i = 0
    const q = req.query.q
    if(q && q.length > 0) {
        query = andQuery(query, "UPPER(title) LIKE ? OR UPPER(description) LIKE ? OR UPPER(title) LIKE ? OR UPPER(description) LIKE ? OR UPPER(title) LIKE ? OR UPPER(description) LIKE ?")
        i = 0
        while(i < 2) {
            replacements.push("%"+q.toUpperCase()+"%")
            i++
        }
        i = 0
        while(i < 2) {
            replacements.push(q.toUpperCase()+"%")
            i++
        }
        i = 0
        while(i < 2) {
            replacements.push("%"+q.toUpperCase())
            i++
        }
    }
    
    const isDraft = req.query.is_draft
    if(isDraft && !isNaN(parseInt(isDraft))) {
        query = andQuery(query, "is_draft = ?")
        replacements.push(parseInt(isDraft) == 1?true:false)
    }
    const user_id = req.query.user_id
    if(user_id && !isNaN(parseInt(user_id))) {
        query = andQuery(query, "user_id = ?")
        replacements.push(user_id)
    }
    const user_name = req.query.user_name
    if(user_name && user_name.length > 0) {
        query = andQuery(query, "UPPER(username) LIKE ? OR UPPER(firstname) LIKE ? OR UPPER(lastname) LIKE ? OR UPPER(username) LIKE ? OR UPPER(firstname) LIKE ? OR UPPER(lastname) LIKE ? OR UPPER(username) LIKE ? OR UPPER(firstname) LIKE ? OR UPPER(lastname) LIKE ?")
        i = 0
        while(i < 3) {
            replacements.push("%"+user_name.toUpperCase()+"%")
            i++
        }
        i = 0
        while(i < 3) {
            replacements.push(user_name.toUpperCase()+"%")
            i++
        }
        i = 0
        while(i < 3) {
            replacements.push("%"+user_name.toUpperCase())
            i++
        }
    }

    var cat_id = req.query.cat_id
    if(cat_id && !isNaN(parseInt(cat_id)) || (req.query.cat_name && req.query.cat_name.length > 0)) {
        if(!cat_id || isNaN(parseInt(cat_id))) {
            var cat_id = await nameToId(req.query.cat_name, 'cats')
            //res.json({h: 1, cat_id: cat_id, cat_name: req.query.cat_name, enc: encodeURIComponent("Mobile Phones &amp; Tablets")})

        }
        if(cat_id != null) {
            query = andQuery(query, "cat_id = ?")
            replacements.push(cat_id)
        }
    }

    var sub_cat_id = req.query.sub_cat_id
    if(sub_cat_id && !isNaN(parseInt(sub_cat_id)) || (req.query.sub_cat_name && req.query.sub_cat_name.length > 0)) {
        if(!sub_cat_id || isNaN(parseInt(sub_cat_id))) {
            var sub_cat_id = await nameToId(req.query.sub_cat_name, 'sub_cats')
        }
        if(sub_cat_id != null) {
            query = andQuery(query, "sub_cat_id = ?")
            replacements.push(sub_cat_id)
        }
    }

    var country_id = req.query.country_id
    if(country_id && !isNaN(parseInt(country_id)) || (req.query.country_name && req.query.country_name.length > 0)) {
        if(!country_id || isNaN(parseInt(country_id))) {
            var country_id = await nameToId(req.query.country_name, 'countries')
        }
        if(country_id != null) {
            query = andQuery(query, "country_id = ?")
            replacements.push(country_id)
        }
    }

    var state_id = req.query.state_id
    if(state_id && !isNaN(parseInt(state_id)) || (req.query.state_name && req.query.state_name.length > 0)) {
        if(!state_id || isNaN(parseInt(state_id))) {
            var state_id = await nameToId(req.query.state_name, 'states')
        }
        if(state_id != null) {
            query = andQuery(query, "state_id = ?")
            replacements.push(state_id)
        }
    }

    var city_id = req.query.city_id
    if(city_id && !isNaN(parseInt(city_id)) || (req.query.city_name && req.query.city_name.length > 0)) {
        if(!city_id || isNaN(parseInt(city_id))) {
            var city_id = await nameToId(req.query.city_name, 'cities')
        }
        if(city_id != null) {
            query = andQuery(query, "city_id = ?")
            replacements.push(city_id)
        }
    }

    const attr = req.query.attr
    if(attr && attr.length > 0) {
        if(Array.isArray(attr)) {
            i = 1
            query = andQuery(query, "LOWER(attrs) LIKE ?")
            replacements.push("%"+attr[0].toLowerCase()+"%")
            while(i < attr.length) {
                query = orQuery(query, "LOWER(attrs) LIKE ?");
                replacements.push("%"+decodeURIComponent(attr[i]).toLowerCase()+"%")
                i++
            }

        } else {
            query = andQuery(query, "LOWER(attrs) LIKE ?")
            replacements.push("%"+decodeURIComponent(attr).toLowerCase()+"%")
        }
    }

    const priceMin = req.query.price_min
    if(priceMin && priceMin > 0) {
        query = andQuery(query, "global_price >= ?")
        replacements.push(priceMin)
    }
    const priceMax = req.query.price_max
    if(priceMax && priceMax > 0) {
        query = andQuery(query, "global_price <= ?")
        replacements.push(priceMax)
    }

    var not_id = req.query.not_id
    if(not_id && !isNaN(parseInt(not_id))) {
        query = andQuery(query, "id != ?")
        replacements.push(not_id)
    }
    
    const priceOrder = req.query.price_order//1 = DESC, 0 = ASC
    if(parseInt(priceOrder) == 1) {
        query = orderQuery(query, "global_price DESC")

    } else if(parseInt(priceOrder) == 0) {
        query = orderQuery(query, "global_price ASC")

    }
    const viewsOrder = req.query.views_order//1 = DESC, 0 = ASC
    if(parseInt(viewsOrder) == 1) {
        query = orderQuery(query, "views DESC")

    } else if(parseInt(viewsOrder) == 0) {
        query = orderQuery(query, "views ASC")

    }
    const updateOrder = req.query.update_order//1 = DESC, 0 = ASC
    if(parseInt(updateOrder) == 1) {
        query = orderQuery(query, "last_update DESC")

    } else if(parseInt(viewsOrder) == 0) {
        query = orderQuery(query, "last_update ASC")

    }
    const createdOrder = req.query.create_order//1 = DESC, 0 = ASC
    if(parseInt(createdOrder) == 1) {
        query = orderQuery(query, "created DESC")

    } else if(parseInt(viewsOrder) == 0) {
        query = orderQuery(query, "created ASC")

    }
    //counts all
    db.sequelize.query(selectCount + query, {
        replacements: replacements,
        raw: false, 
        type: Sequelize.QueryTypes.SELECT,
        model: Product,
        mapToModel: true
    })
    .then((counts) => {
        if(!counts || !counts[0] || counts[0].id == 0) {
            hasPrev = false
            res.json({status: 0, message: "No result found", list: null, has_prev: hasPrev, has_next: hasNext})

        } else {
            if(req.query.count_only && parseInt(req.query.count_only) == 1) {
                res.json({counts: counts[0].id})

            } else {
                //now let's get the result
                hasNext = page < Math.ceil(counts[0].id / PRODUCTS_PER_PAGE)
                const offset = (page - 1) * PRODUCTS_PER_PAGE
                replacements.push(offset)
                replacements.push(PRODUCTS_PER_PAGE)
                db.sequelize.query(select + query + " LIMIT ?, ?", {
                    replacements: replacements,
                    raw: false, 
                    type: Sequelize.QueryTypes.SELECT,
                    model: Product,
                    mapToModel: true
                })
                .then(products => {
                    res.json({status: 1, message: "Success", list: products, has_prev: hasPrev, has_next: hasNext, counts: counts[0].id})
                })
                .catch(e => {
                    res.json({status: 0, message: ERROR_DB_OP+e, list: null, has_prev: hasPrev, has_next: hasNext})
                })
            }
        }
    })
    .catch((error) => {
        res.json({status: 0, message: ERROR_DB_OP+error, list: null, has_prev: hasPrev, has_next: hasNext})
    })
})

//get products counts by category and sub category
products.get("/cats_and_sub_cats", (req, res) => {
    var q = "SELECT cats.id, cat.name, sub_cats.id as sub_cat_id"
    db.sequelize.query("SELECT sub_cats.*, cats.name as cat_name FROM sub_cats, cats WHERE sub_cats.cat_id = cats.id ORDER BY cat_id ASC", {
        replacements: [],
        raw: false, 
        type: Sequelize.QueryTypes.SELECT
    })
    .then(cats => {
        const catsAndSubCats = []
        var lastCatId = -1
        var current = null
        for(var i = 0; i < cats.length; i++) {
            if(lastCatId != cats[i].cat_id) {
                if(current) {
                    catsAndSubCats.push(current)
                }
                current = {}
                current.id = cats[i].cat_id
                current.name = cats[i].cat_name
                current.sub_cats = []
                current.sub_cats.push({id: cats[i].id, name: cats[i].name})
                lastCatId = cats[i].cat_id
            } else {
                current.sub_cats.push({id: cats[i].id, name: cats[i].name})
            }
        }
        if(current) {
            catsAndSubCats.push(current)
        }
        res.json(catsAndSubCats)
        
    })
    .catch(e => {
        res.json(null+e)
    })
})

//get products details
products.get("/details", function(req, res) {
    const id = req.query.id
    const viewsSize = randNum(4, 8)
    if(!id) {
        res.json({details: null, message: "No identifier provided"})

    } else {
        db.sequelize.query("SELECT products.*, users.username AS poster_username, users.firstname AS poster_firstname, users.lastname AS poster_lastname, users.profile_photo AS poster_profile_photo, users.number AS poster_number, users.created AS poster_created, users.last_seen AS poster_last_seen FROM products, users WHERE products.id = ? AND users.id = products.user_id LIMIT 1", {
            replacements: [id],
            raw: false, 
            type: Sequelize.QueryTypes.SELECT,
            model: Product,
            mapToModel: true
        })
        .then((product) => {
            product = product[0]
            //get cat and sub_cat name
            db.sequelize.query("SELECT cats.name AS cat_name, sub_cats.name AS sub_cat_name from cats, sub_cats WHERE cats.id = ? AND sub_cats.id = ? LIMIT 1 ", {
                replacements: [product.cat_id, product.sub_cat_id],
                raw: false, 
                type: Sequelize.QueryTypes.SELECT,
                model: Product,
                mapToModel: true
            })
            .then(productEXT => {
                product.cat_name = productEXT[0].cat_name
                product.sub_cat_name = productEXT[0].sub_cat_name

                //get country, state, and city name
                db.sequelize.query("SELECT countries.name AS country_name, states.name AS state_name, cities.name AS city_name from countries, states, cities WHERE countries.id = ? AND states.id = ? AND cities.id = ? LIMIT 1 ", {
                    replacements: [product.country_id, product.state_id, product.city_id],
                    raw: false, 
                    type: Sequelize.QueryTypes.SELECT,
                    model: Product,
                    mapToModel: true
                })
                .then(productEXT => {
                    product.country_name = productEXT[0].country_name
                    product.state_name = productEXT[0].state_name
                    product.city_name = productEXT[0].city_name
                        

                    //get reviews count
                    db.sequelize.query("SELECT COUNT(id) as reviews FROM reviews WHERE product_id = ?", {
                        replacements: [product.id],
                        raw: false, 
                        type: Sequelize.QueryTypes.SELECT,
                        model: Product,
                        mapToModel: true
                    })
                    .then(productEXT => {
                        product.reviews = productEXT[0].reviews
        
                        //get sponsored status
                        db.sequelize.query("SELECT clicks, max_clicks, group_views, max_group_views, start_date, end_date FROM top_ads WHERE product_id = ?", {
                            replacements: [product.id],
                            raw: false, 
                            type: Sequelize.QueryTypes.SELECT,
                            model: TopAd,
                            mapToModel: true
                        })
                        .then(productEXT => {
                            if(productEXT[0]) {
                                product.sponsored = productEXT[0].end_date > new Date()
                            }
                            //increase the views if the vi query string is 1
                            if(req.query.vi && parseInt(req.query.vi) == 1) {
                                var v = product.views + viewsSize
                                db.sequelize.query("UPDATE products SET views = ? WHERE id = ?", {
                                    replacements: [v, product.id],
                                    raw: false, 
                                    type: Sequelize.QueryTypes.UPDATE
                                })
                                .then((r) => {
                                    product.views = product.views + viewsSize
                                    res.json({details: product})
                                })
                                .catch(e => {
                                    product.views = e
                                    res.json({details: product})
                                })

                            } else {
                                res.json({details: product})
                            }
                        })
                        .catch(e => {
                            res.json({details: product})
                        })
                    })
                    .catch(e => {
                        res.json({details: product})
                    })
                })
                .catch(e => {
                    res.json({details: product})
                })
            })
            .catch(e => {
                res.json({details: product})
            })
        })
        .catch((error) => {
            res.json({details: null, message: "An error occurred while trying to get the product details"})
        })
    }
})

const waterMark = async function(FILENAME) {
    /*
    console.log("Watermark 1");
const LOGO = SERVER_ADDR + "/public/static/logo.png";

const LOGO_MARGIN_PERCENTAGE = 5;

  const [image, logo] = await Promise.all([
    Jimp.read(FILENAME),
    Jimp.read(LOGO)
  ]);

  logo.resize(image.bitmap.width / 10, Jimp.AUTO);

  const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
  const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

  const X = image.bitmap.width - logo.bitmap.width - xMargin;
  const Y = image.bitmap.height - logo.bitmap.height - yMargin;

  image.composite(logo, X, Y, [
    {
      mode: Jimp.BLEND_SCREEN,
      opacitySource: 1,
      opacityDest: 1
    }
  ]).image.write(SERVER_ADDR + "/public/products/jimp_1.jpg");
  return true;
//var imageFromMain = main();
//return main().then(image => image.write(FILENAME)).catch(e => console.log("Jinmp upload error: "+e));
*/
}

products.post("/upload/photos", checkUserAuth, (req, res) => {
    if(!res.locals.token_user) {
        res.json({auth_required: true})

    } else {
        const uploader = fileUploader.multipleProductUpload("file")

        uploader(req, res, err => {
            if (err instanceof fileUploader.MULTER_ERROR) {
                return res.status(200).json({status: err.code == "LIMIT_FILE_SIZE"?3:0, message: err.message})
            } else if (err) {
                return res.status(200).json({status: 0, message: err})
            }
            
            const fileNames = []
            const filePaths = []
            var totalFileSize = 0
            var i = 0
            
            while(i < req.files.length) {
                if(totalFileSize + req.files[i].size <= MAX_PRODUCT_PHOTOS_SIZE) {
                    //var wm = await waterMark(PRODUCTS_PHOTOS_SERVER_DIR + req.files[i].filename);
                    fileNames.push(PRODUCTS_PHOTOS_CLIENT_DIR + req.files[i].filename)
                    filePaths.push(req.files[i].path)
                } else {
                    try {
                        fs.unlinkSync(req.files[i].path)
                    } catch(e) {
                        
                    }
                }
                totalFileSize += req.files[i].size 
                i++
            }
            if(fileNames.length == 0) {
                return res.status(200).json({status: 3, message: "Upload failed"})

            } else {
                return imageEditor.waterMark(filePaths)
                .then(result => {
                    return res.status(200).json({status: 1, message: "Upload successfull", filenames: fileNames})
                })
                .catch(e => {
                    return res.status(200).json({status: 0, message: e})
                })
            }
        })
    }
})


//upload products
products.post("/upload", checkUserAuth,  (req, res) => {
    if(!res.locals.token_user) {
        res.json({status: 5, message: "Login required", auth_required: true})

    } else {
        const product = req.body.product
        const today = new Date()
        const form_errors = []
        const productData = {}
        productData.user_id = res.locals.token_user.id
        if(!product.cat || isNaN(parseInt(product.cat)) || parseInt(product.cat) < 0) {
            form_errors.push({key: "cat", value: "Please select a category"})

        } else {
            productData.cat_id = parseInt(product.cat)
        }
        
    
        if(!product.sub_cat || isNaN(parseInt(product.sub_cat)) || parseInt(product.sub_cat) < 0) {
            form_errors.push({key: "sub_cat", value: "Please select a sub category"})

        } else {
            productData.sub_cat_id = parseInt(product.sub_cat)
        }

        if(product.attrs && product.attrs.length > 0) {
            var attrs = "_"
            for(var a = 0; a < product.attrs.length; a++) {console.log("PPPP")
                console.log(product.attrs[a])
                attrs += truncText(product.attrs[a], 70, null) + ","
            }
            attrs = attrs.substring(0, attrs.length - 1) + "_"
            productData.attrs = attrs

        } else {
            productData.attrs = ""
        }

        if(!product.title || product.title.length == 0) {
            form_errors.push({key: "title", value: "Please enter title"})

        } else {
            productData.title = truncText(product.title, 70, null)
        }

        if(!product.desc || product.desc.length == 0) {
            form_errors.push({key: "desc", value: "Please enter description"})

        } else {
            productData.description = truncText(product.desc, 1000, null)
        }

        if(!product.price_currency_symbol || product.price_currency_symbol.length == 0) {
            form_errors.push({key: "price", value: "Please enter your price currency"})

        } else {
            productData.currency_symbol = truncText(product.price_currency_symbol, 30, null)
        }

        if(!product.price || isNaN(parseInt(product.sub_cat)) || parseInt(product.sub_cat) < 0) {
            form_errors.push({key: "price", value: "Please enter price"})

        } else {
            productData.price = parseInt(truncText(product.price, 30, null))
        }

        if(productData.currency_symbol && productData.price) {
            productData.global_price = EXCHANGE_RATE[[productData.currency_symbol]] * productData.price
        }

        if(!product.country || isNaN(parseInt(product.country)) || parseInt(product.country) < 0) {
            form_errors.push({key: "country", value: "Please select a country"})

        } else {
            productData.country_id = parseInt(product.country)
        }

        if(!product.state || isNaN(parseInt(product.state)) || parseInt(product.state) < 0) {
            form_errors.push({key: "state", value: "Please select a state"})

        } else {
            productData.state_id = parseInt(product.state)
        }

        if(!product.city || isNaN(parseInt(product.city)) || parseInt(product.city) < 0) {
            form_errors.push({key: "city", value: "Please select a city"})

        } else {
            productData.city_id = parseInt(product.city)
        }

        if(form_errors.length > 0) {
            if(product.photos && product.photos.length > 0) {
                var i = 0
                while(i < product.photos.length) {
                    try {
                        fs.unlinkSync("dist" + product.photos[i])
                    } catch(e) {
                        res.json({status: 0, message: "Failed to delete file: ("+"dist" + product.photos[i]+")" + e})
                    }
                    i++
                }
            }
            res.json({status: 0, message: null, form_errors: form_errors})

        } else {
            productData.created = today
            productData.last_update = today
            var photos = ""
            if(product.photos && product.photos.length > 0) {
                var i = 0
                while(i < product.photos.length) {
                    photos += product.photos[i] + ","
                    i++
                }
                photos = photos.substring(0, photos.length - 1)
            }
            productData.photos = photos
            Product.create(productData)
            .then(prod => {
                return res.status(200).json({status: 1, message: "Ad posted successfully"+JSON.stringify(prod), product_id: prod.id})
            })
            .catch(e => {
                return res.status(200).json({status: -1, message: ERROR_DB_OP+e, c: productData.currency_symbol})
            })
        }
    }
})

module.exports = products