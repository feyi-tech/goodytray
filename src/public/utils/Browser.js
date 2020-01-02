import axios from "axios"
import {SERVER_ADDR} from "./Constants"
const browser = {}

const axiosBrowser = axios.create({
    baseURL: SERVER_ADDR
})
browser.axios = axiosBrowser

module.exports = browser