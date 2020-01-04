const express = require("express")

const User = require("../models/User")
const Cat = require("../models/Cat")
const SubCat = require("../models/SubCat")
const Country = require("../models/Country")
const State = require("../models/State")
const City = require("../models/City")
const Sequelize = require("sequelize")
const Op = Sequelize.Op
const db = require("../database/db")

export const EXCHANGE_RATE = {["&#36;"]: 1, ["&#8358;"]: 360}

const http = require("https")
const Stream = require("stream").Transform
export const urlToFileStream = async (url, includeMime) => {
  
    var promise = new Promise((resolve, reject) => {
      var request = http.get(url);
       
      request.on("response", async (response) => {
        //response.setEncoding('base64');
        var data = new Stream()
        response.on('data', (chunk) => {
          data.push(chunk); 
        })
        response.on('end', () => {
          var stream = data.read()
          resolve(includeMime?[stream, response.headers['content-type']]:stream)
            
        })
      })
    })
    return promise
}
export const userDetails = async (id) => {
    return await User.findOne({
        where: {
            [Op.or]: [{id: {[Op.eq]: id}}, {email: {[Op.eq]: id}}]
        }, 
        attributes: {
            exclude: ['password', 'cookie', 'cookie_exp', 'validated', 'ver_key']
        }
    })
    .then(user => {
        if(user) {
            return {user: user, error: null}

        } else {
            return {user: null, error: "not found"}
        }
    })
    .catch(error => {
        console.log(req.url + " error: " + error)
        return {user: null, error: ERROR_DB_OP}
    })
}

export const nameToId = async (name, table) => {
    const tables = ['cats', 'sub_cats', 'countries', 'states', 'cities']
    if(!tables.includes(table.toLowerCase()) || !name || name.length == 0) {
        return "uuu"

    } else {
        var query = null
        switch (table) {
            case "cats":
                query = "SELECT id from cats WHERE UPPER(name) = ? LIMIT 1"
                break;
            case "sub_cats":
                query = "SELECT id from sub_cats WHERE UPPER(name) = ? LIMIT 1"
                break;
            case "countries":
                query = "SELECT id from countries WHERE UPPER(name) = ? LIMIT 1"
                break;
            case "states":
                query = "SELECT id from states WHERE UPPER(name) = ? LIMIT 1"
                break;
            case "cities":
                query = "SELECT id from cities WHERE UPPER(name) = ? LIMIT 1"
                break;
        
            default:
                break;
        }
        if(query) {
            return db.sequelize.query(query, {
                replacements: [name.toUpperCase()],
                raw: false, 
                type: Sequelize.QueryTypes.SELECT,
                model: Cat,
                mapToModel: true
            })
            .then(result => {
                return result && result[0]?JSON.stringify(result[0].id):-1
            })
            .catch(e => {
                return null
            })
            
        } else {
            return null
        }
    }
}