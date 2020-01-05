const dotenv = require('dotenv')
const result = dotenv.config({ path: 'env/.env' })
if (result.error) {
  throw result.error
}
 
console.log("PROCESS_ENV_DATA", result.parsed)
console.log("DB_PASS", process.env.DB_PASS)
import compression from 'compression'
import express from 'express'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter as Router } from 'react-router-dom'
import MultipleRoutes from './public/components/MultipleRoutes'
import MultipleRoutesLogin from './public/components/MultipleRoutesLogin'
import SingleRoute from './public/components/SingleRoute'
import template from "./public/views/template"
import templateSell from "./public/views/template-sell"

import Users from "./public/routes/Users";
import Products from "./public/routes/Products";
import Cats from "./public/routes/Cats"
import SubCats from "./public/routes/SubCats"
import Attrs from "./public/routes/Attrs"
import Countries from "./public/routes/Countries"
import States from "./public/routes/States"
import Cities from "./public/routes/Cities"
import Messages from "./public/routes/Messages"
import Reviews from "./public/routes/Reviews"

import PageMetaSetter from "./public/routes/PageMetaSetter"

import {checkUserAuth, logOut} from "./public/components/UserFunctions"
import {API_ROOT, PORT, PORT_SSL} from "./public/utils/Constants"
import {error400, error500} from "../src/public/utils/Errors"
import { SELL_PATHS, APP_PATHS, LOGIN_PATHS } from './public/utils/RoutePaths'

import { truncText, sleep, randNum, genFilename } from './public/utils/Funcs'

import { EXCHANGE_RATE, urlToFileStream } from './public/utils/ExpressFunc'

const browser = require("../src/public/utils/Browser")

const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

if(process.env.SSL_KEY && process.env.SSL_CHAIN) {
  const helmet = require("helmet");
  app.use(helmet())
}

app.use(cookieParser(process.env.COOKIES_SECRET_KEY));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
// for compressing hhml and resources
app.use(compression());
// set static folder for generated css and front js files


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

// set routes
app.use(API_ROOT + "users", Users)
app.use(API_ROOT + "products", Products)
app.use(API_ROOT + "cats", Cats)
app.use(API_ROOT + "sub_cats", SubCats)
app.use(API_ROOT + "attrs", Attrs)
app.use(API_ROOT + "countries", Countries)
app.use(API_ROOT + "states", States)
app.use(API_ROOT + "cities", Cities)
app.use(API_ROOT + "messages", Messages)
app.use(API_ROOT + "reviews", Reviews)

app.use('/public', express.static(path.resolve(__dirname, 'public')))


app.use("*", checkUserAuth);

app.use(LOGIN_PATHS, logOut);

const http = require("https")
const jijiHome = "https://jiji.ng"
var headers = {
  "Host": "jiji.ng",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:71.0) Gecko/20100101 Firefox/71.0",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "DNT": "1",
  "Connection": "keep-alive",
  "Cookie": "__cfduid=d581ec910fa12b89fb91de6f2ba15285c1577679687; first_visit=1577679687; app=424394a3db1337c2c279eda31139d846; uid=44cfa8e7187ffd9f1c032e673714c4674c4bb864; device_logged=true; visits=done; rid=direct",
  "Upgrade-Insecure-Requests": "1",
  "TE": "Trailers",
};
app.get("/insp", async (req, res) => {
  const user = res.locals.token_user
  if(!user || user.email != "jinminetics@gmail.com") {
    res.send("Action denied")

  } else {
    const cats = [/*
      [15, "cars:191"], 
      [9, "mobile-phones:101"],
      [4, "computers-and-laptops:37", "tv-dvd-equipment:38"],
      [0, "farm-machinery-equipment:0", 
      "feeds-supplements-seeds:1", "livestock-and-poultry:2", 
      "meals-and-drinks:3"
      ],
      [1, "birds:4", "cats-and-kittens:5", "dogs-and-puppies:6"],
      [7, "decor-accessories:58", "furniture:56"],
      [2, "babies-and-kids-accessories:11", "baby-care:12", "toys:19"],
      [3, "industrial-ovens:20", "manufacturing-equipments:21"],
      [5, "bags:41", "clothing:42", "shoes:45", "watches:46", 
      "wedding-wear:47"],
      [14, "art-collectibles:183", "books-and-games:184", "musical-instruments:187", 
      "sports-bicycles-and-fitness:188"],
      [12, "accounting-and-finance-cvs:122", "advertising-and-marketing-cvs:123"],
      [13, "automotive-services:160", "building-and-trades-services:161"],*/
      [8, "accounting-and-finance-jobs:62", "advertising-and-marketing-jobs:63"]
    ]
/*
    for(var i = 0; i < cats.length; i++) {
      await saveCatProducts(cats[i], res, i == cats.length - 1);
    }*/
    fs.readFile('json/result.json', async function (err, data) {
      if(err) {
        res.json({err})

      } else {
        var json = null
        if(data.length == 0) {
          json = []

        } else {
          json = JSON.parse(data)
        }

        var sliced = json.slice(200)
        console.log("JSON_SIZE", json.length)
        console.log("SLICED_SIZE", sliced.length)
  
        for(var i = 0; i < sliced.length; i++) {
          var advert = sliced[i]
          console.log("SAVE_PRODUCT", advert.addr)
          await saveProduct(advert.addr, advert.cat_id, advert.sub_cat_id, "", res, i == sliced.length - 1)
        }
      }
    })
  }
})
const saveCatProducts = async (list, res, isLast) => {
  console.log("saveCatProducts", list)
  const catId = list[0];
  for(var i = 1; i < list.length; i++) {
    const idAndLink = list[i].split(":")
    await saveSubcatProducts(catId, idAndLink[1], idAndLink[0], res, isLast && i == list.length - 1)
  }
}

const product_links = []
const saveSubcatProducts = async (catId, subCatId, subCatLink, res, isLast) => {
  console.log("saveSubcatProducts", subCatLink);
  const link = "https://jiji.ng/api_web/v1/listing?slug=" + subCatLink
  
  var request = http.get(link, {headers: headers});
  request.on("response", (data) => {
    data.setEncoding('utf8');
    console.log("HEADERS", data.headers);
      var chunks = [];
      data.on('data', (chunk) => {
       chunks.push(chunk);
      })
      data.on('end', async () => {
        const productsPage = chunks.join('');
        console.log("saveSubcatProducts", "https://jiji.ng/api_web/v1/listing?slug=" + subCatLink, truncText(productsPage, 100, "..."))
        const json = JSON.parse(productsPage)
        var adverts = json.adverts_list
        adverts = adverts.adverts
        var productApiPrefix = "https://jiji.ng/api_web/v1/item/"
        fs.readFile('json/result.json', function (err, data) {
          if(err) {
            res.json({err})

          } else {
            var json = null
            if(data.length == 0) {
              json = []

            } else {
              json = JSON.parse(data)
            }
      
            adverts.forEach(async (advert, index) => {
              if(advert.images_count > 3) {
                var pathAndQuery = advert.url.split("\?")
                var path = pathAndQuery[0].split("-")
                path = path[path.length - 1]
                path = path.substring(0, path.indexOf("."))
                const toSave = productApiPrefix + path + "?" + pathAndQuery[1]
                await json.push({cat_id: catId, sub_cat_id: parseInt(subCatId), addr: toSave});
                
                
                //await saveProduct(toSave, catId, subCatId, subCatLink, res, isLast && index == adverts.length - 1)
              }
            });
            fs.writeFile("json/result.json", JSON.stringify(json), function(err){
              if (err) throw err;
              console.log('The "data to append" was appended to file!');
              if(isLast) {
                console.log("COMPLETED");//res.json({data: json})
              }
            });
          }
        })
        
    })
  })
}

var FormData = require('form-data');
const User = require("../src/public/models/User")
const Product = require("../src/public/models/Product")
const fs = require('fs');
const saveProduct = async (productLink, catId, subCatId, subCatLink, res, isLast) => {
  var request = http.get(productLink, {headers: headers});
  request.on("response", async (data) => {
    data.setEncoding('utf8');
      var chunks = [];
      data.on('data', (chunk) => {
       chunks.push(chunk);
      })
      data.on('end', async () => {
        const productPage = chunks.join('');
        console.log("saveProduct", productLink, truncText(productPage, 100, "..."))
        const json = JSON.parse(productPage)
        await saveProductFromJson("not_checked", json, catId, subCatId, subCatLink, res, isLast)
      })
  })
}


const bcrypt = require("bcrypt")
const imageEditor = require("../src/public/utils/imageEditor")
const saveProductFromJson = async (user, json, catId, subCatId, subCatLink, res, isLast) => {
        var advert = json.advert
        var seller = json.seller
        console.log("SELLER", seller)
        var date = new Date();
        date.setTime(date.getTime() - randNum(8640000000, 34560000000))
        var email = (seller.name.replace(/\s/g, "") + ".gen@goodytray.com").toLowerCase()
        const newUser = {
          email: email,
          password: "67941595",
          number: "+2348035389118",
          firstname: seller.name.split(" ")[0],
          lastname: seller.name.split(" ")[1]?seller.name.split(" ")[1]:"",
          created: date,
          var_key: "verkey",
          validated: 0,
          profile_photo: ""
        }
        if(!user) {
          //create a new user
          console.log("USER_STATE", "!USER")
          bcrypt.hash(newUser.password, 10, function(err, hash) {
            newUser.password = hash
            User.create(newUser)
            .then(async (userResp) => {
              await saveProductFromJson(userResp, json, catId, subCatId, subCatLink, res, isLast)
                            
            })
            .catch(function(err) {
              console.log("REG_ERROR: "+err)
            })
          })

        } else if(user == "not_checked") {
          //check if user exists and call this method again with the response
          console.log("USER_STATE", "!NOT_CHECKED")
          User.findOne({
            where: {
                email: newUser.email
            }
    
          })
          .then(async (user) => {
            await saveProductFromJson(user, json, catId, subCatId, subCatLink, res, isLast)
          })
          .catch(function(err) {
            console.log("CHECK_USER_ERROR: "+err)
          })

        } else {
          //upload product
          console.log("USER_STATE", "OBJ", user.id)
          var form = new FormData();
          var photos = []
          var photosB = []
          for(var m = 0; m < advert.images.length; m++) {
            var img = advert.images[m]
            console.log("USER_STATE", "img.url", img.url)
            var stream = await urlToFileStream(img.url, true)
            console.log("USER_STREAM", stream[1])
            var photo = genFilename(stream[1])
            fs.writeFileSync("dist/public/res/images/products/"+photo, stream[0]);
            photos.push("dist/public/res/images/products/"+photo)
            photosB.push("/public/res/images/products/"+photo)
          }
          await imageEditor.waterMark(photos)
          var attributes = advert.attributes
          var attrs = []
          await attributes.forEach(attr => {
            attrs.push(attr[0] + ":" +attr[1])
          });
          var currencySymbol = "&#8358;"
          var product = {
            user_id: user.id,
            cat_id: catId,
            sub_cat_id: subCatId,
            attrs: attrs.length > 0?"_"+attrs.join(",")+"_":"",
            currency_symbol: currencySymbol,
            price: advert.price.value,
            global_price: EXCHANGE_RATE[[currencySymbol]] * advert.price.value,
            title: advert.title,
            description: advert.description,
            country_id: 160, 
            state_id: 2671,
            city_id: 30983,
            photos: photosB.join(",")

          }
          var product = await Product.create(product);
          if(isLast) {
            console.log("ProductAddComplete", {completed: true, product: product, error: null})

          } else {
            console.log("ProductAdded", {completed: true, product: product, error: null})
          }

        }
}


app.use("/", PageMetaSetter);

app.get(SELL_PATHS, (req, res) => {
  if(res.locals.token_user) {
    const initialData = {
      isSingle: true,
      user: res.locals.token_user,
      last_product_cat_id: res.locals.last_product_cat_id,
      cats: [],
      countries: [],
      price_currency_symbols: []
    }
  
    browser.axios.get(API_ROOT + "cats")
    .then(response => {
      initialData.cats = response.data.cats
  
      browser.axios.get(API_ROOT + "countries?include_currency_symbols=1")
      .then(counriesData => {
        initialData.countries = counriesData.data.countries
        initialData.currency_symbols = counriesData.data.currency_symbols
  
        const context = {}
        initialData.pageMeta = res.locals.pageMeta
        const component = ReactDOMServer.renderToString(
        <Router location={req.url} context={context}>
          <SingleRoute initialData={initialData} />
        </Router>
        )
        initialData.pageMeta.title = req.url.startsWith("/edit-ad")?'Edit ad':'Add free ad';
        res.send(templateSell({
            body: component,
            initialData: initialData
        }));
  
      })
      .catch(err => {
        res.send(error500("a:"+err+JSON.stringify(initialData)))
      })
  
      
    })
    .catch(err => {
      res.send(error500("b:"+err))
    })

  } else {
    res.redirect("/login?next="+encodeURI("/sell"))
  }
})

app.use(APP_PATHS, (req, res) => {
  const initialData = {isSingle: false, user: res.locals.token_user, last_product_cat_id: res.locals.last_product_cat_id}

  var component;
  const context = {}
  
  initialData.pageMeta = res.locals.pageMeta
  
  if(initialData.user == null) {
    component = ReactDOMServer.renderToString(
      <Router location={req.url} context={context}>
        <MultipleRoutes initialData={initialData}/>
      </Router>
    )

  } else {
    component = ReactDOMServer.renderToString(
      <Router location={req.url} context={context}>
        <MultipleRoutesLogin initialData={initialData}/>
      </Router>
    )
  }
  res.send(template({
    body: component,
    initialData: initialData
  }));

})

app.get('*', (req, res) =>
  res
    .status(404)
    .send(
      error400("")
    )
)
app.listen(PORT, () => console.log('Server running on port: ' + PORT))
if(process.env.SSL_KEY && process.env.SSL_CHAIN && process.env.SSL_KEY.length > 0 && process.env.SSL_CHAIN.length > 0) {
  console.log("SAW", "YEAS")
  const https = require("https"),
  fs = require("fs");

  const options = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CHAIN)
  };
  if(process.env.SSL_DH && process.env.SSL_DH.length > 0) {
    options.dhparam = fs.readFileSync(process.env.SSL_DH)
  }
  https.createServer(options, app).listen(PORT_SSL, () => console.log('Server running on ssl port: ' + PORT_SSL));
}