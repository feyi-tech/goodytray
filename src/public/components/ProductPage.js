import React, { Component } from "react"
import { Link } from "react-router-dom"
import { API_ROOT, SERVER_ADDR, ERROR_NET_UNKNOWN, NO_PROFILE_PHOTO_IMAGE, MAX_ONLINE_INDICATOR_IN_MINS } from "../utils/Constants"
import { commaNum, truncText, cls } from "../utils/Funcs"
const browser = require("../utils/Browser")
var dateFormat = require('dateformat');
import TimeAgo from 'javascript-time-ago'

// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'
import { productLink, subCatLink, catLink } from "../utils/LinkBuilder"

// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en)
 
// Create relative date/time formatter.
const timeAgo = new TimeAgo('en-US');

class ProductPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chat_started: false,
            message: "",
            message_error: "",
            message_sent: false,
            sending_message: false,
            attrs: [],
            no_photo: NO_PROFILE_PHOTO_IMAGE,
            poster: {date: new Date(), last_seen_date: new Date(), profile_photo: NO_PROFILE_PHOTO_IMAGE},
            product: {date: new Date()},
            reviews_count: 0,
            similar_ads_params: "",
            similar_ads: [],
            similar_ads_has_prev: false,
            similar_ads_has_next: false,
            similar_ads_page: 0,
            photo_expanded: false,
            carousel_index: 0,
            carousel_transform: "0px",
            carousel_flex_basis: "917px",
            max_thumb_count: 5
            
        }
        this.startMessage = this.startMessage.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.loadSimilarAds = this.loadSimilarAds.bind(this)
        this.expandPhoto = this.expandPhoto.bind(this)
        this.cancelExpansion = this.cancelExpansion.bind(this)
        this.changePhoto = this.changePhoto.bind(this)
    }

    componentDidMount() {
        window.location.replace("#")
        var pathname = this.props.location.pathname
        pathname = pathname.endsWith("/")? pathname.substring(0, pathname.length - 1) : pathname
        const paths = pathname.split("/")
        const id = parseInt(paths[paths.length - 1])
        console.log("productId", id)

        browser.axios.get(API_ROOT + "products/details?vi=1&id="+id)
        .then(response => {
            if(response.data.details) {
                const product = response.data.details
                console.log("Product", product)
                product.date = new Date(product.created)
                this.setState({product: product})

                const poster = {}
                poster.username = response.data.details.poster_username
                poster.firstname = response.data.details.poster_firstname
                poster.lastname = response.data.details.poster_lastname
                poster.profile_photo = response.data.details.poster_profile_photo
                poster.created = response.data.details.poster_created
                poster.last_seen = response.data.details.poster_last_seen
                poster.date = new Date(poster.created)
                poster.number = response.data.details.poster_number
                poster.last_seen_date = new Date(poster.last_seen)

                if(poster.profile_photo.length == 0) poster.profile_photo = this.state.no_photo
                this.setState({poster: poster})

                //set attributes
                var attrs = response.data.details.attrs
                console.log("the_attrs", attrs.split(","))

                
                this.state.similar_ads_params = "not_id="+this.state.product.id+"&cat_id="+this.state.product.cat_id+"&sub_cat_id="+this.state.product.sub_cat_id
                if(attrs && attrs.includes(":")) {
                    attrs = attrs.substring(1, attrs.length - 1)
                    attrs = attrs.split(",")
                    if(attrs.length > 0) {
                        var i = 0
                        const pairs = {}
                        while(i < attrs.length) {
                            const keyValue = attrs[i].split(":")
                            if(keyValue.length == 2) {
                                this.state.similar_ads_params += "&attr=" + encodeURIComponent(attrs[i])
                                console.log("keyValue", keyValue[0], keyValue[1]);
                                if(pairs[keyValue[0]]) {
                                    pairs[keyValue[0]] = pairs[keyValue[0]]+", "+keyValue[1]

                                } else {
                                    pairs[keyValue[0]] = keyValue[1]
                                }
                                //pairs.push({key: keyValue[0], value: keyValue[1]})
                            }
                            i++
                        }
                        const pairsArray = Object.keys(pairs).map(function(key) {
                            return {key: key, value: pairs[key]};
                        });
                        if(pairsArray.length > 0) {
                            this.setState({attrs: pairsArray})
                        }
                    }
                }
                this.loadSimilarAds()


            } else {
                console.log("No product from response:", response.data, API_ROOT + "products/details?id="+id)
            }

        })
        .catch(e => {
            console.log("error from request:", e)
        })

    }

    changePhoto = (e) => {
        e.preventDefault()
        console.log("changePhoto", e.target)
        var dataIndex = e.target.getAttribute("data-index")
        console.log("changePhoto", "dataIndex", dataIndex)
        var carousel_index = this.state.carousel_index
        var flexBasis = $("#g-photo").offsetWidth//917
        //"translate(0px)"
        if(parseInt(dataIndex) == -2) {//prev
            carousel_index -= 1

        } else if(parseInt(dataIndex) == -1) {//next
            carousel_index += 1

        } else {
            carousel_index = parseInt(dataIndex)
        }
        if(carousel_index < 0) {
            carousel_index = this.state.product.photos.split(",").length - 1

            
        } else if(carousel_index > this.state.product.photos.split(",").length - 1) {
            carousel_index = 0
        }
        var transform = flexBasis - (flexBasis * (carousel_index + 1))
        this.setState({carousel_transform: transform+"px"})
        this.setState({carousel_flex_basis: flexBasis+"px"})
        this.setState({carousel_index: carousel_index})
        return
    }

    expandPhoto = () => {
        this.setState({photo_expanded: true})
    }

    cancelExpansion = () => {
        this.setState({photo_expanded: false})
    }

    loadSimilarAds = () => {
        //get similar products
        const page = this.state.similar_ads_page + 1
        browser.axios.get(API_ROOT + "products?page="+page + "&" + this.state.similar_ads_params)
        .then(response => {
            if(response && response.data && response.data.list) {
                const similar_ads = this.state.similar_ads.concat(response.data.list)
                console.log("similar_ads:", similar_ads)
                this.setState({similar_ads: similar_ads})
                this.setState({similar_ads_page: page})
                this.setState({similar_ads_has_prev: response.data.has_prev})
                this.setState({similar_ads_has_next: response.data.has_next})
            }
        })
        .catch(e => {

        })
    }

    startMessage = e => {
        e.preventDefault()
        this.setState({chat_started: true})
    }

    sendMessage = e => {
        e.preventDefault();
        if(this.state.sending_message || (this.props.user && this.props.user.id == this.state.product.user_id)) {return}
        console.log("sendMessage", "props", this.props)
        if(this.props.user == null) {
            window.location.href = "/login"

        }
        const message = this.state.message
        console.log("Send chat:", message)
        if(message.length < 10) {
            this.setState({message_error: "Your message is too short"})

        } else {
            this.setState({sending_message: true})
            const body = {
                text: message,
                to_id: this.state.product.user_id,
                product_id: this.state.product.id
            }
            browser.axios.post(API_ROOT + "messages/send", body)
            .then(response => {
                if(response.data.status == 1) {
                    this.setState({message_sent: true})

                } else {
                    this.setState({message_error: response.data.message})
                }
                this.setState({sending_message: false})
            })
            .catch(err => {
                console.log("sendError", err)
                this.setState({sending_message: false})
                this.setState({message_error: ERROR_NET_UNKNOWN})
            })
        }
    }

    handleChange = e => {
        e.preventDefault()
        this.state[e.target.name] = e.target.value
        this.setState({[e.target.name]: e.target.value})
    }

    render () {
        return (
            <div className="h-bg-grey h-pb-15">
            <div>
             <div className="qa-advert-page h-pos-rel b-advert-page-wrapper container h-pt-10" data-v-67bc6bc4="">
              <div className="b-bouncing-loader-wrapper" data-v-67bc6bc4="" style={this.state.product == null?{display: "block"}:{display: "none"}}>
               <div className="b-bouncing-loader spinner-absolute h-pt-20" style={{bottom: "0px"}}>
                <div>
                </div>
                <div>
                </div>
                <div>
                </div>
               </div>
              </div>
              <div data-v-67bc6bc4="">
               <ol className="qa-bread-crumbs b-breadcrumb-wrapper h-no-text-overflow h-pb-10" data-v-67bc6bc4="">
                <li className="b-breadcrumb-inner">
                 <Link className="qa-bread-crumbs-link b-breadcrumb-link" to="/">
                  <span>
                   All ads
                  </span>
                 </Link>
                 <meta/>
                </li>
                <li className="b-breadcrumb-inner">
                 <Link className="qa-bread-crumbs-link b-breadcrumb-link" to={this.state.product?catLink(this.state.product.cat_name):""}>
                  <span>
                   {this.state.product?this.state.product.cat_name:""}
                  </span>
                 </Link>
                 <meta/>
                </li>
                <li className="b-breadcrumb-inner">
                 <Link className="qa-bread-crumbs-link b-breadcrumb-link" to={this.state.product?subCatLink(this.state.product.sub_cat_name):""}>
                  <span>
                   {this.state.product?this.state.product.sub_cat_name:""}
                  </span>
                 </Link>
                 <meta/>
                </li>
                {
                    this.state.attrs.map(keyPair => (
                        keyPair.key.toLowerCase == "type"?
                        <li className="b-breadcrumb-inner">
                        <Link className="qa-bread-crumbs-link b-breadcrumb-link" to={"/search/types/"+keyPair.value}>
                         <span>
                          {keyPair.value}
                         </span>
                        </Link>
                        <meta/>
                       </li>
                       :
                       ""
                    ))
                }
                <li className="b-breadcrumb-inner">
                 <a className="qa-bread-crumbs-link b-breadcrumb-link">
                  <span>
                   {this.state.product?this.state.product.title:""}
                  </span>
                 </a>
                 <meta/>
                </li>
               </ol>
               <div categoryid="29" categoryslug="cars" data-v-67bc6bc4="">
               </div>
               <div className="qa-show-adsense h-mb-15" data-v-67bc6bc4="">
                <div>
                 <div className="b-adsense-wrapper" data-adsense-id="div-gpt-ad-1487921888460-0" id="div-gpt-ad-1487921888460-0" style={{maxWidth: "none"}}>
                  <script>
                   {/*window.googletag.cmd.push(function() {window.googletag.display('div-gpt-ad-1487921888460-0');});*/}
                  </script>
                 </div>
                </div>
               </div>
               <div className="b-advert-seller-info-wrapper" data-v-67bc6bc4="">
                <div id="g-photo" className="b-advert-item-wrapper" data-v-67bc6bc4="">
                 <div className="b-user-notification-wrapper" data-v-67bc6bc4=""></div>
                 <div className="b-advert-card-wrapper" data-v-67bc6bc4="" style={{borderColor: "rgb(112, 185, 63)"}}>
                  <div className="">
                   <div>
                    <div className="h-pos-rel">
                     <div className="VueCarousel qa-carousel-card b-carousel-card h-pointer">
                      <div className="hide VueCarousel-wrapper">
                       {
                           this.state.product && this.state.product.photos?
                           <div id="carousel-inner" className="VueCarousel-inner" style={{transform: "translate("+this.state.carousel_transform+")", transition: "transform 0.5s ease 0s", flexBasis: this.state.carousel_flex_basis, visibility: "visible", height: "auto"}}>
                           {
                               this.state.product.photos.split(",").map((photo, i) => (
                                   <div aria-hidden="true" className="VueCarousel-slide" role="tabpanel" tabIndex="-1">
                                       <div className="qa-carousel-slide slider-image" style={{backgroundImage: 'url('+photo.trim()+')'}}>
                                       </div>
                                   </div>
                               ))
                           }
                          </div>
                          :
                          ""
                       }
                      </div>
                      <div className="carousel slide productCarousel" data-ride="carousels">
                       {
                           this.state.product && this.state.product.photos?
                           <div className="carousel-inner">
                           {
                               this.state.product.photos.split(",").map((photo, i) => (
                                   <div className={"item"+(i == 0?" active":"")}>
                                       <div className="qa-carousel-slide slider-image" style={{backgroundImage: 'url('+photo.trim()+')'}}>
                                       </div>
                                   </div>
                               ))
                           }
                          </div>
                          :
                          ""
                       }
                      </div>
                      
                     </div>
                     <div className={this.state.photo_expanded?"b-carousel-expand-button active":"b-carousel-expand-button"} onClick={this.expandPhoto}>
                      <svg className="h-block full-screen" style={{width: "22px", height: "22px", maxWidth: "22px", maxHeight: "22px", fill: "rgb(242, 242, 242)", stroke: "inherit"}}>
                       <use xlinkHref="#full-screen">
                       </use>
                      </svg>
                     </div>
                     <div className="b-carousel-counter">
                      <svg className="h-mr-5 photo" style={{width: "14px", height: "16px", maxWidth: "14px", maxHeight: "16px", fill: "rgb(242, 242, 242)", stroke: "inherit"}}>
                       <use xlinkHref="#photo">
                       </use>
                      </svg>
                      {
                          this.state.product && this.state.product.photos?
                          <div className="qa-carousel-counter">
                            {this.state.carousel_index + 1 +"/"+this.state.product.photos.split(",").length}
                          </div>
                          :
                          ""
                      }
                     </div>
                     <div data-v-ced4779e="">
                      <a href=".productCarousel" data-slide="prev" data-index="-2" className="b-carousel-arrow b-carousel-arrow-left" data-v-ced4779e="">
                       <svg className="h-mr-3 arrow-left" data-index="-2" data-v-ced4779e="" style={{width: "15px", height: "32px", maxWidth: "15px", maxHeight: "32px", fill: "rgb(242, 242, 242)", stroke: "inherit"}}>
                        <use xlinkHref="#arrow-left" data-index="-2">
                        </use>
                       </svg>
                      </a>
                      <a href=".productCarousel" data-slide="next" data-index="-1" className="b-carousel-arrow b-carousel-arrow-right" data-v-ced4779e="">
                       <svg className="h-ml-3 arrow-right" data-index="-1" data-v-ced4779e="" style={{width: "15px", height: "32px", maxWidth: "15px", maxHeight: "32px", fill: "rgb(242, 242, 242)", stroke: "inherit"}}>
                        <use xlinkHref="#arrow-right" data-index="-1">
                        </use>
                       </svg>
                      </a>
                     </div>
                    </div>
                    <div className="h-flex">
                     <ol className="qa-carousel-thumbnails h-dflex h-mt-5" style={{marginLeft: "-5px", marginRight: "-5px"}}>
                      {
                          this.state.product && this.state.product.photos?
                          this.state.product.photos.split(",").slice(0, this.state.product.photos.split(",").length <= this.state.max_thumb_count?this.state.product.photos.split(",").length:this.state.max_thumb_count).map((photo, i) => (
                              i == this.state.max_thumb_count - 1?
                              <li key={i} style={{width: "20%"}} data-target=".productCarousel" data-slide-to={i} onClick={this.expandPhoto} className={i == 0?" active":""}>
                              <div className={"b-carousel-thumbnails qa-carousel-thumbnail-4 qa-carousel-thumbnail"} style={{margin: "5px"}}>
                               <img className="b-carousel-thumbnails--image" src={photo}/>
                               <div className="b-carousel-thumbnails-limit" style={{fontSize: "35px"}}>
                                <div className="b-carousel-thumbnail-title">
                                 <span className="b-carousel-thumbnail-title-plus">
                                  +
                                 </span>
                                 {this.state.product.photos.split(",").length - this.state.max_thumb_count}
                                </div>
                                <div className="b-carousel-thumbnail-aside">
                                 images
                                </div>
                               </div>
                              </div>
                             </li>
                             :
                             <li data-target=".productCarousel" data-slide-to={i} data-index={i} key={i} style={{width: "20%"}} className={i == 0?" active":""}>
                             <div data-index={i} className={"b-carousel-thumbnails qa-carousel-thumbnail-0 qa-carousel-thumbnail"} style={{margin: "5px"}}>
                              <img data-index={i} className="b-carousel-thumbnails--image" src={photo}/>
                             </div>
                            </li>
                          ))
                          :
                          ""
                        }
                     </ol>
                    </div>
                    {
                        this.state.product && this.state.product.photos?
                        <div className={"qa-carousel-expand b-carousel-expand-wrapper"+(this.state.photo_expanded?"":" hide")}>
                        <div className="h-pos-rel">
                            <div className="carousel slide productCarousel" data-ride="carousels">
                                {
                                    <div className="carousel-inner">
                                    {
                                        this.state.product.photos.split(",").map((photo, i) => (
                                            <div className={"item"+(i == 0?" active":"")}>
                                                <img className="b-carousel-expand-image" src={photo.trim()}/>
                                            </div>
                                        ))
                                    }
                                   </div>
                                }
                            </div>
                         
                        </div>
                        <div className="b-carousel-counter">
                         <svg className="h-mr-5 photo" style={{width: "14px", height: "16px", maxWidth: "14px", maxHeight: "16px", fill: "rgb(242, 242, 242)", stroke: "inherit"}}>
                          <use xlinkHref="#photo">
                          </use>
                         </svg>
                         <div className="qa-carousel-counter">
                            {this.state.carousel_index + 1 +"/"+this.state.product.photos.split(",").length}
                         </div>
                        </div>
                        <div onClick={this.cancelExpansion} style={{position: "absolute", right: "20px", bottom: "20px"}}>
                            <svg className="h-block full-screen-exit" style={{width: "24px", height: "24px", maxWidth: "24px", maxHeight: "24px", fill: "rgb(242, 242, 242)", stroke: "inherit"}}>
                                <use xlinkHref="#full-screen-exit">
                                </use>
                            </svg>
                        </div>

                        <div data-v-ced4779e="">
                         <a data-target=".productCarousel" data-slide="prev" data-index="-2" className="b-carousel-arrow b-carousel-arrow-left" data-v-ced4779e="">
                          <svg className="h-mr-3 arrow-left" data-index="-2" data-v-ced4779e="" style={{width: "15px", height: "32px", maxWidth: "15px", maxHeight: "32px", fill: "rgb(242, 242, 242)", stroke: "inherit"}}>
                           <use xlinkHref="#arrow-left" data-index="-2">
                           </use>
                          </svg>
                         </a>
                         <a data-target=".productCarousel" data-slide="next" data-index="-1" className="b-carousel-arrow b-carousel-arrow-right" data-v-ced4779e="">
                          <svg className="h-ml-3 arrow-right" data-index="-1" data-v-ced4779e="" style={{width: "15px", height: "32px", maxWidth: "15px", maxHeight: "32px", fill: "rgb(242, 242, 242)", stroke: "inherit"}}>
                           <use xlinkHref="#arrow-right" data-index="-1">
                           </use>
                          </svg>
                         </a>
                        </div>
                       </div>
                       :
                       ""
                    }
                   </div>
                  </div>
                  <div className="qa-advert-item b-advert-card">
                   {
                       this.state.product.sponsored?
                       <div className="">
                        <a className="qa-premium-label b-product-plate__label h-mb-7" data-v-f90ac2bc="" rel="nofollow" style={{color: "rgb(255, 255, 255)", borderColor: "rgb(34, 152, 38)", backgroundColor: "rgb(112, 185, 63)"}}>
                            Sponsored ad
                        </a>
                       </div>
                       :
                       ""
                   }
                   <div className="b-advert-title-outer">
                    <h1 className="qa-advert-title b-advert-title" data-v-55e8c8c5="">
                     <div className="b-advert-title-inner" data-v-55e8c8c5="">
                      {this.state.product.title}
                     </div>
                    </h1>
                    <span className="hide qa-like-button b-like-button b-mobile-button-increase-square h-pt-0">
                     <svg className="fav-icon favorite" style={{width: "16px", height: "16px", maxWidth: "16px", maxHeight: "16px", fill: "rgb(170, 170, 170)", stroke: "inherit"}}>
                      <use xlinkHref="#favorite">
                      </use>
                     </svg>
                    </span>
                   </div>
                   <div className="b-advert-info-statistics-wrapper">
                    <div className="h-dflex h-flex-wrap">
                     <div className="b-advert-info-statistics">
                      <svg className="h-mr-5 h-mb-2 clock" style={{width: "13px", height: "13px", maxWidth: "13px", maxHeight: "13px", fill: "rgb(143, 143, 143)", stroke: "inherit"}}>
                       <use xlinkHref="#clock">
                       </use>
                      </svg>
                      <span>
                        {
                            !timeAgo.format(this.state.product.date, 'time').toLowerCase().includes("just") 
                                && 
                            !timeAgo.format(this.state.product.date, 'time').toLowerCase().includes("ago")?
                            "Posted " + timeAgo.format(this.state.product.date, 'time') + " ago"
                            :
                            "Posted " + timeAgo.format(this.state.product.date, 'time')
                         }
                      </span>
                     </div>
                     <div className="b-advert-info-statistics">
                      <svg className="h-mr-2 h-mv-1 region" style={{width: "18px", height: "15px", maxWidth: "18px", maxHeight: "15px", fill: "rgb(143, 143, 143)", stroke: "inherit"}}>
                       <use xlinkHref="#region">
                       </use>
                      </svg>
                      <span className="location-append">
                        {
                            this.state.product.city_name && this.state.product.city_name.length > 0?
                            <span>{this.state.product.city_name}</span>
                            :
                            ""
                        }
                        {
                            this.state.product.state_name && this.state.product.state_name.length > 0?
                            <span>{this.state.product.state_name}</span>
                            :
                            ""
                        }
                        {
                            this.state.product.country_name && this.state.product.country_name.length > 0?
                            <span>{this.state.product.country_name}</span>
                            :
                            ""
                        }
                      </span>
                     </div>
                    </div>
                    <div className="b-advert-info-statistics">
                     <svg className="h-mr-5 eye" style={{width: "15px", height: "12px", maxWidth: "15px", maxHeight: "12px", fill: "rgb(143, 143, 143)", stroke: "inherit"}}>
                      <use xlinkHref="#eye">
                      </use>
                     </svg>
                     {this.state.product.views} views
                    </div>
                   </div>
                   <div className="b-advert-attributes-wrapper" data-v-f7230aae="">
                    {
                        this.state.attrs.length > 0?
                        <h2 className="b-advert__description-title h-mb-15" data-v-f7230aae="">
                            Specifications
                        </h2>
                        :
                        ""
                    }
                    <div className="b-advert-attributes" data-v-f7230aae="">
                    {
                        this.state.attrs.map(attr => (
                          <div className="b-render-attr" data-v-f7230aae="">
                            <div className="b-render-attr__name h-mb-5">
                             <span className="b-render-attr__text">
                              {attr.key}
                             </span>
                            </div>
                            <div className="h-dflex b-attr-unit h-min-width-50p h-mm786-min-width-0">
                             <div className="qa-advert-attribute h-word-break">
                              {attr.value}
                             </div>
                            </div>
                           </div>
                        ))
                    }
                    </div>
                   </div>
                   <div className="b-advert__description-wrapper">
                    <h2 className="b-advert__description-title">
                     Ad details
                    </h2>
                    <div className="qa-advert-description b-advert__description-text">
                     {
                         this.state.product? this.state.product.description : ""
                     }
                    </div>
                   </div>
                   <div className="js-apply_cv_result">
                   </div>
                   <div className="b-advert-card-aside">
                    {
                        this.state.poster?
                        <div className="b-show-contact-outer">
                        <a className="qa-show-contact cy-show-contact js-show-contact b-show-contact" href={"tel: "+this.state.poster.number} rel="nofollow">
                         <span className="b-show-contact-title">
                          {this.state.poster.number}
                         </span>
                        </a>
                       </div>
                       :
                       ""
                    }
                    <div className="b-advert-social-wrapper">
                     <div className="b-advert-social-inner">
                      <div className="b-advert-card-share-wrapper" data-v-6ffe10ec="">
                       <div className="fb-save h-mr-3 b-fb-save-button" data-v-6ffe10ec="">
                       </div>
                       <a className="b-share-button h-dflex mail qa-social-mail" data-v-6ffe10ec="" href={"mailto:?utm_source=mail_share&subject="+this.state.product.title+"&body="+encodeURI(SERVER_ADDR+productLink(this.state.product.title, this.state.product.id))} rel="nofollow" target="_blank">
                        <svg className="mail" data-v-6ffe10ec="" style={{width: "13px", height: "13px", maxWidth: "13px", maxHeight: "13px", fill: "rgb(255, 255, 255)", stroke: "inherit"}}>
                         <use xlinkHref="#mail">
                         </use>
                        </svg>
                       </a>
                       <a className="b-share-button h-dflex twitter qa-social-twitter" data-v-6ffe10ec="" href={"https://twitter.com/share?utm_source=twitter_share&text="+this.state.product.title+"&url="+encodeURI(SERVER_ADDR+productLink(this.state.product.title, this.state.product.id))} rel="nofollow" target="_blank">
                        <svg className="twitter" data-v-6ffe10ec="" style={{width: "13px", height: "13px", maxWidth: "13px", maxHeight: "13px", fill: "rgb(255, 255, 255)", stroke: "inherit"}}>
                         <use xlinkHref="#twitter">
                         </use>
                        </svg>
                       </a>
                       <a className="b-share-button h-dflex facebook qa-social-facebook" data-v-6ffe10ec="" href={"https://www.facebook.com/sharer/sharer.php?utm_source=fb_share&u="+encodeURI(SERVER_ADDR+productLink(this.state.product.title, this.state.product.id))} rel="nofollow" target="_blank">
                        <svg className="facebook" data-v-6ffe10ec="" style={{width: "13px", height: "13px", maxWidth: "13px", maxHeight: "13px", fill: "rgb(255, 255, 255)", stroke: "inherit"}}>
                         <use xlinkHref="#facebook">
                         </use>
                        </svg>
                       </a>
                       <a className="b-share-button h-dflex whatsapp qa-social-whatsapp" data-v-6ffe10ec="" href={"whatsapp://send?text="+encodeURI("*"+this.state.product.title+":* "+this.state.product.description+" - _"+SERVER_ADDR+productLink(this.state.product.title, this.state.product.id)+"_")} rel="nofollow" target="_blank">
                        <svg className="whatsapp" data-v-6ffe10ec="" style={{width: "13px", height: "13px", maxWidth: "13px", maxHeight: "13px", fill: "rgb(255, 255, 255)", stroke: "inherit"}}>
                         <use xlinkHref="#whatsapp">
                         </use>
                        </svg>
                       </a>
                      </div>
                     </div>
                    </div>
                   </div>
                   <div className="b-advert-card-aside h-pt-20 h-pb-10">
                    <div className="qa-request-seller-to-call-back b-request-callback-wrapper">
                     <div className="h-width-100p b-spin-loader b-spin-loader--small-padding" style={{display: "none"}}>
                      <div className="b-bouncing-loader" style={{bottom: "0px"}}>
                       <div>
                       </div>
                       <div>
                       </div>
                       <div>
                       </div>
                      </div>
                     </div>
                     <a className="h-width-100p h-a-without-underline" rel="nofollow">
                      <span className="qa-request-to-callback b-request-callback-button b-request-callback-button-closed hide">
                       Request seller to call back
                      </span>
                     </a>
                    </div>
                   </div>
                   <div className="b-request-like-this-wrapper h-mb-20 hide">
                    <button className="b-button b-button--border-radius b-button--transparent b-request-like-this-button" disabled="disabled">
                     You've been successfully subscribed!
                    </button>
                   </div>
                  </div>
                 </div>
                </div>
                <div className="b-seller-info-wrapper" data-v-67bc6bc4="">
                 <div className="b-advert-seller-block-outer" data-v-67bc6bc4="">
                  <div className="b-advert-seller-block" data-v-67bc6bc4="">
                   <div className="qa-advert-price-view b-advert-seller-price" data-v-67bc6bc4="" style={{backgroundColor: "rgb(112, 185, 63)"}}>
                    <div>
                     <span className="qa-advert-price-view-value" dangerouslySetInnerHTML={{__html: this.state.product?this.state.product.currency_symbol +" "+ commaNum(this.state.product.price+"") : ""}}></span>
                    </div>
                   </div>
                   <div className="h-dflex h-flex-dir-column h-mm992-flex-dir-row" data-v-67bc6bc4="">
                    <div className="h-flex" data-v-67bc6bc4="">
                     <div className="b-seller-info-data">
                      <div className="b-seller-info-data-inner">
                       <div className="h-pos-rel">
                        <div className="b-seller-online-status">
                        </div>
                        <Link className="b-seller-info-image" to={"/seller/"+this.state.product.user_id} style={{backgroundImage: 'url('+this.state.poster.profile_photo+')'}}>
                        </Link>
                       </div>
                       <div className="b-seller-info-outer">
                        <Link className="b-seller-info-name" to={"/seller/"+this.state.product.user_id}>
                         <span className="h-text-center">
                          {this.state.poster?this.state.poster.firstname+" "+this.state.poster.lastname:""}
                         </span>
                        </Link>
                       </div>
                      </div>
                      <div className={this.state.product.reviews > 0?"b-seller-feedback-block":"b-seller-feedback-block hide"}>
                       <Link className="b-leave-feedback-button" to={"/reviews/"+this.state.product.id}>
                        <span className="b-button b-button--primary b-button--biggest-size b-button--has-feedback">
                         <span className="b-feedback-count">
                          <svg className="positive" strokeWidth="0" style={{width: "24px", height: "24px", maxWidth: "24px", maxHeight: "24px", fill: "rgb(255, 255, 255)", stroke: "inherit"}}>
                           <use xlinkHref="#positive">
                           </use>
                          </svg>
                          {this.state.product.reviews} Feedback
                         </span>
                         <span className="b-watch-all">
                          See All
                          <svg className="arrow-right" strokeWidth="0" style={{width: "12px", height: "12px", maxWidth: "12px", maxHeight: "12px", fill: "rgb(255, 255, 255)", stroke: "inherit"}}>
                           <use xlinkHref="#arrow-right">
                           </use>
                          </svg>
                         </span>
                        </span>
                       </Link>
                      </div>
                      <div className="b-seller-online-info">
                       <div className="b-seller-online-info-block">
                        <div className="b-seller-online-title">
                         {dateFormat(this.state.poster.date, "d mmm yyyy")}
                        </div>
                        <div className="b-seller-online-aside">
                         Registered
                        </div>
                       </div>
                       <div className="b-seller-online-info-block">
                        <div className="b-seller-online-title">
                         {
                            new Date() - this.state.poster.last_seen_date <= (MAX_ONLINE_INDICATOR_IN_MINS * 60 * 1000)?
                            "online"
                            :
                            !timeAgo.format(this.state.poster.last_seen_date, 'time').toLowerCase().includes("just") 
                                && 
                            !timeAgo.format(this.state.poster.last_seen_date, 'time').toLowerCase().includes("ago")?
                            timeAgo.format(this.state.poster.last_seen_date, 'time') + " ago"
                            :
                            timeAgo.format(this.state.poster.last_seen_date, 'time')
                         }
                        </div>
                        <div className="b-seller-online-aside">
                         Last seen
                        </div>
                       </div>
                      </div>
                      <div className="b-seller-info-interaction">
                       <a className="qa-show-contact cy-show-contact js-show-contact b-show-contact h-mb-20" href={"tel: "+this.state.poster.number} rel="nofollow">
                        <span className="b-button b-button--primary b-button--biggest-size">
                         {this.state.poster.number}
                        </span>
                       </a>
                       <div className="h-flex h-width-100p h-mb-20">
                        <div className="" style={this.state.sending_message?{display:"block"}:{display: "none"}}>
                         <div className="b-bouncing-loader" style={{bottom: "0px"}}>
                          <div>
                          </div>
                          <div>
                          </div>
                          <div>
                          </div>
                         </div>
                        </div>
                        {
                            this.state.message_sent?
                            <div class="qa-send-message-success b-success-message">
                                Your message has been successfully sent!
                            </div>
                            :
                            !this.state.chat_started?
                            <a rel="nofollow" className={"h-a-without-underline"+(this.props.user && this.props.user.id == this.state.product.user_id?" hide":"")} onClick={this.startMessage}>
                                <span className="qa-start-chat b-button b-button--transparent b-button--biggest-size">
                                    Start Chat
                                </span>
                            </a>
                            :
                            <form id="message_anchor" method="post" onSubmit={this.sendMessage}>
                              <div className={this.state.message.length == 0?"qa-textarea b-form-section b-form-section--required":this.state.message.length < 10?"qa-textarea b-form-section b-form-section--required b-form-section--error":"qa-textarea b-form-section b-form-section--required b-form-section--success"} data-v-cca4341a="">
                               <label className="b-form-section__title" data-v-cca4341a="" for="textarea-2144">
                                Message
                               </label>
                               <div className="b-form-section__elem-wrapp" data-v-cca4341a="">
                                <textarea className="js-chat-form-textarea" data-v-cca4341a="" id="textarea-2144" name="message" value={this.state.message} onChange={this.handleChange} placeholder="Write here your message" rows="5"></textarea>
                               </div>
                               <div className="b-form-section__error-descr" data-v-cca4341a="">
                                {this.state.message.length > 0 && this.state.message.length < 10 && !this.state.sending_message?"Message length must be up to 10" : this.state.message_error}
                               </div>
                              </div>
                              {
                                this.state.message.length < 10 || this.state.sending_message?
                                <input className="qa-send-message-submit-button b-button b-button--secondary b-button--biggest-size" disabled="disabled" type="submit" value="Send Message"/>
                                :
                                <input className="qa-send-message-submit-button b-button b-button--secondary b-button--biggest-size" type="submit" value="Send Message"/>
                              }
                            </form>
                        }
                       </div>
                      </div>
                     </div>
                    </div>
                   </div>
                  </div>
                 </div>
                 <div className="b-advert-seller-block-outer" data-v-67bc6bc4="">
                  <div className="b-advert-seller-block" data-v-67bc6bc4="">
                   <div className="b-advert-safety-block" data-v-67bc6bc4="">
                    <div data-v-67bc6bc4="">
                     <div className="b-advert-safety-block-title">
                      Safety tips
                     </div>
                     <ul className="b-advert-safety-list">
                      <li>
                       Do not pay in advance even for the delivery
                      </li>
                      <li>
                       Try to meet at a safe, public location
                      </li>
                      <li>
                       Check the item BEFORE you buy it
                      </li>
                      <li>
                       Pay only after collecting the item
                      </li>
                     </ul>
                    </div>
                    <div className="h-mt-10" data-v-67bc6bc4="">
                     <a className="hide qa-button-report-abuse b-share-button h-mb-0 b-share-button--transparent">
                      <span className="h-font-14 h-flex-center">
                       <svg className="h-mr-5 h-mt-1 flag" data-v-67bc6bc4="" style={{width: "13px", height: "13px", maxWidth: "13px", maxHeight: "13px", fill: "rgb(210, 49, 63)", stroke: "inherit"}}>
                        <use xlinkHref="#flag">
                        </use>
                       </svg>
                       Report Abuse
                      </span>
                     </a>
                    </div>
                   </div>
                  </div>
                  <div className="b-advert-seller-block b-advert-big-button-outer" data-v-67bc6bc4="">
                   <div className="b-button-wrapper">
                    <a className="qa-post-ad-like-this b-button b-button--primary b-button--biggest-size" href={"/sell?cat="+this.state.product.cat_id+"&sub_cat="+this.state.product.sub_cat_id+"&country="+this.state.product.country_id+"&state="+this.state.product.state_id+"&city="+this.state.product.city_id} rel="nofollow">
                     Post Ad Like This
                    </a>
                   </div>
                  </div>
                 </div>
                </div>
               </div>
               <div className="h-dflex" data-v-67bc6bc4="">
                <div className="b-similar-listing h-flex-dir-column h-mt-20" data-v-67bc6bc4="">
                 <div className="qa-show-adsense h-mb-15" data-v-67bc6bc4="">
                  <div>
                   <div className="b-adsense-wrapper" data-adsense-id="div-gpt-ad-1489495269292-0" id="div-gpt-ad-1489495269292-0" style={{maxWidth: "none"}}>
                    <script>
                     {/*window.googletag.cmd.push(function() {window.googletag.display('div-gpt-ad-1489495269292-0');});*/}
                    </script>
                   </div>
                  </div>
                 </div>

                 <div className={this.state.similar_ads.length == 0?"hide":""}>
                 <h3 className="b-advert__description-title h-mt-0" data-v-67bc6bc4="">
                  Similar adverts
                 </h3>
                 <div className="b-bouncing-loader-wrapper" data-v-67bc6bc4="" style={this.state.similar_ads.length > 0?{display: "none"}:{display: "block"}}>
                    <div className="b-bouncing-loader spinner-absolute h-pt-20" style={{bottom: "0px"}}>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                 </div>
                 <div className={"b-similar-listing-outer"} data-v-67bc6bc4="">
                  <div className="qa-advert-listing advert-listing" data-v-67bc6bc4="" name="advertsListing">
                   <div>
                       {
                           this.state.similar_ads.map((ad, index) => (
                            ad.id == this.state.product.id?
                            ""
                            :
                            <div className="b-list-advert__item-wrapper" key={index}>
                            <div className="b-list-advert__item qa-advert-list-item animate" data-advert_id="16802192" data-v-9681c3a6="">
                             <a className="js-handle-click-ctr js-advert-link b-list-advert__template" data-v-9681c3a6="" href={productLink(ad.title, ad.id)}>
                              <div className="b-list-advert__template-img" data-v-9681c3a6="">
                               <span className="b-list-advert__item-image js-advert-link" data-v-9681c3a6="">
                                <img data-v-9681c3a6="" src={ad.photos.split(",")[0].trim()}/>
                               </span>
                               <span className="b-list-advert__item-count-images" data-v-9681c3a6="">
                                <i data-v-9681c3a6="">
                                 {ad.photos.split(",").length}
                                </i>
                                <svg className="h-ml-3 h-mr-2 h-mt-1 photo" data-v-9681c3a6="" style={{width: "14px", height: "15px", maxWidth: "14px", maxHeight: "15px", fill: "rgb(255, 255, 255)", stroke: "inherit"}}>
                                 <use xlinkHref="#photo">
                                 </use>
                                </svg>
                               </span>
                              </div>
                              <div className="b-list-advert__template-descr" data-v-9681c3a6="">
                               <div className="h-dflex h-flex-wrap h-flex h-width-100p" data-v-9681c3a6="">
                                <div className="b-list-advert__template-descr-header" data-v-9681c3a6="">
                                 <div className="b-list-advert__template-title" data-v-9681c3a6="">
                                  <h3 className="qa-advert-list-item-title b-list-advert__item-title" data-v-55e8c8c5="" data-v-9681c3a6="">
                                   <div className="b-advert-title-inner" data-v-55e8c8c5="">
                                    {ad.title}
                                   </div>
                                  </h3>
                                 </div>
                                 <div className="b-list-advert__template-price" data-v-9681c3a6="">
                                  <div className="qa-advert-price b-list-advert__item-price" data-v-9681c3a6="">
                                   <span data-v-9681c3a6="">
                                    {/*ad.currency_symbol+" "+commaNum(ad.price)*/}
                                   </span>
                                  </div>
                                 </div>
                                </div>
                                <div className="b-list-advert__template-descr-body" data-v-9681c3a6="">
                                 <div className="b-list-advert__template-descr-body-main" data-v-9681c3a6="">
                                  <div className="b-list-advert__item-description" data-v-9681c3a6="">
                                   <div className="b-list-advert__item-description-text h-mb-5 h-width-100p" data-v-9681c3a6="">
                                    {truncText(ad.description, 100, "...")}
                                   </div>
                                  </div>
                                 </div>
                                 <div className="h-width-100p h-mt-5" data-v-9681c3a6="">
                                    {
                                        ad.attrs.substring(1, ad.attrs.length - 1).split(",").map((attr, i) => (
                                            attr.split(":").length == 2 && i < 3?
                                            <div className="b-list-advert__item-attr" data-v-9681c3a6="">
                                                {attr.split(":")[0]+": "+attr.split(":")[1]}
                                            </div>
                                            :
                                            ""
                                        ))
                                    }
                                 </div>
                                </div>
                               </div>
                               <div className="h-width-100p" data-v-9681c3a6="">
                               </div>
                               <div className="b-list-advert__template-descr-footer" data-v-9681c3a6="">
                                <div className="b-list-advert__template-location" data-v-9681c3a6="">
                                 <div className="b-list-advert__item-region" data-v-9681c3a6="">
                                  <svg className="h-flex-0-0-16 h-mr-2 h-pb-1 region hide" data-v-9681c3a6="" style={{width: "14px", height: "16px", maxWidth: "14px", maxHeight: "16px", fill: "rgb(136, 136, 136)", stroke: "inherit"}}>
                                   <use xlinkHref="#region">
                                   </use>
                                  </svg>
                                  {
                                       !timeAgo.format(new Date(ad.created), 'time').toLowerCase().includes("just") 
                                       && 
                                       !timeAgo.format(new Date(ad.created), 'time').toLowerCase().includes("ago")?
                                       timeAgo.format(new Date(ad.created), 'time') + " ago"
                                       :
                                       timeAgo.format(new Date(ad.created), 'time')
                                  }
                                  <span className="h-ml-5 hide" data-v-9681c3a6="">
                                   – Cars
                                  </span>
                                 </div>
                                </div>
                               </div>
                              </div>
                             </a>
                            </div>
                           </div>
                           ))
                       }
                   </div>
                  </div>
                  <div className="h-mt-15" data-v-67bc6bc4="">
                   {
                       this.state.similar_ads_has_next?
                       <a onClick={this.loadSimilarAds} className="js-handle-link-events b-button b-button--primary b-button--biggest-size h-block" data-v-67bc6bc4="" href="javascript:void(0)">
                            Show more ads &gt;&gt;&gt;
                       </a>
                       :
                       ""
                   }
                  </div>
                 </div></div>
                </div>
                <div className="h-flex h-pt-20 h-mb-15" data-v-67bc6bc4="">
                 <div className="b-fixed-element-outer" data-v-67bc6bc4="">
                  <div className="b-fixed-element b-fixed-element-static" style={{left: "0px", bottom: "auto", top: "0px"}}>
                   <div className="qa-show-adsense h-iblock" data-v-67bc6bc4="">
                    <div>
                     <div className="b-adsense-wrapper" data-adsense-id="div-gpt-ad-1487669506388-0" id="div-gpt-ad-1487669506388-0" style={{height: "600px", maxWidth: "255px"}}>
                      <script>
                       {/*window.googletag.cmd.push(function() {window.googletag.display('div-gpt-ad-1487669506388-0');});*/}
                      </script>
                     </div>
                    </div>
                   </div>
                  </div>
                 </div>
                </div>
               </div>
               <div className="qa-show-adsense h-mb-15" data-v-67bc6bc4="">
                <div>
                 <div className="b-adsense-wrapper" data-adsense-id="div-gpt-ad-1487923193658-0" id="div-gpt-ad-1487923193658-0" style={{maxWidth: "none"}}>
                  <script>
                   {/*window.googletag.cmd.push(function() {window.googletag.display('div-gpt-ad-1487923193658-0');});*/}
                  </script>
                 </div>
                </div>
               </div>
               <div className="b-similar h-mt-20 h-pb-40 hide" data-v-67bc6bc4="">
                <div>
                 <div className="b-similar__head">
                  Useful Links
                  <span className="b-similar__head-icon">
                  </span>
                 </div>
                </div>
                <div className="b-similar__body">
                 <div className="h-dflex h-mb-5 b-tag-list-wrapper-lbc" data-v-67bc6bc4="">
                  <div className="b-collapse h-mb-10">
                   <div className="b-collapse__body">
                    <div className="b-collapse-js-height">
                     <div className="b-tag-list b-tag-list--green">
                      <span className="b-tag-list--title h-mr-5">
                       City location:
                      </span>
                      <div className="b-tag-list__item-wrapper">
                       <span className="b-tag-list__item">
                        <a className="b-tag-list__item--link" href="/lagos">
                         Lagos State
                        </a>
                        <span className="b-tag-list__count">
                        </span>
                       </span>
                       <span className="b-tag-list__item">
                        <a className="b-tag-list__item--link" href="/ikeja">
                         Ikeja
                        </a>
                        <span className="b-tag-list__count">
                        </span>
                       </span>
                      </div>
                     </div>
                     <div className="b-tag-list b-tag-list--green">
                      <span className="b-tag-list--title h-mr-5">
                       Category location:
                      </span>
                      <div className="b-tag-list__item-wrapper">
                       <span className="b-tag-list__item">
                        <a className="b-tag-list__item--link" href="/lagos/cars">
                         Cars in Lagos State
                        </a>
                        <span className="b-tag-list__count">
                        </span>
                       </span>
                      </div>
                     </div>
                     <div className="b-tag-list b-tag-list--green">
                      <span className="b-tag-list--title h-mr-5">
                       Subcategory location:
                      </span>
                      <div className="b-tag-list__item-wrapper">
                       <span className="b-tag-list__item">
                        <a className="b-tag-list__item--link" href="/ikeja/cars">
                         Cars in Ikeja
                        </a>
                        <span className="b-tag-list__count">
                        </span>
                       </span>
                       <span className="b-tag-list__item">
                        <a className="b-tag-list__item--link" href="/lagos/cars">
                         Cars in Lagos State
                        </a>
                        <span className="b-tag-list__count">
                        </span>
                       </span>
                       <span className="b-tag-list__item">
                        <a className="b-tag-list__item--link">
                         New Toyota Corolla 2019 Black
                        </a>
                        <span className="b-tag-list__count">
                        </span>
                       </span>
                      </div>
                     </div>
                     <div className="b-tag-list b-tag-list--green">
                      <span className="b-tag-list--title h-mr-5">
                       Tags and Brands:
                      </span>
                      <div className="b-tag-list__item-wrapper">
                       <span className="b-tag-list__item">
                        <a className="b-tag-list__item--link" href="/ikeja/cars/toyota">
                         toyota Cars in Ikeja
                        </a>
                        <span className="b-tag-list__count">
                        </span>
                       </span>
                       <span className="b-tag-list__item">
                        <a className="b-tag-list__item--link" href="/ikeja/cars/toyota-corolla-2019">
                         toyota corolla 2019 Cars in Ikeja
                        </a>
                        <span className="b-tag-list__count">
                        </span>
                       </span>
                       <span className="b-tag-list__item">
                        <a className="b-tag-list__item--link" href="/ikeja/cars/toyota-corolla">
                         toyota corolla Cars in Ikeja
                        </a>
                        <span className="b-tag-list__count">
                        </span>
                       </span>
                       <span className="b-tag-list__item">
                        <a className="b-tag-list__item--link" href="/ikeja/cars/black">
                         black Cars in Ikeja
                        </a>
                        <span className="b-tag-list__count">
                        </span>
                       </span>
                       <span className="b-tag-list__item">
                        <a className="b-tag-list__item--link" href="/brand/toyota">
                         Toyota
                        </a>
                        <span className="b-tag-list__count">
                        </span>
                       </span>
                      </div>
                     </div>
                    </div>
                    <div className="b-collapse__button b-collapse--absolute">
                     Show all
                    </div>
                   </div>
                  </div>
                 </div>
                </div>
               </div>
              </div>
             </div>
            </div>
           </div>                  
        )
    }
}

export default ProductPage