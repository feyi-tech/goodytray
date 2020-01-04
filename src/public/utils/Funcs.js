import { SITE_DOT_COM, NO_PROFILE_PHOTO_IMAGE } from "./Constants"
const uuidv4 = require('uuid/v4')

export const overflows = (el) => {
       var curOverflow = el.style.overflowY;
       console.log("curOverflow", curOverflow, el, el.style)
    
       if ( !curOverflow || curOverflow === "visible" )
          el.style.overflow = "hidden";
    
       var isOverflowing = el.clientWidth < el.scrollWidth 
          || el.clientHeight < el.scrollHeight;
    
       el.style.overflow = curOverflow;
       console.log("el.style.overflow", el.style.overflow, isOverflowing)
       return true;//isOverflowing;
}
export const getExtFromMime = function(mime) {
    if(mime == "image/jpeg" || mime == "image/jpg") {
        return ".jpg"

    } else if(mime == "image/png") {
        return ".png"

    } else {
        return ""
    }
}
export const genFilename = (mime) => {
    return uuidv4() + '-' + Date.now() + getExtFromMime(mime)
}
export const remove = function(chrs, text) {
    text += ""
    while(text.includes(chrs[0]) || text.includes(chrs[1])) {
        text = text.replace(chrs[0], "").replace(chrs[1], "")
    }
    return text
}
export const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
  
export const randNum = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
export const getEXT = (filename, includeDot) => {
    var index = filename.indexOf(".");
    if(!includeDot){
        index++;
    }
    return filename.substring(index);
}
export const mimeFromFilename = (filename) => {
    var ext = getEXT(filename, false);
    var mimeExtArray = {jpg: "image/jpeg", png: "image/png"};
    var mime = mimeExtArray[[ext.toLowerCase()]];
    console.log("MIME", mime)
    if(mime) { 
        return mime;

    } else {
        return "";
    }

}
export const currencyLogo = (name) => {
    const logos = {
        dollar: "$",
        naira: "#"
    }
    if(logos.name) {
        return logos.name;

    } else {
        return logos.dollar;
    }
}
export const truncText = (text, len, append) => {
    text += "";
    if(text.length <= len) {
      return text;

    } else {
      return text.substr(0, len)+(append?append:"");
    }
}
export const dataCall = (e) => {
    const number = e.target.getAttribute("data-call");
    const callClass = e.target.getAttribute("data-call-class");
    e.target.innerHTML = formatPhoneNumber(number)+' <i class="'+callClass+'"></i>';
    call(number);
}
export const call = (number) => {
    window.location = "tel:"+number;
}
export const modalAlert = (msg, func) => {
    //alert(msg);
    
    
    if(func) {
        $("#modalOk").click(function() {
            $("#modalAlert").hide()
        }, func)

    } else {
        $("#modalOk").click(function() {
            $("#modalAlert").hide()
        })
    }
    $("#modalBody").text(msg)
    $("#modalAlert").show();
    console.log("#modal")
}

/*
export const decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};*/
export const getIdFromPath = path => {
    path = path.endsWith("/")? path.substring(0, path.length - 1) : path
    const paths = path.split("/")
    return parseInt(paths[paths.length - 1])
}
export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const getIdFromPath2 = (path, posFromEnd) => {
    path = path.endsWith("/")? path.substring(0, path.length - 1) : path
    const paths = path.split("/")
    return parseInt(paths[paths.length - (posFromEnd + 1)])
}
export const profilePhoto = (link) => {
    if(!link || link.length == 0) {
        return NO_PROFILE_PHOTO_IMAGE

    } else {
        return link
    }
}
export const commaNum = (num) => {
    num += "";
    console.log("NUM BEFORE", num);
    //remove non-digit characters
    num = num.replace(/\D/g, "");
    //add commas before every 3 digits
    num = num.split(/(?=(?:\d{3})+$)/).join(",");
    return num;
}
const formatPhoneNumber = (num) => {
    num += "";
    var plus = "";
    if(num.startsWith("+"))plus = "+"; num = num.substr(1);
    //remove non-digit characters
    num = num.replace(/\D/g, "");
    //add commas before every 3 digits
    // /(?=(?:\d{3})+$)/
    // (?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}
    num = num.split(/(?=(?:\d{3})+(?:\d{4})$)/).join("-");
    num = num.split(/(?=(?:\d{4})+$)/).join("-");
    return plus+num;
}
export const isValidNumber = function(number) {
    return (number != null && number.length > 0)
}

export const isValidEmail = function(email) {
    return (email != null && email.length > 0)
}

export const isClientSide = function() {
    return (typeof window !== 'undefined')
}

export const getCopy = function() {
    const date = new Date()
    return "© 2019 "+SITE_DOT_COM;
}

export const id = function(ele) {
    return document.getElementById(ele)
}

export const cls = function(ele) {
    return document.getElementsByClassName(ele)
}

export const jsonEmpty = function (obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) return false
    }
    return true
}
String.prototype.shuffle = function() {
    var a = this.split(""), 
    n = a.length

    for(var i = n- 1; i > 0; i--) {
        var j = Math.floor(Math.random * (i + 1));
        var tmp = a[i];
        a[i] = a[j]
        a[j] = tmp
    }
    return a.join("")
}
String.prototype.shuffleHash = function() {
    var a = this.split(""), 
    n = a.length

    for(var i = n- 1; i > 0; i--) {
        var j = Math.floor(Math.random * (i + 1));
        var tmp = a[i].hashCode;
        a[i] = a[j]
        a[j] = tmp
    }
    return a.join("")
}
String.prototype.hashCode = function() {
    var hash = 0; i, this.chr
    if(this.length === 0)return hash
    for(i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i)
        hash = ((hash << 5) - hash) + chr
        hash |= 0//convert to 32 bit integer
    }
    return hash
}
export const randomString = function (length) {
    var text = "ABCDEFGHIJKLMNOPQRSTUVWXWZabcdefghijklmnopqrstuvwxyz0123456789"
    text = text.shuffle()
    return length >= text.length? text : text.substr(0, length)
}

export const randomHashString = function (length) {
    var text = "ABCDEFGHIJKLMNOPQRSTUVWXWZabcdefghijklmnopqrstuvwxyz0123456789"
    text = text.shuffleHash()
    return length >= text.length? text : text.substr(0, length)
}


const helpers = {
    helper1: function(){

    },
    helper2: function(param1){

    },
    helper3: function(param1, param2){

    }
}

export default helpers;