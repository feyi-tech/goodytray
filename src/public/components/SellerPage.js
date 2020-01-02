import React, { Component } from "react"
import { Link } from "react-router-dom"
import { API_ROOT, SERVER_ADDR, ERROR_NET_UNKNOWN, NO_PROFILE_PHOTO_IMAGE, MAX_ONLINE_INDICATOR_IN_MINS, FACEBOOK_PAGE_LINK, FACEBOOK_PAGE_NAME } from "../utils/Constants"
import { getIdFromPath, commaNum } from "../utils/Funcs";
const browser = require("../utils/Browser")
var dateFormat = require('dateformat');

import TimeAgo from 'javascript-time-ago'

// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'
import { productLink } from "../utils/LinkBuilder";

// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en)
 
// Create relative date/time formatter.
const timeAgo = new TimeAgo('en-US');

class SellerPage extends Component {
    constructor() {
        super()
        this.state = {
            seller: null,
            products: [],
            total_products: 0,
            products_has_next: false,
            products_has_prev: false,
            products_page: 0,
            loading_products: false
        }
    }

    componentDidMount() {
        const id = getIdFromPath(this.props.location.pathname)
        this.setState({id: id})
        if(isNaN(id)) {
            this.props.history.push("/errors/404")
            //console.log("404", "id", id)

        } else {
            browser.axios.get(API_ROOT + "users/?id="+id)
            .then(response => {
                if(response && response.data && response.data.user) {
                    this.setState({seller: response.data.user})

                    //get the products
                    this.loadProducts()

                } else {
                    this.props.history.push("/errors/404")
                    //console.log("404", "response", JSON.stringify(response))
                }
            })
            .catch(err => {
                this.props.history.push("/errors/333")
                //console.log("333", "response", JSON.stringify(err))
            })
        }
    }

    loadProducts = () => {
        var page = this.state.products_page + 1
        console.log("LoadProduct", page)
        this.setState({loading_products: true})
        browser.axios(API_ROOT + "products/?user_id="+this.state.id+"&page="+page)
        .then(response => {
            if(response && response.data && response.data.list) {
                var list = this.state.products.concat(response.data.list)
                this.setState({products: list})
                this.setState({products_has_next: response.data.has_next})
                this.setState({products_has_prev: response.data.has_prev})
                this.setState({total_products: response.data.counts})
                if(response.data.list.length > 0) {
                    this.setState({products_page: page})
                }
            }
            this.setState({loading_products: false})
        })
        .catch(e => {
            this.setState({loading_products: false})
        })
    }

    render() {
        return (
            
<div className="h-bg-grey container h-pt-10 h-pb-15">
 <div>
  <div className="b-notifications b-notification__reds qa-confirm-email-notifications">
   <div className="h-ph-25 h-pv-7 h-dflex h-flex-main-center h-flex-dir-column">
    <div className="b-notification-text">
     
    </div>
   </div>
  </div>
  <div className="b-bouncing-loader-wrapper" data-v-67bc6bc4="" style={this.state.seller?{display: "none"}:{display: "block"}}>
    <div className="b-bouncing-loader spinner-absolute h-pt-20" style={{bottom: "0px"}}>
        <div></div>
        <div></div>
        <div></div>
    </div>
  </div>
  {
    this.state.seller?
    <div className="h-hflex h-flex-wrap h-mv-15">
    <div className="h-pr-15 h-pl-0 seller-info__wrapper">
     <div className="h-mm1200-flex-1">
      <div className="h-mm1200-vflex">
       <div className="b-seller-info box-shadow h-mb-10">
        <div className="b-seller-info-header__wrapper">
         <div className="b-seller-info-header__avatar--wrapper">
          <div className="b-seller-info-header">
           <div className="b-seller-info-header__avatar box-shadow js-avatar" style={this.state.seller.profile_photo.length > 0?{backgroundImage: 'url('+this.state.seller.profile_photo+')'}:{backgroundImage: 'url('+NO_PROFILE_PHOTO_IMAGE+')'}}>
           </div>
          </div>
          <div className="b-seller-info__name">
           <h1>
            {this.state.seller.firstname + " " + this.state.seller.lastname}
           </h1>
          </div>
         </div>
        </div>
        <div className="b-seller-info-rl">
         <div className="b-seller-info-rl--inner">
          <p className="b-seller-info-rl__date">
            {dateFormat(new Date(this.state.seller.created), "d mmm yyyy")}
          </p>
          <p>
           Registered
          </p>
         </div>
         <div className="b-seller-info-rl--inner">
          <p className="b-seller-info-rl__date">
          {
                new Date() - new Date(this.state.seller.last_seen) <= (MAX_ONLINE_INDICATOR_IN_MINS * 60 * 1000)?
                "online"
                :
                !timeAgo.format(new Date(this.state.seller.last_seen), 'time').toLowerCase().includes("just") 
                    && 
                !timeAgo.format(new Date(this.state.seller.last_seen), 'time').toLowerCase().includes("ago")?
                timeAgo.format(new Date(this.state.seller.last_seen), 'time')
                :
                timeAgo.format(new Date(this.state.seller.last_seen), 'time')
            }
          </p>
          <p>
           Last seen
          </p>
         </div>
        </div>
        <div className="h-mm1200-vflex h-flex-main-center">
         <div className="h-mh-15 h-mv-10" style={{lineHeight: "10px"}}>
          <a href={"tel: "+this.state.seller.number} className="js-seller-page-phone-button general-button general-button--full general-button--border-radius general-button--with-shadow general-button" data-bazid="26" data-bazooka="show-seller-contact" data-category-slug="seller" data-number="08157717027" data-seller_id="2836045">
           <span className="general-button__text" style={{display: "inline"}}>
            {this.state.seller.number}
           </span>
          </a>
         </div>
         <div>
          <ul className="b-seller-info__soc h-ph-15">
            <li>
                <a className="b-share-button h-dflex mail qa-social-mail" data-v-6ffe10ec="" href={"mailto:?utm_source=mail_share&subject="+this.state.seller.firstname+" "+this.state.seller.lastname+" Page&body="+encodeURI(SERVER_ADDR+"/seller/"+this.state.seller.id)} rel="nofollow" target="_blank">
                    <svg className="mail" data-v-6ffe10ec="" style={{width: "13px", height: "13px", maxWidth: "13px", maxHeight: "13px", fill: "rgb(255, 255, 255)", stroke: "inherit"}}>
                        <use xlinkHref="#mail"></use>
                    </svg>
                </a>
            </li>
            <li>
                <a className="b-share-button h-dflex twitter qa-social-twitter" data-v-6ffe10ec="" href={"https://twitter.com/share?utm_source=twitter_share&text="+this.state.seller.firstname+" "+this.state.seller.lastname+" Page&url="+encodeURI(SERVER_ADDR+"/seller/"+this.state.seller.id)} rel="nofollow" target="_blank">
                    <svg className="twitter" data-v-6ffe10ec="" style={{width: "13px", height: "13px", maxWidth: "13px", maxHeight: "13px", fill: "rgb(255, 255, 255)", stroke: "inherit"}}>
                        <use xlinkHref="#twitter"></use>
                    </svg>
                </a>
            </li>
            <li>
                <a className="b-share-button h-dflex facebook qa-social-facebook" data-v-6ffe10ec="" href={"https://www.facebook.com/sharer/sharer.php?utm_source=fb_share&u="+encodeURI(SERVER_ADDR+"/seller/"+this.state.seller.id)} rel="nofollow" target="_blank">
                    <svg className="facebook" data-v-6ffe10ec="" style={{width: "13px", height: "13px", maxWidth: "13px", maxHeight: "13px", fill: "rgb(255, 255, 255)", stroke: "inherit"}}>
                        <use xlinkHref="#facebook"></use>
                    </svg>
                </a>
            </li>
            <li>
                <a className="b-share-button h-dflex whatsapp qa-social-whatsapp" data-v-6ffe10ec="" href={"https://web.whatsapp.com/send?utm_source=w_share&text="+encodeURI(SERVER_ADDR+"/seller/"+this.state.seller.id)} rel="nofollow" target="_blank">
                    <svg className="whatsapp" data-v-6ffe10ec="" style={{width: "13px", height: "13px", maxWidth: "13px", maxHeight: "13px", fill: "rgb(255, 255, 255)", stroke: "inherit"}}>
                        <use xlinkHref="#whatsapp"></use>
                    </svg>
                </a>
            </li>
          </ul>
         </div>
        </div>
       </div>
      </div>
     </div>
     <div className="facebook-adv-wrapper">
      <div className="fb-page" data-adapt-container-width="true" data-height="220" data-hide-cover="false" data-href="https://www.facebook.com/Jiji.Nigeria" data-show-facepile="true" data-small-header="false" data-width="270">
       <blockquote cite={FACEBOOK_PAGE_LINK} className="fb-xfbml-parse-ignore">
        <a href={FACEBOOK_PAGE_LINK}>
         {FACEBOOK_PAGE_NAME}
        </a>
       </blockquote>
      </div>
     </div>
     <div className="sticky-wrapper h-flex h-pos-rel h-inline-block h-text-right h-width-100p h-mm992-none-force" data-align="right" data-bazid="1" data-bazooka="sticky-elem" data-sticky="js-sticky-elem" data-top-offset="15px">
      <div className="h-iblock js-sticky-elem h-mh-auto qa-show-adsense h-overflow-hidden" id="div-gpt-ad-1487669506388-0" style={{width: "160px", height: "600px", top: "0px", right: "0px", position: "static", left: "199.5px"}}>
      </div>
     </div>
    </div>
    <div className="h-flex-2-1-400 h-ph-0 h-mt-0">
     
     {
         this.state.products.length == 0?
         ""
         :
         <div className="clearfix">
             {
                 this.state.products.map((product, index) => (
                    <div key={index} className="col-md-4 col-xs-12 col-sm-6 h-pt-0 h-ph-5 h-mb-10">
                    <div className="b-product-plate h-mb-0 js-handle-click-ctr" data-advert_id="16652934" onclick="window.location='https//jiji.ng/garki-ii/furniture/office-chair-in-abuja-zEclayD8cNgYlKxUhBHH1bBV.html?lid=RHfntElwLLexhqQV&amp;cur_pos=1&amp;pos=1&amp;ads_count=240&amp;ads_per_page=24&amp;page=0'">
                     <div className="b-product-plate__img">
                      <a className="img-wrap h-pos-rel" href={productLink(product.title, product.id)}>
                       <img alt={product.title} className="js-api-lazy-image" src={product.photos.split(",")[0]}/>
                      </a>
                      <span className="b-list-advert__item-count-images b-list-advert__item-count-images--gallery">
                       <i>
                        {product.photos.split(",").length}
                       </i>
                       <svg className="photo h-ml-2" style={{width: "13px", maxWidth: "13px", height: "13px", maxHeight: "13px", fill: "rgb(255, 255, 255)"}}>
                        <use xlinkHref="#photo">
                        </use>
                       </svg>
                      </span>
                     </div>
                     <div className="b-product-plate__descr">
                      <p className="title">
                       <a href={productLink(product.title, product.id)}>
                        {product.title}
                       </a>
                      </p>
                      <span className="price" dangerouslySetInnerHTML={{__html: product.currency_symbol + " " + commaNum(product.price)}}></span>
                      <span className="js-fav-actions b-like-button b-like-button__redesign " data-action="/profile/togglefav/16652934" data-advert_id="16652934" data-bazid="2" data-bazooka="fav-button" data-delete-ad-after="false" data-item_id="16652934">
                       <svg className="favorite-stroke inactive-icon" style={{width: "20px", maxWidth: "20px", height: "20px", maxHeight: "20px", fill: "rgb(112, 185, 63)"}}>
                        <use xlinkHref="#favorite-stroke">
                        </use>
                       </svg>
                       <svg className="favorite active-icon" style={{width: "20px", maxWidth: "20px", height: "20px", maxHeight: "20px", fill: "rgb(112, 185, 63)"}}>
                        <use xlinkHref="#favorite">
                        </use>
                       </svg>
                      </span>
                     </div>
                    </div>
                   </div>
                 ))
             }
         </div>
     }
     {
         this.state.loading_products?
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
   :
   <div className="before-data-load"></div>
  }
 </div>
</div>
        )
    }
}

export default SellerPage