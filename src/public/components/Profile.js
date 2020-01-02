import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { NO_PROFILE_PHOTO_IMAGE, API_ROOT, ERROR_NET_UNKNOWN, STATIC_IMAGES_CLIENT_DIR, SITE_NAME } from '../utils/Constants'
import { commaNum, modalAlert } from '../utils/Funcs'
const browser = require("../utils/Browser")
import queryString from 'querystring'
import { productLink } from '../utils/LinkBuilder'
var dateFormat = require('dateformat');

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: props.user,

      products_type: null,
      products: [],
      products_has_next: false,

      active_total: 0,
      active_products: [],
      active_products_page: 0,
      active_has_next: false,

      draft_total: 0,
      draft_products: [],
      draft_products_page: 0,
      draft_has_next: false,
      
      sponsored_total: 0,
      sponsored_products: [],
      sponsored_products_page: 0,
      sponsored_has_next: false,

      loading: false,
      uploading_profile_photo: false,
      profile_photo_error: null
    }
    this.setState({user: props.user})

    this.uploadPhoto = this.uploadPhoto.bind(this)
    //this.loadProducts = this.loadProducts.bind(this)
    this.updateProductsData = this.updateProductsData.bind(this)
  }

  componentDidMount() {
    console.log("mounted")
    document.title = "Profile"
    console.log("PROPS", this.props)
    this.setState({user: this.props.user})

    const queryValues = queryString.parse(this.props.location.search.substring(1))
    const p_type = queryValues.products_type?queryValues.products_type : "active"
    this.state.products_type = p_type
    this.setState({products_type: p_type})
    console.log("queryValues.products_type", queryValues.products_type, this.state.products_type)
    //get active counts
    browser.axios.get(API_ROOT + "products/?user_id="+this.state.user.id+"&is_draft=0&count_only=1")
    .then(resp => {
      if(resp.data.counts) {
        this.setState({active_total: resp.data.counts})
      }
    })
    //get draft counts
    browser.axios.get(API_ROOT + "products/?user_id="+this.state.user.id+"&is_draft=1&count_only=1")
    .then(resp => {
      if(resp.data.counts) {
        this.setState({draft_total: resp.data.counts})
      }
    })
    //get sponsored counts
    browser.axios.get(API_ROOT + "top-ads/?user_id="+this.state.user.id+"&is_draft=1&count_only=1")
    .then(resp => {
      if(resp.data.counts) {
        this.setState({sponsored_total: resp.data.counts})
      }
    })
    this.loadProducts()
  }



  updateProductsData(type) {
    console.log("updateProductsData", "type", type)
    if(type == "sponsored") {
      console.log("updateProductsData", "spons")
      this.state.products = this.state.sponsored_products
      this.state.products_has_next = this.state.sponsored_has_next
      this.setState({products: this.state.sponsored_products})
      this.setState({products_has_next: this.state.sponsored_has_next})

    } else if(type == "active") {
      console.log("updateProductsData", "act")
      this.state.products = this.state.active_products
      this.state.products_has_next = this.state.active_has_next
      this.setState({products: this.state.active_products})
      this.setState({products_has_next: this.state.active_has_next})

    } else if(type == "draft") {
      console.log("updateProductsData", "draf")
      this.state.products = this.state.draft_products
      this.state.products_has_next = this.state.draft_has_next
      this.setState({products: this.state.draft_products})
      this.setState({products_has_next: this.state.draft_has_next})

    }
  }

  changeProductsType = (e) => {
    const type = e.target.getAttribute("data-type")
    this.state.products_type = type
    this.setState({products_type: type})
    console.log("PRO_TYPE", type)
    console.log("PRO_TYPE 2", this.state.products_type)
    this.updateProductsData(type)
    console.log("Products: ", this.state.products)
    if(this.state.products.length == 0) {
      console.log("Load from change")
      this.loadProducts()

    } else {
      console.log("Don't Load from change")
    }

  }

  preDelete = (e) => {
    e.preventDefault()
    var dataId = e.target.getAttribute("data-id");
    modalAlert("Are you sue you want to delete this", function() {
      modalAlert("Alright then")
    })
  }

  loadProducts = () => {
    var apiSubPath = "products/?"
    var hasNextKey
    var productPageKey
    var productsKey
    var productTotalKey
    var page
    console.log("State", JSON.stringify(this.state))
    if(this.state.products_type == "sponsored") {
      page = this.state.sponsored_products_page + 1
      apiSubPath = "top-ads/?user_id="+this.state.user.id+"&page="+page
      hasNextKey = "sponsored_has_next"
      productPageKey = "sponsored_products_page"
      productsKey = "sponsored_products"
      productTotalKey = "sponsored_total"

    } else if(this.state.products_type == "active") {
      page = this.state.active_products_page + 1
      apiSubPath += "user_id="+this.state.user.id+"&is_draft=0&page="+page
      hasNextKey = "active_has_next"
      productPageKey = "active_products_page"
      productsKey = "active_products"
      productTotalKey = "active_total"

    } else if(this.state.products_type == "draft") {
      page = this.state.draft_products_page + 1
      apiSubPath += "user_id="+this.state.user.id+"&is_draft=1&page="+page
      hasNextKey = "draft_has_next"
      productPageKey = "draft_products_page"
      productsKey = "draft_products"
      productTotalKey = "draft_total"

    } else {
      console.log("NOT DEFINED !!!", this.state.products_type)
    }

    console.log("API_ROOT + apiSubPath", API_ROOT + apiSubPath)
    this.setState({loading: true})
    browser.axios.get(API_ROOT + apiSubPath)
    .then(response => {
      console.log("responz a")
      if(response && response.data.list) {
        const products = this.state[[productsKey]].concat(response.data.list)
        this.setState({[[productsKey]]: products})
        this.setState({[[hasNextKey]]: response.data.has_next})
        this.setState({[[productTotalKey]]: response.data.counts})
        this.setState({[[productPageKey]]: page})

        this.updateProductsData(this.state.products_type)

        console.log("responz 1", response.data.list, this.state.active_products)
        console.log("responz 2", products)
        console.log("responz 3", this.state.products)

      }
      this.setState({loading: false})

    })
    .catch(e => {
      console.log("responz err", e)
      this.setState({loading: false})
    })
  }

  uploadPhoto = e => {
    const photo = e.target.files[0]
    console.log("upload: ", photo)
    const formData = new FormData()
    formData.append('photo', photo)

    this.setState({uploading_profile_photo: true})
    this.setState({profile_photo_error: null})
    browser.axios.post(API_ROOT + "users/upload/profile-photo", formData)
    .then(response => {
      if(response && response.data && response.data.status == 1) {
        const user = this.state.user
        user.profile_photo = URL.createObjectURL(photo)
        this.setState({user: user})

      } else if(response && response.data && response.data.message && response && response.data.message.length > 0) {
        if(response.data.status == 3) {
          this.setState({profile_photo_error: "Your profile photo size is too high"})

        } else {
          this.setState({profile_photo_error: response.data.message})
        }

      } else {
        this.setState({profile_photo_error: "An error occurred while trying to upload your profile photo"})
      }
      this.setState({uploading_profile_photo: false})
      $('#add_profile_photo').modal('toggle');
    })
    .catch(err => {
      this.setState({profile_photo_error: ERROR_NET_UNKNOWN})
      this.setState({uploading_profile_photo: false})
      $('#add_profile_photo').modal('toggle');
    })
  }

  render() {
    return (
<div className="h-bg-grey container h-pt-10 h-pb-15">
  {
    !this.state.user?
    <div>
        <div className="b-bouncing-loader-wrapper" data-v-67bc6bc4="" style={{display: "block"}}>
            <div className="b-bouncing-loader spinner-absolute h-pt-20" style={{bottom: "0px"}}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
      <div className="before-data-load"></div>
    </div>
    :
    <div>
    <div className="h-dflex h-mt-20 row">
     <div className="col-sm-12 col-md-3">
      <div action="" className="b-user-settings__avatarblock">
       <div className="js-avatar b-user-settings__avatarblock__avatar" style={{backgroundImage: this.state.user.profile_photo.length > 0?'url('+this.state.user.profile_photo+')':'url('+NO_PROFILE_PHOTO_IMAGE+')'}}>
        <button className="b-user-settings__avatarblock__upload-foto" data-target="#add_profile_photo" data-toggle="modal" type="button">
         <i className="h-icon icon-profile-settings-upload">
         </i>
        </button>
       </div>
       <div className="b-user-settings__avatarblock__name">
        <a href={"/seller/"+this.state.user.id}>
         {this.state.user.firstname + " "+this.state.user.lastname}
        </a>
       </div>
       <div className={this.state.profile_photo_error?"fw-field__error qa-fw-field__error":"fw-field__error qa-fw-field__error"} id="img_status">
        {this.state.profile_photo_error}
       </div>
       <div className="h-mt-15 h-width-100p h-ph-5">
        <Link to="/settings" className="general-button general-button--full general-button--border-radius general-button--with-shadow general-button--orange-color" href="/request-call.html">
         Settings
        </Link>
       </div>
      </div>
      <div aria-labelledby="ModalLabel" style={{display: "none"}} aria-hidden="true" className="modal out" id="add_profile_photo" role="dialog" tabIndex="-1">
       <div className="modal-dialog" role="document">
        <div className="modal-content">
         <div className="modal-header h-text-center h-font-16" style={{background: "rgb(242, 244, 248) none repeat scroll 0% 0%"}}>
          <button aria-hidden="true" className="close" data-dismiss="modal" type="button">
           ×
          </button>
          <h5 className="h-bold">
           Add a profile photo
          </h5>
         </div>
         <div className="modal-body">
          <div className="b-popup-form js-input-image-block" name="advert_image">
           <div className="js-upload b-user-settings__avatarblock__avatar " style={{backgroundImage: this.state.user.profile_photo.length > 0?'url('+this.state.user.profile_photo+')':'url('+NO_PROFILE_PHOTO_IMAGE+')'}}>
           </div>
           <div className="js-upload-preview h-hidden b-user-settings__avatarblock__avatar" style={{zIndex: "2"}}>
           </div>
           <div className="b-user-settings__avatarblock__text-1">
            Upload your profile photo.
           </div>
           <div className="b-user-settings__avatarblock__text-2">
            Must be a .jpg, .gif or .png file smaller than 5MB
           </div>
           <div className=" b-user-settings__avatarblock__text b-user-settings__avatarblock__text_red h-hidden h-mt-15">
           </div>
           <div className="h-width-100p h-height-100 h-text-center">
            <img className={this.state.uploading_profile_photo?"js-upload-progress h-mt-20":"js-upload-progress h-mt-20 hide"} src="/public/res/images/static/preload2.gif"/>
            <a className="js-upload-link">
             <div className="b-user-settings__avatarblock__btnblock">
              <div className="b-user-settings__avatarblock__btn btn btn-lg">
               <div className="btn btn-lg btn-success btn-block" id="file-name-btn">
                Choose a File
               </div>
               <input onChange={this.uploadPhoto} accept="image/*" className="js-input-image" name="photo" type="file"/>
              </div>
             </div>
            </a>
           </div>
          </div>
         </div>
        </div>
       </div>
      </div>
      <Link to="/create-ad-tips" className="b-notification b-notification__green qa-premium-create-ad-tips">
       <div className="b-notification-icon">
        <i className="h-icon icon-profile-lightbulb">
        </i>
       </div>
       <div className="h-pr-10 h-dflex h-flex-main-center h-flex-dir-column">
        <div className="b-notification-text">
         <div>
          Check out tips to create an effective ad
         </div>
        </div>
       </div>
      </Link>
     </div>
     <div className="col-sm-12 col-md-9">
      <div className="h-mb-10 h-mt-0 h-lh-em-1_8 b-link-tabs h-dflex h-flex-space-between">
       <ul>
        <li className="h-mr-15">
         <a onClick={this.changeProductsType} data-type="active" className={this.state.products_type == "active"?"active b-link-tabs__a qa-list-advert-tab":"b-link-tabs__a qa-list-advert-tab"} href="javascript:void(0)">
          Active
         </a>
         {
           this.state.active_total > 0?
           <span className="b-link-tabs__notification qa-list-advert-notification">
            {commaNum(this.state.active_total)}
           </span>
           :
           ""
          }
        </li>
        <li className="h-mr-15">
         <a onClick={this.changeProductsType} data-type="sponsored" className={this.state.products_type == "sponsored"?"active b-link-tabs__a qa-list-advert-tab":"b-link-tabs__a qa-list-advert-tab"} href="javascript:void(0)">
          Boosted
         </a>
         {
           this.state.sponsored_products > 0?
           <span className="b-link-tabs__notification qa-list-advert-notification">
            {commaNum(this.state.sponsored_total)}
           </span>
           :
           ""
          }
        </li>
        <li className="h-mr-15">
         <a onClick={this.changeProductsType} data-type="draft" className={this.state.products_type == "draft"?"active b-link-tabs__a qa-list-advert-tab":"b-link-tabs__a qa-list-advert-tab"} href="javascript:void(0)">
          Drafted
         </a>
         {
           this.state.draft_total > 0?
           <span className="b-link-tabs__notification qa-list-advert-notification">
            {commaNum(this.state.draft_total)}
           </span>
           :
           ""
          }
        </li>
       </ul>
       <div className="h-float-right h-font-16">
        Total: {this.state.active_total + this.state.draft_total} ads
       </div>
      </div>
      {
        this.state.products.map((product, index) => (
          <div key={index} className="b-profile-advert box-shadow h-mb-10 h-pos-rel">
          <a className="b-profile-advert__img" href={productLink(product.title, product.id)}>
           <img alt={product.title} src={product.photos.split(",")[0]}/>
          </a>
          <div className="b-profile-advert__body">
           <div className="b-profile-advert__title">
            <a href={productLink(product.title, product.id)}>
             {product.title}
            </a>
           </div>
           <div className="b-profile-advert__text">
            Updated: {dateFormat(new Date(product.last_update), "mmm dd")}
           </div>
           <div className="h-mt-5">
            <span className="b-profile-advert__price" dangerouslySetInnerHTML={{__html: product.currency_symbol+" "+commaNum(product.price)}}></span>
           </div>
           <div className="h-dflex h-flex-cross-center">
           </div>
           <div className="b-profile-advert__footer" style={{paddingLeft: "175px"}}>
            <div className="b-profile-advert__footer-info-panel">
             <a className="b-profile-advert__go-to-edit" href={"/edit-ad?id="+product.id}>
              Edit
             </a>
             <a onClick={this.preDelete} href="javascript:void(0)" data-id={product.id} className="qa-fw-field__error b-profile-advert__go-to-publish qa-btn-owner-publish-draft">
              Delete
             </a>
             <div className="h-inline-block">
              <p className="b-profile-advert__footer-block">
               <i className="h-icon icon-profile-eye-new">
               </i>
               {product.views} views
              </p>
             </div>
             <div className="h-inline-block">
              <p className="hide b-profile-advert__footer-block">
               <i className="h-icon icon-profile-phone-new">
               </i>
               {product.contact_views} contact views
              </p>
             </div>
             <a className="b-profile-advert__go-to-statistic hide" href="/statistics.html">
              <i className="h-icon icon-profile-statistic">
              </i>
             </a>
            </div>
           </div>
          </div>
          <div className="clearfix">
          </div>
         </div>
        ))
      }
      {
        this.state.products.length == 0 && !this.state.loading?
        <div className="h-mb-10">
        <div className="b-empty-cart box-shadow">
         <div className="h-centerItem">
          <div className="b-empty-cart__info">
           <img alt="" className="h-mb-10 h-rl-15" src={STATIC_IMAGES_CLIENT_DIR+"no_ads.png"}/>
           {
             this.state.products_type == "active"?
              <p>You don't have active ads.<br />Post ads for free and get clients.</p>
              :
              this.state.products_type == "sponsored"?
              <p>You don't have any ad Boosted yet.<br />Boosted ads get more views, engagements and more sales.</p>
              :
              this.state.products_type == "draft"?
              <p>You don't have drafted ads.<br />Note that drafted ads won't show on {SITE_NAME}.</p>
              :
              ""
          }
          </div>
         </div>
        </div>
       </div>
       :
       ""
       
      }
      {
        this.state.loading?
        <div className="b-bouncing-loader-wrapper" data-v-67bc6bc4="" style={{display: "block"}}>
           <div className="b-bouncing-loader spinner-absolute h-pt-20" style={{bottom: "0px"}}>
               <div></div>
               <div></div>
               <div></div>
           </div>
       </div>
       :
       this.state.products_has_next?
       <a onClick={this.loadProducts} rel="nofollow" className="h-a-without-underline" style={{width: "200px", display: "block", margin: "15px auto"}}>
           <span className="qa-start-chat b-button b-button--transparent b-button--biggest-size">
               Show more
           </span>
       </a>
       :
       ""
      }
     </div>
    </div>
   </div>
  }
</div>
    )
  }
}

export default Profile