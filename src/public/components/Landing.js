import React, { Component } from "react"
import { SITE_TITLE, API_ROOT, PAID_AD_NAME } from "../utils/Constants"
import { productLink, catLink, catIconName, countryLink } from "../utils/LinkBuilder"
import { commaNum, id, overflows} from "../utils/Funcs"
import { Link } from "react-router-dom"

const browser = require("../utils/Browser")

class Landing extends Component {
    constructor() {
        super()
        this.state = {
          email: '',
          lastname: '',
          email: '',
          errors: {},
          carousel_id: 0,
          carousel_images: ["/public/res/images/static/how-to-buy.jpg", "/public/res/images/static/premium-services.jpg"],
          products: [],
          loading_products: false,
          cats: [],
          sub_cats: [],
          countries: [],
          country: null,
          countries_visible: false,
          search: "",
          cat_id: -1
        }

        this.handleClick = this.handleClick.bind(this)
        this.toggleCountries = this.toggleCountries.bind(this)
        //this.sideBarScroll = this.sideBarScroll.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.setSubCat = this.setSubCat.bind(this)
    }

    handleChange = e => {
        this.state[e.target.name] = e.target.value
        this.setState({[e.target.name]: e.target.value})
    }
    handleSearch = e => {
        e.preventDefault()
        if(this.state.search.length > 0) {
            this.props.history.push("/search?q="+this.state.search)
            //window.location.href = "/search?q="+this.state.search
        }
    }

    toggleCountries = e => {
        this.setState({countries_visible: !this.state.countries_visible})
    }

    getCatPane = (source) => {
        return source.startsWith("s")?id("side_bar_scroll_sub"):id("side_bar_scroll")
    }

    handleClick = e => {
        const source = e.target.getAttribute("data-source")
        console.log("CLICK", source)
        if(source == "change-carousel") {
            this.changeCarousel(parseInt(e.target.getAttribute("data-id")))

        } else if(source.endsWith("down")) {
            console.log("down scroll")
            const catPane = this.getCatPane(source)
            var by = catPane.offsetHeight
            //alert("top: "+catPane.scrollTop+", H: "+catPane.scrollHeight+", by1: "+by);
            
            this.scrollV(catPane, by)
            this.sideBarScroll(source)

        } else if(source.endsWith("up")) {
            console.log("up scroll")
            const catPane = this.getCatPane(source)
            const catScrollPaneHeight = catPane.scrollHeight
            var by = catPane.offsetHeight
            this.scrollV(catPane, -1 * by)
            this.sideBarScroll(source)
        }
    }

    scrollV = (el, val) => {
        el.scrollTop += val;
    }

    scrollH = (el, val) => {
        el.scrollLeft += val;
    }

    sideBarScroll = (source) => {
        console.log("side scroll", source)
        var prefix = source.startsWith("s")?"s":""
        const catPane = this.getCatPane(source)
        const catScrollPaneHeight = catPane.scrollHeight
        const scrollTop = catPane.scrollTop
        console.log("sideBarScroll", "ScrollTop", scrollTop)
        
        var idPrefix = "#"+prefix+"cat-";
        if(!overflows(catPane)) {
            $(idPrefix+"up").hide()
            $(idPrefix+"down").hide()

        } else {
            //alert("scrollTop = "+(scrollTop  + catPane.offsetHeight)+", catScrollPaneHeight = "+catScrollPaneHeight)
            var scrollbarH = catPane.offsetHeight - catPane.clientHeight
            if(scrollTop == 0) {
                $(idPrefix+"up").hide()
                $(idPrefix+"down").show()

            } else if(scrollTop  + catPane.offsetHeight == catScrollPaneHeight) {
                $(idPrefix+"up").show()
                $(idPrefix+"down").hide()

            } else {
                $(idPrefix+"up").show()
                $(idPrefix+"down").show()
            }
        }
        
        
    }

    setSubCat = (e) => {
        var id = e.target.getAttribute("data-id")
        $.each($(".b-categories-item"), (i, el) => {
            el.classList.remove(["b-categories-item-focused"])
        });
        $(".cat_and_sub_"+id)[0].classList.add(["b-categories-item-focused"])
        var index = e.target.getAttribute("data-index")
        if(index) {
            index = parseInt(index)
            console.log("setSubCat", "index", index)
            this.state.cat_id = this.state.cats[index].id
            this.setState({cat_id: this.state.cats[index].id});
            this.state.sub_cats = this.state.cats[index].sub_cats
            this.setState({sub_cats: this.state.cats[index].sub_cats})
        }
    }

    clearSubCats = () => {
        this.state.sub_cats = []
        this.setState({sub_cats: []})
        $.each($(".b-categories-item"), (i, el) => {
            el.classList.remove(["b-categories-item-focused"])
        });
    }

    changeCarousel(id) {
        if(id >= this.state.carousel_images.length) {
            id = 0

        } else if(id < 0) {
            id = this.state.carousel_images.length - 1

        } else {
        }
        this.setState({carousel_id: id})
    }
    
    componentDidMount() {
        console.log("mounted")
        //window.location.replace("#")
        document.title = SITE_TITLE
        this.changeCarousel(this.state.carousel_id)
        try{
            this.sideBarScroll("")

        }catch(e){}
        
        
        this.setState({loading_products: true})

        //get cats & sub cats
        browser.axios.get(API_ROOT + "products/cats_and_sub_cats")
        .then(resp => {
            if(resp && resp.data) {
                this.setState({cats: resp.data})
            }
        })
        //get products
        browser.axios.get(API_ROOT + "products?update_order=1&views_order=1")
        .then(resp => {
            if(resp && resp.data && resp.data.list) {
                this.setState({products: resp.data.list})
            }
            this.setState({loading_products: false})
        })
        //get countries
        browser.axios.get(API_ROOT + "countries")
        .then(resp => {
            if(resp && resp.data && resp.data.countries) {
                this.setState({countries: resp.data.countries})
            }
        })
    }

    render() {
        return (
                <div className="h-bg-grey  h-pb-15">
                    <div>
                        <div className="b-main-page">
                            <div className="b-main-page-header h-pos-rel sm-hide-down">
                                <div className="b-main-page-header__inner-wrapper">
                                    <div className="b-main-page-header__inner-wrapper--content h-width-600 h-pos-rel h-height-100p">
                                        <img alt="man" className="b-main-page-header__img-man" src="/public/res/images/static/man.png" />
                                        <div className="b-main-page-header__content ">
                                            <div className="row h-mb-30">
                                                <div className="col-xs-12 center-xs">
                                                    <p className="b-main-page-header__text">
                                                        Find anything in&nbsp;
                                                        <button onClick={this.toggleCountries} className="fw-button qa-fw-button fw-button--type-deep-blue fw-button--size-small fw-button--has-icon" type="button">
                                                            <span className="fw-button__content">
                                                                <svg className="geo-marker" strokeWidth="0" style={{ width: "11px", height: "11px", maxWidth: "11px", maxHeight: "11px", fill: "inherit", stroke: "inherit" }}>
                                                                    <use xlinkHref="#geo-marker">
                                                                    </use>
                                                                </svg>
                                                                <span className="fw-button__slot-wrapper fw-button__text--has-icon">
                                                                    {this.state.country == null? "All countries": this.state.country}
                                                                </span>
                                                            </span>
                                                        </button>
                                                    </p>
                                                </div>
                                                <div className="col-xs-6 end-xs b-main-page-header__choose-location-container">
                                                    <div className="b-main-page-header__choose-location">
                                                        {
                                                            !this.state.countries_visible?
                                                            ""
                                                            :
                                                            <div className="fw-popup__container h-z-index-1 h-width-100p fw-over-fixed-background" style={{width: "100%", maxWidth: "1040px", margin: "15vh auto 50px", position: "fixed", left: "0px", right: "0px", top: "0px"}}>
                                                            <div className="fw-popup__body">
                                                             <div className="b-choose-location-popup h-text-left">
                                                              <div className="b-choose-location-desktop-header qa-b-choose-location-desktop-header" id="choose-location-header">
                                                               <div className="b-choose-location-desktop-header__heading-wrapper">
                                                                <svg className="geo-marker" strokeWidth="0" style={{width: "20px", height: "30px", maxWidth: "20px", maxHeight: "30px", fill: "rgb(112, 185, 63)", stroke: "inherit"}}>
                                                                 <use xlinkHref="#geo-marker">
                                                                 </use>
                                                                </svg>
                                                                <p className="b-choose-location-desktop-header__heading qa-b-choose-location-desktop-header__heading">
                                                                 {this.state.country == null? "All countries": this.state.country}
                                                                </p>
                                                               </div>
                                                               <div className="b-choose-location-desktop-header__search-wrapper">
                                                                <div className="hide fw-simple-search-input b-choose-location-popup__search-input">
                                                                 <svg className="fw-simple-search-input__icon search" strokeWidth="0" style={{width: "16px", height: "16px", maxWidth: "16px", maxHeight: "16px", fill: "rgb(166, 184, 189)", stroke: "inherit"}}>
                                                                  <use xlinkHref="#search">
                                                                  </use>
                                                                 </svg>
                                                                 <input className="fw-simple-search-input__input fw-simple-search-input__input--middle" placeholder="Start type here" style={{width: "360px"}}/>
                                                                </div>
                                                               </div>
                                                              </div>
                                                              <svg className="b-choose-location-popup__back-icon go-back-arrow" strokeWidth="0" style={{width: "16px", height: "16px", maxWidth: "16px", maxHeight: "16px", fill: "rgb(166, 184, 189)", stroke: "inherit", display: "none"}} tabindex="0">
                                                               <use xlinkHref="#go-back-arrow">
                                                               </use>
                                                              </svg>
                                                              <div className="b-region-list" style={{display: "block", columnCount: "3"}}>
                                                               <div className="b-region-list__wrapper">

                                                                <div className="hide b-region-item">
                                                                 <span className="b-region-item__name qa-b-region-item__name" tabindex="0">
                                                                  {this.state.country == null? "All countries": this.state.country}
                                                                 </span>
                                                                 <span className="hide b-region-item__adv-count qa-b-region-item__adv-count">
                                                                  total
                                                                 </span>
                                                                </div>
                                                                {
                                                                    this.state.countries.map((country, index) => (
                                                                        <div key={country.id} className="b-region-item">
                                                                        <a href={countryLink(country.name)} className="b-region-item__name qa-b-region-item__name" tabindex="0">
                                                                         {country.name}
                                                                        </a>
                                                                        <span className="hide b-region-item__adv-count qa-b-region-item__adv-count">
                                                                         total
                                                                        </span>
                                                                       </div>
                                                                    ))
                                                                }
                                                            
                                                               </div>
                                                              </div>
                                                             </div>
                                                            </div>
                                                           </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-xs-12">
                                                    <form onSubmit={this.handleSearch} className="input-group input-group-lg fw-search--rounded" style={{height: "56px"}}>
                                                            <input style={{height: "56px"}} autoComplete="off" type="text"
                                                                        className="form-control"
                                                                        name="search"
                                                                        placeholder="Enter your search..."
                                                                        onChange={this.handleChange}/>
                                                            <span onClick={this.handleSearch} type="submit" style={{cursor: "pointer", height: "56px", background: "#FFA010", borderColor: "#FFA010"}} className="input-group-addon">
                                                                <div onClick={this.handleSearch} className="fw-search__icon">
                                                                    <svg onClick={this.handleSearch} className="loupe-2" strokeWidth="0" style={{width: "16px", height: "16px",maxWidth: "16px",maxHeight: "16px",fill: "rgb(255, 255, 255)",stroke: "inherit"}}>
                                                                        <use xlinkHref="#loupe-2">
                                                                        </use>
                                                                    </svg>
                                                                </div>
                                                            </span>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <img alt="girls" className="b-main-page-header__img-girls" src="/public/res/images/static/girls.png" />
                                    </div>
                                </div>
                            </div>
                            <div className="container">
                                <ul className="goods-cat-tab nav-tab md-hide-up nav row" role="tablist">
                                    <li className="nav-item active col-xs-6">
                                        <a className="nav-link" id="goods-tab" data-toggle="tab" href="#goods" role="tab" aria-controls="goods" aria-selected="true">Trending goods</a>
                                    </li>
                                    <li class="nav-item col-xs-6">
                                        <a className="nav-link" id="categories-tab" data-toggle="tab" href="#categories" role="tab" aria-controls="categories" aria-selected="false">Categories</a>
                                    </li>
                                </ul>
                                <div className="row tab-content">
                                    <div id="categories" className="md-block-up tab-pane fade b-main-page-categories-wrapper col-xs-12 col-sm-12 col-md-3 b-main-page-categories-wrapper--desktops">
                                        <div className="b-fixed-element-outer">
                                            <div className="b-fixed-element b-fixed-element-static" style={{ left: "0px", bottom: "auto", top: "71px"}}>
                                                <div className="h-mb-15">
                                                    <div className="qa-category-tree b-categories-listing-wrapper h-mt-0 h-mb-0">
                                                        <div className="b-categories-listing-outer">
                                                            <div onMouseLeave={this.clearSubCats} className="b-categories-listing-inner b-categories-listing-inner--small-box-shadow">
                                                                <div className="b-categories-listing__item b-categories-listing__parents">
                                                                    <div id="side_bar_scroll" className="b-categories-listing__item__inner">
                                                                        <div>
                                                                            <div id="cat-up" onClick={this.handleClick} data-source="up" style={{display: "none"}} className="sm-hide-down b-scrolling-helper b-scrolling-helper--top">
                                                                                <svg data-source="up" className="up" style={{width: "16px", height: "16px", maxWidth: "16px", maxHeight: "16px", fill: "rgb(128, 128, 128)", stroke: "inherit"}}>
                                                                                    <use data-source="up" xlinkHref="#up"></use>
                                                                                </svg>
                                                                            </div>
                                                                            <div>

                                                                                {
                                                                                    this.state.cats.map((cat, index) => (
                                                                                    <Link onMouseEnter={this.setSubCat} key={index} to={catLink(cat.name)} className={"b-categories-item h-ph-10 b-categories-item--item-alt qa-category-parent-item cat_and_sub_"+cat.id} data-index={index} data-id={cat.id}>
                                                                                        <span className="b-categories-item--outer" data-index={index} data-id={cat.id}>
                                                                                            <span className="h-flex-center" data-index={index} data-id={cat.id}>
                                                                                                <svg className={"cat-"+catIconName(cat.name)} style={{ width: "32px", height: "32px", maxWidth: "32px", maxHeight: "32px", fill: "rgb(114, 183, 71)", stroke: "inherit" }} data-index={index} data-id={cat.id}>
                                                                                                    <use xlinkHref={"#cat-"+catIconName(cat.name)} data-index={index} data-id={cat.id}></use>
                                                                                                </svg>
                                                                                                <span className="b-categories-item--inner" data-index={index} data-id={cat.id}>
                                                                                                    <span className="qa-category-parent-name b-category-parent-name" data-index={index} data-id={cat.id}>{cat.name}</span>
                                                                                                    <span className="hide b-list-category-stack__item-link--found b-black" data-index={index} data-id={cat.id}>
                                                                                                        <span data-index={index} data-id={cat.id}>115,215 ads</span>
                                                                                                    </span>
                                                                                                </span>
                                                                                            </span>
                                                                                            <svg className="sm-hide-down next" style={{ width: "10px", height: "10px", maxWidth: "10px", maxHeight: "10px", fill: "rgb(48, 58, 75)", stroke: "inherit" }}>
                                                                                                <use xlinkHref="#next"></use>
                                                                                            </svg>
                                                                                        </span>
                                                                                    </Link>
                                                                                    ))
                                                                                }

                                                                            </div>
                                                                            <div id="cat-down" onClick={this.handleClick} data-source="down" className="sm-hide-down b-scrolling-helper b-scrolling-helper--bottom">
                                                                                <svg data-source="down" className="down" style={{ width: "16px", height: "16px", maxWidth: "16px", maxHeight: "16px", fill: "rgb(128, 128, 128)", stroke: "inherit" }}>
                                                                                    <use xlinkHref="#down" data-source="down"></use>
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className={"sm-hide-down qa-categories-sub-tree b-categories-listing__item b-categories-listing__childes"+(this.state.sub_cats.length == 0? " hide":"")}>
                                                                    <div className="b-categories-listing__item b-categories-listing__parents">
                                                                        <div id="side_bar_scroll_sub" className="b-categories-listing__item__inner">
                                                                            <div>
                                                                                <div id="scat-up" onClick={this.handleClick} data-source="sup" className="b-scrolling-helper b-scrolling-helper--top">
                                                                                    <svg data-source="sup" className="up" style={{width: "16px", height: "16px", maxWidth: "16px", maxHeight: "16px", fill: "rgb(128, 128, 128)", stroke: "inherit"}}>
                                                                                        <use data-source="up" xlinkHref="#up">
                                                                                        </use>
                                                                                    </svg>
                                                                                </div>
                                                                                <div className="b-categories-listing__item__inner">
                                                                                    {
                                                                                        this.state.sub_cats.map((sCat, index) => (
                                                                                            <Link to={catLink(sCat.name)} key={"sub_cat_"+index} className={"b-categories-item h-ph-10 b-categories-item--item-alt qa-category-sub-item cat_and_sub_"+this.state.cat_id} data-index={index} data-id={this.state.cat_id}>
                                                                                                <span className="b-categories-item--outer" data-index={index} data-id={this.state.cat_id}>
                                                                                                    <span className="h-flex-center" data-index={index} data-id={this.state.cat_id}>
                                                                                                        <span className="b-categories-item--inner" data-index={index} data-id={this.state.cat_id}>
                                                                                                            <span className="qa-category-parent-name b-category-parent-name" data-index={index} data-id={this.state.cat_id}>
                                                                                                                {sCat.name}
                                                                                                            </span>
                                                                                                            <span className="hide b-list-category-stack__item-link--found b-black" data-index={index} data-id={this.state.cat_id}>
                                                                                                                <span data-index={index} data-id={this.state.cat_id}>
                                                                                                                    153,808 ads
                                                                                                                </span>
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </span>
                                                                                            </Link>
                                                                                        ))
                                                                                    }
                                                                                </div>
                                                                                <div id="scat-down" onClick={this.handleClick} data-source="sdown" className="b-scrolling-helper b-scrolling-helper--bottom">
                                                                                    <svg data-source="sdown" className="down" style={{width: "16px", height: "16px", maxWidth: "16px", maxHeight: "16px", fill: "rgb(128, 128, 128)", stroke: "inherit"}}>
                                                                                        <use data-source="sdown" xlinkHref="#down">
                                                                                        </use>
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="b-categories-listing--fixed-background" style={{ display: "none" }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="goods" className="md-block-up tab-pane fade show active in b-main-page__main-section-wrapper col-xs-12 col-sm-12 col-md-9">
                                        <main>
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
                                                ""
                                            }
                                            {
                                                this.state.products.length > 0?
                                                <div>
                                                        <div className="b-main-page__banners-block h-mb-20 row hidden-xs hidden-sm">
                                                <div className="col-md-9">
                                                    <div className="b-marketing-activities-carousel-wrapper">
                                                        <div className="b-marketing-activities-carousel">
                                                            <div className="VueCarousel">
                                                                <div className="VueCarousel-wrapper">
                                                                    <div className="VueCarousel-inner" style={{ transform: "translate("+(723 - ((this.state.carousel_id + 1) * 723))+"px)", transition: "transform 0.5s ease 0s", flexBasis: "723px", visibility: "visible", height: "auto" }}>
                                                                        {
                                                                            this.state.carousel_images.map((image, index) => (
                                                                                <div key={index} tabIndex="-1" aria-hidden="true" role="tabpanel" className="VueCarousel-slide">
                                                                                    <a href="/about" className="b-marketing-activities-carousel__slide" style={{ backgroundImage: "url("+image+")" }}></a>
                                                                                </div>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div data-v-6b6bd89c="" className="VueCarousel-navigation">
                                                                    <button onClick={this.handleClick} data-source="change-carousel" data-id={this.state.carousel_id - 1} data-v-6b6bd89c="" type="button" aria-label="Previous page" tabIndex="-1" className={this.state.carousel_id > 0?"VueCarousel-navigation-button VueCarousel-navigation-prev" : "VueCarousel-navigation-button VueCarousel-navigation-prev VueCarousel-navigation--disabled"} style={{ padding: "8px", marginRight: "-8px" }}>
                                                                        <svg data-source="change-carousel" data-id={this.state.carousel_id - 1} width="25" height="40" viewBox="0 0 25 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path data-source="change-carousel" data-id={this.state.carousel_id - 1} d="M24.083 4.645L9.19801 19.5625L24.083 34.48L19.5005 39.0625L0.000512874 19.5625L19.5005 0.0624996L24.083 4.645Z" fill="white"></path>
                                                                        </svg>
                                                                    </button>
                                                                    <button onClick={this.handleClick} data-source="change-carousel" data-id={this.state.carousel_id + 1} data-v-6b6bd89c="" type="button" aria-label="Next page" tabIndex="0" className={this.state.carousel_id < this.state.carousel_images.length - 1?"VueCarousel-navigation-button VueCarousel-navigation-next" : "VueCarousel-navigation-button VueCarousel-navigation-next VueCarousel-navigation--disabled"} style={{ padding: "8px", marginLeft: "-8px" }}>
                                                                        <svg data-source="change-carousel" data-id={this.state.carousel_id + 1} width="25" height="39" viewBox="0 0 25 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path data-source="change-carousel" data-id={this.state.carousel_id + 1} d="M0.916992 34.4175L15.802 19.5L0.916992 4.5825L5.49949 0L24.9995 19.5L5.49949 39L0.916992 34.4175Z" fill="white"></path>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                                <div data-v-04ae2528="" className="VueCarousel-pagination">
                                                                    <div data-v-04ae2528="" role="tablist" className="VueCarousel-dot-container" style={{ marginTop: "20px" }}>
                                                                        <button data-v-04ae2528="" aria-hidden="false" role="tab" title="Item 0" value="Item 0" aria-label="Item 0" aria-selected="true" className="VueCarousel-dot VueCarousel-dot--active" style={{ marginTop: "20px", padding: "10px", width: "10px", height: "10px", backgroundColor: "white" }}></button>
                                                                        <button data-v-04ae2528="" aria-hidden="false" role="tab" title="Item 1" value="Item 1" aria-label="Item 1" aria-selected="false" className="VueCarousel-dot" style={{ marginTop: "20px", padding: "10px", width: "10px", height: "10px", backgroundColor: "rgba(0, 0, 0, 0.5)" }}></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    {
                                                        this.props.user?
                                                        <a href="/sell">
                                                            <div className="b-post-advert-banner b-main-page__post-advert-banner">
                                                                <p className="b-post-advert-banner__heading">Got something to sell?</p>
                                                                <button className="b-post-advert-banner__button">
                                                                    <div className="b-post-advert-banner__button_inner"></div>
                                                                </button>
                                                                <p className="b-post-advert-banner__bottom-text">Post an advert for free!</p>
                                                            </div>
                                                        </a>
                                                        :
                                                        <Link to="/login">
                                                            <div className="b-post-advert-banner b-main-page__post-advert-banner">
                                                                <p className="b-post-advert-banner__heading">Got something to sell?</p>
                                                                <button className="b-post-advert-banner__button">
                                                                    <div className="b-post-advert-banner__button_inner"></div>
                                                                </button>
                                                                <p className="b-post-advert-banner__bottom-text">Post an advert for free!</p>
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <h3 className="sm-hide-down b-listing-cards-title">Trending ads</h3>
                                                <div className="row">
                                                    {
                                                        this.state.products.map((product, index) => (
                                                            <div key={index} className="col-xs-6 col-sm-3 h-mb-15">
                                                            <div className="fw-card qa-fw-card b-trending-card h-height-100p">
                                                                <Link to={productLink(product.title, product.id)} className="">
                                                                    <div className="fw-card-media qa-fw-card-media" style={{ backgroundColor: "rgb(255, 255, 255)", backgroundImage: 'url('+product.photos.split(",")[0]+')' }}>
                                                                        {
                                                                            product.sponsored?
                                                                            <div className="b-trending-card__boosted-label h-flex-center">{PAID_AD_NAME}</div>
                                                                            :
                                                                            ""
                                                                        }
                                                                        <div className="b-trending-card__counter">{product.photos.split(",").length}</div>
                                                                    </div>
                                                                    <div className="fw-card-content qa-fw-card-content">
                                                                        <div className="b-trending-card__title">{product.title}</div>
                                                                        <div className="b-trending-card__price" dangerouslySetInnerHTML={{__html: product.currency_symbol + " " + commaNum(product.price)}}></div>
                                                                        <div className="fw-card-content-icon">
                                                                            <button type="button" className="hide fw-button qa-fw-button fw-button--type-success fw-button--size-little fw-button--circle fw-button--has-icon">
                                                                                <span className="fw-button__content">
                                                                                    <svg strokeWidth="0" className="favorite-stroke" style={{ width: "24px", height: "24px", maxWidth: "24px", maxHeight: "24px", fill: "rgb(112, 185, 63)", stroke: "inherit" }}>
                                                                                        <use xlinkHref="#favorite-stroke"></use>
                                                                                    </svg>
                                                                                </span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                                </div>
                                                :
                                                ""
                                            }
                                        </main>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div onClick={this.toggleCountries} className={this.state.countries_visible?"fw-fixed-background":"fw-fixed-background hide"}></div>
                </div>

        )
    }
}

export default Landing