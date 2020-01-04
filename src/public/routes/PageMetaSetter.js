const express = require("express")
const metaSetter = express.Router()

const cors = require("cors")
metaSetter.use(cors())

import { SELL_PATHS, LOGIN_PATHS, REGISTER_PATHS, HOME_PATHS, PRODUCT_PATHS, SEARCH_PATHS, PRODUCTS_PATHS, CREATE_TIPS_PATHS } from "../utils/RoutePaths";
import { SITE_TITLE } from "../utils/Constants";
import { getProduct } from "../components/UserFunctions";
import { productLink } from "../utils/LinkBuilder";
import { mimeFromFilename } from "../utils/Funcs";

metaSetter.get("*", (req, res, next) => {
    res.locals.pageMeta = getDefaultPageMeta()
    next()
})

metaSetter.get(SELL_PATHS, (req, res, next) => {
    res.locals.pageMeta = getSellPageMeta()
    next()
})

metaSetter.use(LOGIN_PATHS, (req, res, next) => {
    res.locals.pageMeta = getLoginPageMeta()
    next()
})

metaSetter.get(REGISTER_PATHS, (req, res, next) => {
    res.locals.pageMeta = getRegPageMeta()
    next()
})

metaSetter.get(HOME_PATHS.concat(PRODUCTS_PATHS), (req, res, next) => {
    res.locals.pageMeta = getHomePageMeta()
    next()
})

metaSetter.get(PRODUCT_PATHS, async (req, res, next) => {
    console.log("P_REQ U2", req.url)
    console.log("P_REQ Q2", req.params)
    res.locals.pageMeta = await getProductPageMeta(req.params.id)
    console.log("P_REQ_REZ2", res.locals.pageMeta)
    next()
})

metaSetter.get(SEARCH_PATHS, (req, res, next) => {
    res.locals.pageMeta = getSearchPageMeta()
    next()
})

metaSetter.get(CREATE_TIPS_PATHS, (req, res, next) => {
    res.locals.pageMeta = getAdsTipsPageMeta()
    next()
})

const getDefaultPageMeta = () => {
    var pageMeta = {}
    pageMeta.title = ""
    pageMeta.description = "Sell faster and easier"
    pageMeta.keywords = "sell faster, sell easier, goodybag, goods"
    return pageMeta
}

const getSellPageMeta = () => {
    var pageMeta = {}
    pageMeta.title = "Sell"
    pageMeta.description = "Sell faster and easier"
    pageMeta.keywords = "sell faster, sell easier, goodybag, goods"
    pageMeta.url = "https://goodytray.com/sell"
    return pageMeta
}
export const getLoginPageMeta = () => {
    var pageMeta = {}
    pageMeta.title = "Login"
    pageMeta.description = "Sell faster and easier"
    pageMeta.keywords = "sell faster, sell easier, goodybag, goods"
    pageMeta.url = "https://goodytray.com"+LOGIN_PATHS[0]
    return pageMeta
}
const getRegPageMeta = () => {
    var pageMeta = {}
    pageMeta.title = "Sign Up"
    pageMeta.description = "Sell faster and easier"
    pageMeta.keywords = "sell faster, sell easier, goodybag, goods"
    pageMeta.url = "https://goodytray.com"+REGISTER_PATHS[0]
    return pageMeta
}
const getHomePageMeta = () => {
    var pageMeta = {}
    pageMeta.title = SITE_TITLE
    pageMeta.url = "https://goodytray.com/"
    return pageMeta
}
const getProductPageMeta = async (id) => {
    console.log("getProductPageMeta", "111")
    var data = await getProduct(id)
    console.log("getProductPageMeta", "222", data)
    var pageMeta = {}
    if(data == null) {
        pageMeta.title = "Product"
        return pageMeta;

    } else {
        var details = data.details
        pageMeta.title = details.title
        pageMeta.description = details.description
        pageMeta.keywords = details.cat_name+" "+details.title.toLowerCase()
        pageMeta.url = "https://goodytray.com" + productLink(details.title, details.id)
        var image = details.photos.split(',')[0];
        pageMeta.image_type = mimeFromFilename(image);
        pageMeta.image = image
        return pageMeta
    }
    
}
const getSearchPageMeta = () => {
    var pageMeta = {}
    pageMeta.title = "Search"
    pageMeta.description = SITE_TITLE
    pageMeta.keywords = "sell faster, sell easier, goodybag, goods"
    return pageMeta
}
const getAdsTipsPageMeta = () => {
    var pageMeta = {}
    pageMeta.title = "Advert Upload Tips"
    pageMeta.description = SITE_TITLE
    pageMeta.keywords = "how to sell faster, upload tips, recipes"
    return pageMeta
}

module.exports = metaSetter