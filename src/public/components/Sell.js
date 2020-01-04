import React, { Component } from 'react'
import { uploadProduct } from './UserFunctions'
import { SITE_NAME, API_ROOT, SITE_DOT_COM } from '../utils/Constants'
const browser = require('../utils/Browser')
import {id, cls, commaNum, remove, currencyLogo} from '../utils/Funcs'
import {MAX_PRODUCT_PHOTOS_SIZE} from "../utils/Constants"
import { productLink } from '../utils/LinkBuilder'


class Sell extends Component {
  constructor(props) {
    super(props)
    this.state()

    this.state.user = props.initialData.user
    this.state.fullname = props.initialData.user.firstname
    if(props.initialData.user.lastname) {
      this.state.fullname += " " + props.initialData.user.lastname
    }

    this.state.number = props.initialData.user.number
    this.state.email = props.initialData.user.email

    //set arrays
    this.state.cats = props.initialData.cats
    this.state.countries = props.initialData.countries
    this.state.currency_symbols = props.initialData.currency_symbols
    this.state.price_currency_symbol = this.state.currency_symbols[0]
    
    this.handleChange = this.handleChange.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.onPhotoChangedHandler = this.onPhotoChangedHandler.bind(this)
    this.removePhoto = this.removePhoto.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  state () {
    
    this.state = {
      cat: -1,
      sub_cat: -1,
      country: -1,
      state: -1,
      city: -1,
      price_currency_symbol: '',
      title: '',
      desc: '',
      price: '',
      photos: [],
      photo_size: 0,
      loaded: 0,
      attrs: [],
      attributes: "",

      user: null,
      fullname: '',
      number: '',
      email: '',
      cats: [],
      sub_cats: [],
      countries: [],
      states: [],
      cities: [],
      input_attrs: [],
      checkbox_attrs: [],
      select_attrs: [],
      compulsory_attrs: [],

      
      currency_symbols: []
    }
  }

  resetState() {
    const states = [
      {cat: -1},
      {sub_cat: -1},
      {country: -1},
      {state: -1},
      {city: -1},
      {title: ''},
      {desc: ''},
      {price: ''},
      {photos: []},
      {photo_size: 0},
      {loaded: 0},
      {attrs: []},

      {sub_cats: []},
      {states: []},
      {cities: []},
      {input_attrs: []},
      {checkbox_attrs: []},
      {select_attrs: []},
      {compulsory_attrs: []}
    ]

    var i = 0
    while(i < states.length) {
      try {
        this.setState(states[i])
      }catch(e) {
        console.log("SET_ERROR", e)
      }
      i++
    }

    //set photos
    i = 0
    const files = []
    while(i < 20) {
      files.push(null)
      i++
    }
    this.setState({photos: files})
  }

  componentDidMount() {
    console.log("Mounted YYY")
    this.resetState()
  }

  componentDidUpdate(prevProps) {
    console.log("update")
  }

  removeErrors() {
    var errs = cls("fw-field__error");

    if(errs.length > 0) {
        for(var i = 0; i < errs.length; i++) {
            errs[i].classList.add(["hide"])
        }
    }
  }

  setError(elId, error) {
    var err = id(elId + "-error")
    err.innerHTML = error
    err.classList.remove(["hide"])
  }

  beforePost() {
    id("spiner").classList.remove(["hide"])
    id("ad-form").classList.add(["hide"])
  }

  afterPost() {
    id("spiner").classList.add(["hide"])
    id("ad-form").classList.remove(["hide"])
  }

  handleSubmit = (e) => {
    e.preventDefault()
    console.log("submit detected")
    this.removeErrors()
    var hasError = false

    const product = {

    }

    if(this.state.cat == -1) {
      this.setError("cat", "Please select a category")
      hasError = true

    } else {
      product.cat = this.state.cat
    }

    if(this.state.sub_cat == -1) {
      this.setError("sub_cat", "Please select a sub category")
      hasError = true

    } else {
      product.sub_cat = this.state.sub_cat
    }

    if(this.state.attrs == -1) {
      this.setError("email", "Please select your category")
      hasError = true
    }

    const all_attrs = this.state.input_attrs.concat(this.state.select_attrs).concat(this.state.checkbox_attrs)
    console.log("all_attrs: ", all_attrs)
    this.state.attrs = [];
    this.setState({attrs: []})
    if(all_attrs.length > 0) {
      for(var i = 0; i < all_attrs.length; i++) {
        //if the attribute value was not provided and the attr is compulsory
        if(this.state.compulsory_attrs.includes(all_attrs[i].key) 
        && 
          (!this.state[all_attrs[i].key] 
            || this.state[all_attrs[i].key].length == 0 
            || this.state[all_attrs[i].key].startsWith("-- Select"))) {
          this.setError(all_attrs[i].key, all_attrs[i].key+" cannot be empty")
          hasError = true

        } //if the attribute value was provided
        else if(this.state[all_attrs[i].key] && this.state[all_attrs[i].key].length > 0 && !this.state[all_attrs[i].key].startsWith("-- Select")) {
          var attr_list = []
          var values = []
          if(all_attrs[i].input_type.startsWith("input")) {
            attr_list = this.state.input_attrs

          } else if(all_attrs[i].input_type.startsWith("select")) {
            attr_list = this.state.select_attrs

          } else if(all_attrs[i].input_type.startsWith("check")) {
            attr_list = this.state.checkbox_attrs
            
          }
          console.log("attr_list: "+attr_list)
          for(var v = 0; v < attr_list.length; v++) {
            if(attr_list[v].key == all_attrs[i].key) {
              values = attr_list[v].values
            }
          }
          console.log("attr_values 1: "+JSON.stringify(values))
          //if the provided attribute is not in the list of attributes values
          if(!all_attrs[i].input_type.startsWith("input") && !all_attrs[i].input_type.startsWith("check") && !values.includes(this.state[all_attrs[i].key])) {
            this.setError(all_attrs[i].key, "Invalid " + all_attrs[i].key)
            hasError = true

          } else {
            var value = this.state[all_attrs[i].key]
            if(all_attrs[i].input_type == "input_int") {
              value = parseInt(remove([",", "."], value))
              if(!isNaN(value)) {
                this.state.attrs.push(all_attrs[i].key +":"+ value)
              }

            } else if(all_attrs[i].input_type == "check_box") {
              this.state.attrs.push(value)

            } else {
              this.state.attrs.push(all_attrs[i].key +":"+ value)
            }
            console.log("push 1: "+all_attrs[i].key +" = "+ value)
          }
        }
      }
      product.attrs = this.state.attrs
      console.log("this.product.attrs: "+JSON.stringify(product.attrs))
    }

    var noPhoto = true
    const formData = new FormData()
    const dataPhotos = []
    for(var i = 0; i < this.state.photos.length; i++) {
      if(this.state.photos[i] != null && this.state.photos[i] != "") {
        noPhoto = false
        formData.append("file", this.state.photos[i])
        dataPhotos.push(this.state.photos[i])
      }
    }
    console.log("noPhoto", noPhoto)
    console.log("formData a", JSON.stringify(formData))
    if(noPhoto) {
      this.setError("photo", "Please upload at least one photo")
      hasError = true
    }

    if(this.state.currency_symbols.indexOf(this.state.price_currency_symbol) == -1) {
      this.setError("price", "Please select your currency")
      hasError = true

    } else if(this.state.price.length == 0 || isNaN(parseInt(this.state.price))) {
      this.setError("price", "Please enter your price")
      hasError = true

    } else {
      product.price_currency_symbol = this.state.price_currency_symbol
      console.log("product.price_currency_symbol", product.price_currency_symbol)
      product.price = parseInt(remove([",", "."], this.state.price))
    }

    if(this.state.title.length == 0) {
      this.setError("title", "Please enter advert title")
      hasError = true

    } else {
      product.title = this.state.title
    }

    if(this.state.desc.length == 0) {
      this.setError("desc", "Please enter description")
      hasError = true

    } else {
      product.desc = this.state.desc
    }

    if(this.state.country == -1) {
      this.setError("country", "Please select country")
      hasError = true

    } else {
      product.country = this.state.country
    }

    if(this.state.state == -1) {
      this.setError("state", "Please select state")
      hasError = true

    } else {
      product.state = this.state.state
    }

    if(this.state.city == -1) {
      this.setError("city", "Please select city")
      hasError = true

    } else {
      product.city = this.state.city
    }


    if(!hasError) {
      this.beforePost()
      
      const config = {/*
        headers: {
          'content-type': 'application/x-www-form-urlencoded'//'multipart/form-data'
        },*/
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
          })
        }
      }

      browser.axios.post(API_ROOT + "products/upload/photos", formData)
      .then(response => {
        var respData = response.data
        if(respData.status == 1) {

          product.photos = respData.filenames
          browser.axios.post(API_ROOT + "products/upload/", {product: product})
          .then(response => {
            respData = response.data
            console.log("respData: ", respData)
            if(respData.status == 1) {
              const productId = respData.product_id
              console.log("pid", productId)
              //alert("Success")
              window.location.href = productLink(this.state.title, productId)
            } else {
              for(var er = 0; er < respData.form_errors.length; er++) {
                //console.log("respData.form_errors[er].key, respData.form_errors[er].value: ", respData.form_errors[er].key, respData.form_errors[er].value)
                this.setError(respData.form_errors[er].key, respData.form_errors[er].value)
              }
              this.afterPost()
            }
          })
          .catch(err => {
            console.log("UploadError inner: "+JSON.stringify(err))
            this.afterPost()
          })

        } else {
          this.setError("photo", status.message)
          this.afterPost()
        }
        console.log("UploadResult: "+JSON.stringify(response.data))
      })
      .catch(err => {
        console.log("UploadError: "+JSON.stringify(err))
        this.afterPost()
      })
    }
    
  }

  handleCheckboxChange = e => {
    const key = e.target.name;
    var values = "";
    const elements = document.getElementsByName(key);
    for(var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if(element.checked) {
        values += key+":"+element.value+",";console.log("handleCheckboxChange", "key:value", key+":"+element.value+",")
      }
    }
    if(values.length > 0) {
      values = values.substring(0, values.length - 1)
      this.state[key] = values;
      this.setState({[key]: values})
      console.log("handleCheckboxChange", "values", this.state[key])
    }
  }
  handleChange = (e) => {
    if(!e.target.getAttribute("data-limit") || e.target.value.length <= parseInt(e.target.getAttribute("data-limit"))) {
      if(e.target.getAttribute("data-type") && e.target.getAttribute("data-type") == "number") {
        var number = commaNum(e.target.value)
        if(number.length > 0) {
          this.state[e.target.name] = number
          this.setState({[e.target.name]: number})
        }

      } else {
        this.state[e.target.name] = e.target.value
        this.setState({[e.target.name]: e.target.value})
      }

      console.log(e.target.name +": "+e.target.value)
      switch(e.target.name) {
        case "cat":
          this.onCatChanged()
          break
        case "sub_cat":
          this.onSubCatChanged()
          break
        case "country":
          this.onCountryChanged()
          break
        case "state":
          this.onStateChanged()
          break
      }

    } else {
      e.target.value = this.state[e.target.name]
    }
  }


  clearAllFields = e => {
    e.preventDefault
    console.log("clearAllFields")
    this.resetState()
  }
  removePhoto = e => {
    const photos = this.state.photos
    console.log("removeTarget", e.target)
    const index = parseInt(e.target.getAttribute("photo-index"))
    console.log("photoIndex", index)
    const photo = photos[index]
    this.state.photo_size -= photo.size
    photos.splice(index, 1)
    this.state.photos = photos
    this.setState({photos: photos})
  }

  onPhotoChangedHandler = e => {
    this.setState({loaded: 0})
    const files = e.target.files
    var nextPhotoIndex = parseInt(e.target.getAttribute("photo-index"))
    console.log("e.target.getAttribute: "+e.target.getAttribute("photo-index"))
    
    const photos = this.state.photos
    for(var i = 0; i < files.length; i++) {
      console.log("id: "+i)
      console.log("photos.length: "+photos.length)
      console.log("nextPhotoIndex: "+nextPhotoIndex)
      if(nextPhotoIndex >= photos.length) {
        nextPhotoIndex = 0
      }
      while(photos[nextPhotoIndex] != null || photos[nextPhotoIndex] == "") {
        nextPhotoIndex++
        if(nextPhotoIndex >= photos.length) nextPhotoIndex = 0
      }
      if(this.state.photo_size + files[i].size > MAX_PRODUCT_PHOTOS_SIZE) {
        console.log("max reached")
        this.setError("photo", "You've exceded the total maximum file size allowed")

      } else {
        photos[nextPhotoIndex] = files[i]
        this.state.photo_size += files[i].size
      }
      console.log("asadasdsd")
      console.log("photo-size:", files[i].size, "totalSize:", this.state.photo_size, "maxSize:", MAX_PRODUCT_PHOTOS_SIZE)
      nextPhotoIndex++
    }
    this.setState({photos: photos})
    console.log("photos")
    console.log(this.state.photos)
  }

  resetCustomInputs() {
    this.setState({input_attrs: []})
    this.setState({select_attrs: []})
    this.setState({checkbox_attrs: []})
    this.setState({compulsory_attrs: []})
  }

  onCountryChanged() {
    const eid = this.state.country
    console.log("id = "+eid)
    const section = id("state-section")
    const section2 = id("city-section")
    section.classList.add(["disabled-section"], ["loading-section"])
    section2.classList.add(["disabled-section"])
    this.setState({states: []})
    this.setState({city: []})
    browser.axios.get(API_ROOT + "states?cid="+eid)
    .then(response => {
      this.setState({states: response.data.states})
      section.classList.remove(["disabled-section"], ["loading-section"])
    })
  }

  onStateChanged() {
    const eid = this.state.state
    console.log("id = "+eid)
    const section = id("city-section")
    section.classList.add(["disabled-section"], ["loading-section"])
    this.setState({city: []})
    browser.axios.get(API_ROOT + "cities?sid="+eid)
    .then(response => {
      this.setState({cities: response.data.cities})
      section.classList.remove(["disabled-section"], ["loading-section"])
    })
  }

  onCatChanged () {
    const eid = this.state.cat
    console.log("id = "+eid)
    const section = id("sub_cat-section")
    section.classList.add(["disabled-section"], ["loading-section"])
    this.resetCustomInputs()
    //id("custom-section").classList.add(["disabled-section"])
    browser.axios.get(API_ROOT + "sub_cats?cid="+eid)
    .then(response => {
      this.setState({sub_cats: response.data.sub_cats})
      section.classList.remove(["disabled-section"], ["loading-section"])
    })
  }

  onSubCatChanged () {
    const eid = this.state.sub_cat
    console.log("scid = "+eid)
    this.resetCustomInputs()
    const section = id("custom-section")
    section.classList.add(["disabled-section"], ["loading-section"])
    browser.axios.get(API_ROOT + "attrs?scid="+eid)
    .then(response => {
      console.log("response.data.attrs: "+JSON.stringify(response.data.attrs))
      const attrs = response.data.attrs
      if(attrs != null && attrs.length > 0) {
        const input_attrs = []
        const select_attrs = []
        const checkbox_attrs = []
        const compulsories = []
        for(var i = 0; i < attrs.length; i++) {
          if(attrs[i].input_type.startsWith("input")) {
            input_attrs.push(attrs[i])

          } else if(attrs[i].input_type.startsWith("select")) {
            select_attrs.push(attrs[i])
          
          } else if(attrs[i].input_type.startsWith("check_box")) {
            checkbox_attrs.push(attrs[i])
          
          }

          if(!attrs[i].allow_null) {
            compulsories.push(attrs[i].key)
          }
        }
        console.log("input_attrs", input_attrs)
        console.log("select_attrs", select_attrs)
        console.log("checkbox_attrs", checkbox_attrs)

        this.setState({input_attrs: input_attrs})
        this.setState({select_attrs: select_attrs})
        this.setState({checkbox_attrs: checkbox_attrs})
        this.setState({compulsory_attrs: compulsories})
      }
      section.classList.remove(["disabled-section"], ["loading-section"])
    })
  }

  render() {
    const allow_null_class = "b-form-section h-mb-15"
    const no_null_class = allow_null_class + " b-form-section--required"
    
    return (
      <div className="js-body-wrapper b-body-wrapper">
 <div className="js-content h-bg-grey h-flex" data-use-spa="true" data-web-id="1572972604##53410168c7cbd8ec896909dc9c93feaa3f3b8af6" id="js-vue-scope">
  <div className="b-stickers-wrapper" id="js-stickers-wrapper">
  </div>
  <div className="b-js-load-app-replacement js-load-app-replacement" style={{display: "none"}}>
  </div>
  <div style={{marginBottom: "50px"}} className="b-app-header-wrapper">
        <nav className="navbar b-app-header navbar-fixed-top">
          <div className="container-fluid nav-container" style={{margin: "0px"}}>
            <div className="navbar-header">
              <a href="/" className="navbar-brand logo font-bask-normal text-left">
              <img src="/public/logo.png" width="45" alt="logo" className="d-inline-block align-middle mr-2"/>
                {SITE_NAME}
              </a>
            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
              
            </div>
          </div>
        </nav>
        <div className="form-group">
        </div>
  </div>
  
  <div className="h-bg-grey container h-pt-10 h-pb-15">
   <div>

    {
      this.state.user.email.email_not_confirmed?
      <div className="b-notification b-notification__red qa-confirm-email-notification">
      <div className="h-ph-25 h-pv-7 h-dflex h-flex-main-center h-flex-dir-column">
        <div className="b-notification-text">
          <div className="h-main-gray-force">
              <div className="h-font-18 h-darker-red h-bold h-mb-5">Your ad won't be posted unless you confirm your email address!</div>
              <div>
                Email: <b>{this.state.user.email}</b> If you did not receive the email with confirmation link you can request it again.
              </div> 
              <div>
                <form name="baseform" method="post" validate="true" action="/resend-confirmation-email.html">
                  <input id="csrf_token" name="csrf_token" type="hidden" value="1573919242##f3d9acaa6df8f64e4b320384d393ff92ba5888b5"/>
                    <button className="b-button b-button--black-light b-button--bg-transparent b-button--border-radius-5 b-button--size-small-2 h-mt-10">
                      Resend email
                    </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      :
      ""
    }

    <div className="h-text-center h-mb-20 h-mt-10">
     <h1 className="qa-h1-title h-mv-0">
      <b className="h-font-26">
       Post Ad
      </b>
     </h1>
    </div>
    <div className="h-flex-center h-mv-20 hide" id="spiner">
     <img height="50" src="/public/res/jiji/spin.svg" width="50"/>
    </div>
    <form id="ad-form" className="ad-form" noValidate onSubmit={this.handleSubmit}>
     {/*<input name="csrf_token" type="hidden" value="1572972604##53410168c7cbd8ec896909dc9c93feaa3f3b8af6"/>*/}
     <div className="block h-p-15 b-content-area b-content-area--shadow" data-v-2f9b1610="">
      <div className="h-hflex h-flex-cross-center h-mb-5" data-v-2f9b1610="">
       <h4 className="h-flex" data-v-2f9b1610="">
        <b data-v-2f9b1610="">
         Ad Details
        </b>
       </h4>
       <button onClick={this.clearAllFields} className="qa-clear-all-fields-button js-clear-fields b-button b-button--primary-light b-button--size-small" data-v-2f9b1610="" type="button">
        Clear all fields
       </button>
      </div>

      <div className="h-max-width-300 h-phone-max-width-100p" data-v-2f9b1610="">
      
       <div id="cat-section" data-v-2f9b1610="">
         <div className=" b-form-section h-mb-15 qa-choose-category b-form-section--required">
          <label className="b-form-section__title">
           Category
          </label>
          <div className="form-group">
            <select className="form-control" name="cat" value={this.state.cat} onChange={this.handleChange}>
              <option value="-1">--- Choose category ---</option>
              {this.state.cats.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <span id="cat-error" className="fw-field__error qa-fw-field__error hide">
              this field is required.
            </span>
          </div>
         </div>
        </div>

        <div id="sub_cat-section" data-v-2f9b1610="" className={parseInt(this.state.cat) == -1? "disabled-section":""}>
         <div className="b-form-section h-mb-15 qa-choose-category b-form-section--required">
          <label className="b-form-section__title">
           Sub Category
          </label>
          <div className="form-group">
            <select className="form-control" name="sub_cat" value={this.state.sub_cat} onChange={this.handleChange}>
              <option value="-1">--- Choose subcategory ---</option>
              {this.state.sub_cats.map(scat => (
                <option key={scat.id} value={scat.id}>{scat.name}</option>
              ))}
            </select>
            <span id="sub_cat-error" className="fw-field__error qa-fw-field__error hide">
              this field is required.
            </span>
          </div>
         </div>
        </div>

        <div id="custom-section" data-v-2f9b1610="" className={parseInt(this.state.cat) == -1 || parseInt(this.sub_cat) == -1? "disabled-section":""}>

          {this.state.input_attrs.map(attr => (
            <div key={"custom-"+attr.key} className={attr.allow_null? allow_null_class : no_null_class}>
              <label className="b-form-section__title">
                {attr.key}
              </label>
              <div className="form-group">
                <input data-attr={"input"+(!attr.allow_null?"_must":"")} type="text" className="form-control" name={attr.key} onChange={this.handleChange} />
                <span id={attr.key+"-error"} className="fw-field__error qa-fw-field__error hide">
                  this field is required.
                </span>
              </div>
            </div>
          ))}

          {this.state.select_attrs.map(attr => (
            <div key={"custom-"+attr.key} className={attr.allow_null? allow_null_class : no_null_class}>
              <label className="b-form-section__title">
                {attr.key}
              </label>
              <div className="form-group">
                <select data-attr={"select"+(!attr.allow_null?"_must":"")} className="form-control" name={attr.key} onChange={this.handleChange}>
                  <option>--- Select {attr.key} ---</option>
                  {attr.values.map(value => (
                    <option key={"custom-"+attr.key+value}>{value}</option>
                  ))}
                </select>
                <span id={attr.key+"-error"} className="fw-field__error qa-fw-field__error hide">
                  this field is required.
                </span>
              </div>
            </div>
          ))}

          {this.state.checkbox_attrs.map(attr => (
            <div key={"custom-"+attr.key} className={attr.allow_null? allow_null_class : no_null_class}>
              <label className="b-form-section__title">
                {attr.key}
              </label>
              <div classname="b-form-section__elem-wrapp">
                {attr.values.map(value => (
                  <div key={"custom-"+attr.key+value} className="b-form-section__row">
                    <div className="qa-checkbox b-form-section h-mb-0">
                      <input onChange={this.handleCheckboxChange} name={attr.key} value={value} id={"custom-"+attr.key+"-"+value} type="checkbox" className="b-form-section__checkbox"/> 
                      <label for={"custom-"+attr.key+"-"+value} className="qa-description-label">{value}</label>
                    </div>
                  </div>
                ))}
              </div>
              <span id={attr.key+"-error"} className="fw-field__error qa-fw-field__error hide">
                this field is required.
              </span>
            </div>
          ))}
          
        </div>

      </div>

      <div id="photo-section" className="block h-pl-0 b-content-area h-p-15" data-v-2f9b1610="" data-v-b364e386="">
       <h4 className="title" data-v-b364e386="">
        <b data-v-b364e386="">
         Photos
        </b>
       </h4>
       <p data-v-b364e386="">
        <b data-v-b364e386="">
         Ads with photo get 5x more clients.
        </b>
        Accepted formats are .jpg, .gif and .png. Max allowed size for uploaded files is 5 MB.
        <br data-v-b364e386=""/>
        Add at least 1 photo for this category.
       </p>

       <div data-v-61d25a85="" data-v-b364e386="">
        <div className="scrollWrap qa-photos start h-mb-10" data-v-61d25a85="">
         <div className="draggable" data-v-61d25a85="">
           
          {
            this.state.photos.map((photo, index) => (
              photo != null?
              <div className="item" data-v-61d25a85="" key={"photo-"+index}>
              <div className="qa-add-photo photo-block" data-v-61d25a85="" data-v-6ea5e880="" style={{height: "136px", width: "136px"}}>
                {
                  photo == ""?
                  <div data-v-6ea5e880="">
                    <svg data-v-6ea5e880="" width="50px" height="50px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="uil-spin">
                      <rect x="0" y="0" width="100" height="100" fill="none" className="bk"></rect> 
                      <g transform="translate(50 50)"><g transform="rotate(0) translate(34 0)">
                        <circle cx="0" cy="0" r="8" fill="#c1c1c1">
                          <animate attributeName="opacity" from="1" to="0.1" begin="0s" dur="1.2s" repeatCount="indefinite"></animate> 
                          <animateTransform attributeName="transform" type="scale" from="1.4" to="1" begin="0s" dur="1.2s" repeatCount="indefinite"></animateTransform>
                        </circle>
                      </g> 
                      <g transform="rotate(45) translate(34 0)">
                        <circle cx="0" cy="0" r="8" fill="#c1c1c1">
                          <animate attributeName="opacity" from="1" to="0.1" begin="0.15s" dur="1.2s" repeatCount="indefinite"></animate> 
                          <animateTransform attributeName="transform" type="scale" from="1.4" to="1" begin="0.15s" dur="1.2s" repeatCount="indefinite"></animateTransform>
                        </circle>
                      </g> 
                      <g transform="rotate(90) translate(34 0)">
                        <circle cx="0" cy="0" r="8" fill="#c1c1c1">
                          <animate attributeName="opacity" from="1" to="0.1" begin="0.3s" dur="1.2s" repeatCount="indefinite"></animate> 
                          <animateTransform attributeName="transform" type="scale" from="1.4" to="1" begin="0.3s" dur="1.2s" repeatCount="indefinite"></animateTransform>
                        </circle>
                      </g> 
                      <g transform="rotate(135) translate(34 0)">
                        <circle cx="0" cy="0" r="8" fill="#c1c1c1">
                          <animate attributeName="opacity" from="1" to="0.1" begin="0.44s" dur="1.2s" repeatCount="indefinite"></animate> 
                          <animateTransform attributeName="transform" type="scale" from="1.4" to="1" begin="0.44s" dur="1.2s" repeatCount="indefinite"></animateTransform></circle></g> 
                          <g transform="rotate(180) translate(34 0)">
                            <circle cx="0" cy="0" r="8" fill="#c1c1c1">
                              <animate attributeName="opacity" from="1" to="0.1" begin="0.6s" dur="1.2s" repeatCount="indefinite"></animate> 
                              <animateTransform attributeName="transform" type="scale" from="1.4" to="1" begin="0.6s" dur="1.2s" repeatCount="indefinite"></animateTransform>
                            </circle>
                          </g> 
                          <g transform="rotate(225) translate(34 0)">
                            <circle cx="0" cy="0" r="8" fill="#c1c1c1">
                              <animate attributeName="opacity" from="1" to="0.1" begin="0.75s" dur="1.2s" repeatCount="indefinite"></animate> 
                              <animateTransform attributeName="transform" type="scale" from="1.4" to="1" begin="0.75s" dur="1.2s" repeatCount="indefinite"></animateTransform>
                            </circle>
                          </g> 
                          <g transform="rotate(270) translate(34 0)">
                            <circle cx="0" cy="0" r="8" fill="#c1c1c1">
                              <animate attributeName="opacity" from="1" to="0.1" begin="0.89s" dur="1.2s" repeatCount="indefinite"></animate> 
                              <animateTransform attributeName="transform" type="scale" from="1.4" to="1" begin="0.89s" dur="1.2s" repeatCount="indefinite"></animateTransform>
                            </circle>
                          </g> 
                          <g transform="rotate(315) translate(34 0)">
                            <circle cx="0" cy="0" r="8" fill="#c1c1c1">
                              <animate attributeName="opacity" from="1" to="0.1" begin="1.05s" dur="1.2s" repeatCount="indefinite"></animate> 
                              <animateTransform attributeName="transform" type="scale" from="1.4" to="1" begin="1.05s" dur="1.2s" repeatCount="indefinite"></animateTransform>
                            </circle>
                          </g>
                        </g>
                      </svg>
                    </div>
                    :
                    <div data-v-6ea5e880="" className="preview">
                    <div data-v-6ea5e880="" className="preview__img" style={{backgroundImage: "url("+ URL.createObjectURL(photo)+")", transform: "rotate(0deg)"}}></div> 
                    <div data-v-6ea5e880="" className="preview__bar">
                      <div data-v-6ea5e880="" className="preview__bar-button" style={{display: "none"}}>
                        <i data-v-6ea5e880="" className="glyphicon glyphicon-repeat icon icon-rotate">
                          <div data-v-6ea5e880="" className="preview__bar-button-content"></div>
                        </i>
                      </div> 
                      <div photo-index={index} onClick={this.removePhoto} data-v-6ea5e880="" className="preview__bar-button">
                        <i photo-index={index} data-v-6ea5e880="" className="glyphicon glyphicon-remove icon icon-remove">
                          <div photo-index={index} data-v-6ea5e880="" className="preview__bar-button-content"></div>
                        </i>
                      </div>
                    </div>
                  </div>
                }
              </div>
             </div>
             :
             <div className="item" data-v-61d25a85="" key={"photo-"+index}>
             <div className="qa-add-photo photo-block" data-v-61d25a85="" data-v-6ea5e880="" style={{height: "136px", width: "136px"}}>
              <div data-v-6ea5e880="">
               <div data-v-6ea5e880="">
                <img data-v-6ea5e880="" src="/public/res/images/static/no-photo.svg" width="95.19999999999999px"/>
                <label className="input-label" data-v-6ea5e880="" for={"fileUpload-"+index}>
                </label>
                <input photo-index={index} onChange={this.onPhotoChangedHandler} accept="image/*" className="input" data-v-6ea5e880="" id={"fileUpload-"+index} multiple={true} name={"photo-"+index} style={{height: "136px", width: "136px"}} type="file"/>
               </div>
              </div>
             </div>
            </div>
            ))
          }
         </div>
        </div>
        <input data-v-61d25a85="" name="img_rotate_data" type="hidden" value="{}"/>
       </div>
       {
         this.state.loaded > 0?
         <div className="form-group">
           <div className="progress">
             <div className="progress-bar progress-bar-success progress-bar-striped" style={{width: "100%"}} role="progressbar" aria-valuenow={this.state.loaded} aria-valuemin="0" aria-valuemax="100">
              {Math.round(this.state.loaded,2) }%
            </div>
          </div>
        </div>
        :
        ""
       }
       <span id="photo-error" className="fw-field__error qa-fw-field__error hide">
        this field is required.
       </span>
       <div className="h-grey" data-v-b364e386="">
        <b data-v-b364e386="">
         First picture - is the title picture.
        </b>
       </div>
      </div>

      <div className="h-max-width-600 h-phone-max-width-100p" data-v-2f9b1610="">
       <div className="qa-attributes" data-v-2f9b1610="">
        <div className="qa-input b-form-section qa-title h-phone-max-width-100p b-form-section--required">
         <label className="b-form-section__title" for="input-54">
          Title
         </label>
         <div className="b-form-section__elem-wrapp">
          <input data-limit="70" onChange={this.handleChange} id="input-54" name="title" placeholder="Please write a clear title for your item" value={this.state.title} type="text"/>
         </div>
         <span id="title-error" className="fw-field__error qa-fw-field__error hide">
          this field is required.
         </span>
         <div className="b-input-style-maxlength h-mv-3">
          {70 - this.state.title.length} characters left
         </div>
         <div className="b-form-section__error-descr">
         </div>
        </div>

        <div className="h-max-width-300 h-phone-max-width-100p b-form-section--required">
          <label className="b-form-section__title">
            Price
          </label>
          <div className="input-group">
            <span className="input-group-addon">
              <select name="price_currency_symbol" onChange={this.handleChange}>
                {this.state.currency_symbols.map(symbol => (
                  <option selected={symbol == "&#36;"?true:false} key={symbol} value={symbol} dangerouslySetInnerHTML={{__html: symbol}}></option>
                ))}
              </select>
            </span>
            <input data-type="number" name="price" value={this.state.price} type="text" className="form-control" onChange={this.handleChange}/>
          </div>
          <span id="price-error" className="fw-field__error qa-fw-field__error hide">
            this field is required.
          </span>
        </div>
        
        <div className="qa-textarea b-form-section qa-description b-form-section--required" data-v-cca4341a="">
         <label className="b-form-section__title" data-v-cca4341a="" for="textarea-58">
          Description
         </label>
         <div className="b-form-section__elem-wrapp" data-v-cca4341a="">
          <textarea data-limit="1000" onChange={this.handleChange} data-v-cca4341a="" id="textarea-58" name="desc" value={this.state.desc} placeholder="Please provide a detailed description. You can mention as many details as possible. It will make your ad more attractive for buyers" rows="5"></textarea>
         </div>
         <span id="desc-error" className="fw-field__error qa-fw-field__error hide">
            this field is required.
         </span>
         <div className="b-text-area-max-length" data-v-cca4341a="">
         {1000 - this.state.desc.length} characters left
         </div>
         <div className="b-form-section__error-descr" data-v-cca4341a="">
         </div>
        </div>
       </div>
      </div>
     </div>
     <div className="block b-content-area b-content-area--shadow h-p-15" data-v-50679713="">
      <h4 className="title" data-v-50679713="">
       <b data-v-50679713="">
        Contact Information for Ad
       </b>
      </h4>
      <div className="h-mb-10" data-v-50679713="">
       <p data-v-50679713="">
        Name:&nbsp;
        <b className="user-data" data-v-50679713="">
         {this.state.fullname}
        </b>
       </p>
       <p data-v-50679713="">
        Phone:&nbsp;
        <b className="user-data" data-v-50679713="">
         {this.state.number}
        </b>
       </p>
      </div>
      
      <div id="location-section" className="h-max-width-300 h-phone-max-width-100p" data-v-2f9b1610="">
      
       <div id="country-section" data-v-2f9b1610="">
         <div className=" b-form-section h-mb-15 qa-choose-category b-form-section--required">
          <label className="b-form-section__title">
           Country
          </label>
          <div className="form-group">
            <select className="form-control" name="country" value={this.state.country} onChange={this.handleChange}>
              <option value="-1">--- Select country ---</option>
              {this.state.countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
            <span id="country-error" className="fw-field__error qa-fw-field__error hide">
              this field is required.
            </span>
          </div>
         </div>
        </div>

        <div id="state-section" data-v-2f9b1610="" className={parseInt(this.state.country) == -1? "disabled-section":""}>
         <div className=" b-form-section h-mb-15 qa-choose-category b-form-section--required">
          <label className="b-form-section__title">
           State
          </label>
          <div className="form-group">
            <select className="form-control" name="state" value={this.state.state} onChange={this.handleChange}>
              <option value="-1">--- Select state ---</option>
              {this.state.states.map(state => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
            <span id="state-error" className="fw-field__error qa-fw-field__error hide">
              this field is required.
            </span>
          </div>
         </div>
        </div>

        <div id="city-section" data-v-2f9b1610="" className={parseInt(this.state.country) == -1 || parseInt(this.state.state) == -1? "disabled-section":""}>
         <div className=" b-form-section h-mb-15 qa-choose-category b-form-section--required">
          <label className="b-form-section__title">
           City
          </label>
          <div className="form-group">
            <select className="form-control" name="city" value={this.state.city} onChange={this.handleChange}>
              <option value="-1">--- Select city ---</option>
              {this.state.cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            <span id="city-error" className="fw-field__error qa-fw-field__error hide">
              this field is required.
            </span>
          </div>
         </div>
        </div>

      </div>
      

     </div>
     <div className="h-text-center h-mb-50">
      <button className="qa-submit-button b-button b-button--secondary b-button--border-radius b-button--shadow" data-package-category="" data-package-id="" data-package-name="" id="submitButton" type="submit">
       <b>
        Post Ad
       </b>
      </button>
      <p className="h-pt-10">
       By publishing an ad you agree and accept&nbsp;
       <a href="/rules.html" target="_blank">
        the Rules of {SITE_DOT_COM}
       </a>
      </p>
      <div className="h-pt-10">
       <a href="/create-ad-tips">
        <svg className="info" style={{width: "15px", height: "15px", maxWidth: "15px", maxHeight: "15px", fill: "rgb(114, 183, 71)", stroke: "inherit", marginBottom: "-3px"}}>
         <use xlinkHref="#info">
         </use>
        </svg>
        How to create an effective ad
       </a>
       
      </div>
     </div>
    </form>
    
   </div>
  </div>
 </div>
 
 <div className="js-footer">
 </div>
</div>
    )
  }
}

export default Sell