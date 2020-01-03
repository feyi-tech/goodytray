import compression from 'compression'
import express from 'express'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter as Router } from 'react-router-dom'
import MultipleRoutes from './public/components/MultipleRoutes'
import MultipleRoutesLogin from './public/components/MultipleRoutesLogin'
import SingleRoute from './public/components/SingleRoute'
import {PORT, PORT_SSL, SSL_KEY, SSL_CHAIN, SSL_DH, LOGIN_SPAN_IN_SECONDS} from "./public/utils/Constants"
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

import {checkUserAuth} from "./public/components/UserFunctions"
import {API_ROOT} from "./public/utils/Constants"
import {error400, error500} from "../src/public/utils/Errors"
import { SELL_PATHS, APP_PATHS, LOGIN_PATHS } from './public/utils/RoutePaths'

const browser = require("../src/public/utils/Browser")

process.env.SECRET_KEY = "(*&*&RDCUFVV^54865VUY&^58^%$&^%GF^%"
process.env.COOKIES_SECRET_KEY ="(*&*&RDCUFVV^54865VUY&^58^%$&^%GF^%"

const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const multer = require("multer")

if(SSL_KEY && SSL_CHAIN) {
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
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
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

app.post("/login", (req, res, next) => {
  res.cookie('login_token', "out", {
    signed : true, 
    maxAge: LOGIN_SPAN_IN_SECONDS,
    httpOnly: true
  })
  next()
})
app.use(APP_PATHS, checkUserAuth);

const http = require("https")

const get = async (url) => {
  return await http.get(url, async (res) => {
    var chunks = [];
    await res.on('data', (chunk) => {
      chunks.push(chunk);
    })
    await res.on('end', () => {
      const rez = chunks.join('')
      console.log("JIJI_HOME2", rez)
      return rez
    })
  })
}

app.get("/insp", async (req, res) => {
  const user = res.locals.token_user
  if(!user || user.email != "jinminetics@gmail.com") {
    res.send("Action denied")

  } else {
    const root = "https://jiji.ng/"
    const cats = [
      ["Vehicles", "cars"], 
      ["Mobile Phones", "mobile-phones"], 
      ["Electronics", "computers-and-laptops", "tv-dvd-equipment"], 
      ["Home, Furnitures", "furniture"], 
      ["Fashion", "bags", "clothing", "shoes", "watches", 
      "wedding-wear"],
      ["Sports", "art-collectibles", "books-and-games", "musical-instruments", 
      "sports-bicycles-and-fitness"],
      []
    ]
    http.get("https://jiji.ng", (data) => {
      var chunks = [];
      data.on('data', (chunk) => {
       chunks.push(chunk);
      })
      data.on('end', () => {
        res.send(chunks.join(''))
      })
    })
  }
})
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
  console.log("PAGE_META_REQUEST_URL", "MIDDLE_REZ", res.locals.pageMeta)
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
if(SSL_KEY && SSL_CHAIN) {
  const https = require("https"),
  fs = require("fs");

  const options = {
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CHAIN)
  };
  if(SSL_DH) {
    options.dhparam = fs.readFileSync(SSL_DH)
  }
  https.createServer(options, app).listen(PORT_SSL, () => console.log('Server running on ssl port: ' + PORT_SSL));
}