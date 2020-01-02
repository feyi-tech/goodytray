import React, { Component } from "react"
import { SITE_TITLE, API_ROOT, PAID_AD_NAME, STATIC_IMAGES_CLIENT_DIR } from "../utils/Constants"
import { productLink, catLink, catIconName, countryLink } from "../utils/LinkBuilder"
import { commaNum, id, remove } from "../utils/Funcs"
import queryString from 'querystring'
import { Link } from "react-router-dom"

const browser = require("../utils/Browser")

class SearchPage extends Component {
    constructor() {
        super()
        this.state = {
          errors: {},
          products: [],
          loading_products: false,
          cats: [],
          sub_cats: [],
          countries: [],
          states: [],
          cities: [],
          input_attrs: [],
          checkbox_attrs: [],
          select_attrs: [],
          
          cat: -1,
          sub_cat: -1,
          country: -1,
          state: -1,
          city: -1,
          attrs: "",
          price_min: 0,
          max_price: 0,

          result_count: 0
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.applyFilter = this.applyFilter.bind(this)
    }
    handleKeyUp = e => {
        const target = e.target
        const value = e.target.value
        if(!this.state[target.name+"_last_change_time"]) {
            this.state[target.name+"_last_change_time"] = new Date().getTime()
        }
        if(value.length > 0 && new Date().getTime() - this.state[target.name+"_last_change_time"] > 1500) {
            this.checkResultCount()
            this.state[target.name+"_last_change_time"] = new Date().getTime()
        }
    }
    handleChange = e => {
        const target = e.target;
        var value = target.value
        if(e.target.getAttribute("data-type") && e.target.getAttribute("data-type") == "number") {
            value = commaNum(value)
            target.value = value;
        }
        this.state[e.target.name] = value
        this.setState({[e.target.name]: value})
        if(target.getAttribute("data-attr")) {
            console.log("handleChange", "data-attr", target.getAttribute("data-attr"))
            if(target.type != "checkbox" || target.checked) {
                var attrs = this.state.attrs;
                if(!attrs.includes(target.name+":"+target.value)) {
                    if(!attrs.includes(target.name+":") || target.type == "checkbox") {
                        console.log("Attr", "Append")
                        attrs += target.name+":"+target.value + ","

                    } else {console.log("Attr", "Replace");
                        var reg = new RegExp(target.name+"\:[^,]+,")
                        attrs = attrs.replace(reg, target.name+":"+target.value + ",")
                    }
                    this.state.attrs = attrs
                    this.setState({attrs: attrs})
                    this.checkResultCount()
                }
                console.log("ATTRS", this.state.attrs)
            }
        } else {
            switch(target.name) {
                case "cat":
                  this.onCatChanged()
                  this.checkResultCount()
                  break
                case "sub_cat":
                  this.onSubCatChanged()
                  this.checkResultCount()
                  break
                case "country":
                  this.onCountryChanged()
                  this.checkResultCount()
                  break
                case "state":
                  this.onStateChanged()
                  this.checkResultCount()
                  break
            }
        }
    }

    getEndPoint = () => {
        var endpoint = API_ROOT + "products?views_order=1"
        if(this.state.cat > -1)endpoint+="&cat_id="+this.state.cat
        if(this.state.sub_cat > -1)endpoint+="&sub_cat_id="+this.state.sub_cat
        if(this.state.country > -1)endpoint+="&country_id="+this.state.country
        if(this.state.state > -1)endpoint+="&state_id="+this.state.state
        if(this.state.city > -1)endpoint+="&city_id="+this.state.city

        var priceMin = parseInt(remove([",", "."], this.state.price_min))
        var priceMax = parseInt(remove([",", "."], this.state.price_max))
        if(priceMin > 0)endpoint+="&price_min="+priceMin
        if(priceMax > 0)endpoint+="&price_max="+priceMax

        if(this.state.attrs != null && this.state.attrs.length > 0) {
            var attrs = this.state.attrs.split(",")
            for(var i = 0; i < attrs.length; i++) {
                if(attrs[i].trim().length > 0) {
                    endpoint+="&attr="+encodeURIComponent(attrs[i].trim())
                }
            }
        }
        return endpoint
    }

    checkResultCount = () => {
        var endpoint = this.getEndPoint()+"&count_only=1"
        console.log("Endpoint", endpoint)
        this.setState({checking_products: true})
        browser.axios.get(endpoint)
        .then(res => {
            if(res.data && res.data.counts) {
                this.setState({result_count: res.data.counts})

            } else {
                this.setState({result_count: 0})
            }
            this.setState({checking_products: false})
        })
        .catch(e => {
            console.log("checkResultCount", "NetworkError:", e)
            this.setState({result_count: 0})
            this.setState({checking_products: false})
        })
        
    }

    applyFilter = e => {
        e.preventDefault()
        var endpoint = this.getEndPoint()
        this.setState({loading_products: true})
        this.setState({products: []})
        browser.axios.get(endpoint)
        .then(res => {
            if(res.data && res.data.list) {
                this.setState({products: res.data.list})
                this.setState({result_count: res.data.counts})

            } else {
                this.setState({result_count: 0})
            }
            this.setState({loading_products: false})
        })
        .catch(e => {
            console.log("checkResultCount", "NetworkError:", e)
            this.setState({result_count: 0})
            this.setState({loading_products: false})
        })

    }

    resetCustomInputs() {
        this.setState({input_attrs: []})
        this.setState({select_attrs: []})
        this.setState({checkbox_attrs: []})
    }

    onCountryChanged() {
        this.setState({states_loading: true})
        this.setState({states: []})
        this.setState({cities: []})
        browser.axios.get(API_ROOT + "states?cid="+this.state.country)
        .then(response => {
          this.setState({states: response.data.states})
          this.setState({states_loading: false})
        })
      }
    
    onStateChanged() {
        this.setState({cities_loading: true})
        this.setState({cities: []})
        browser.axios.get(API_ROOT + "cities?sid="+this.state.state)
        .then(response => {
          this.setState({cities: response.data.cities})
          this.setState({cities_loading: false})
        })
    }

    onCatChanged () {
        this.resetCustomInputs()
        this.setState({sub_cat_loading: true})
        var list = this.state.cats[this.state.cat].sub_cats
        this.state.sub_cats = list
        this.setState({sub_cats: list})
        this.setState({sub_cat_loading: false})
      }
    
      onSubCatChanged () {
        this.resetCustomInputs()
        this.setState({attrs_loading: true})
        browser.axios.get(API_ROOT + "attrs?scid="+this.state.sub_cat)
        .then(response => {
          console.log("response.data.attrs: "+JSON.stringify(response.data.attrs))
          const attrs = response.data.attrs
          if(attrs != null && attrs.length > 0) {
            const input_attrs = []
            const select_attrs = []
            const checkbox_attrs = []
            for(var i = 0; i < attrs.length; i++) {
              if(attrs[i].input_type.startsWith("input")) {
                input_attrs.push(attrs[i])
    
              } else if(attrs[i].input_type.startsWith("select")) {
                select_attrs.push(attrs[i])
              
              } else if(attrs[i].input_type.startsWith("check_box")) {
                checkbox_attrs.push(attrs[i])
              
              }
            }
            console.log("input_attrs", input_attrs)
            console.log("select_attrs", select_attrs)
            console.log("checkbox_attrs", checkbox_attrs)
    
            this.setState({input_attrs: input_attrs})
            this.setState({select_attrs: select_attrs})
            this.setState({checkbox_attrs: checkbox_attrs})
          }
          this.setState({attrs_loading: false})
        })
    }

    handleClick = e => {
        const source = e.target.getAttribute("data-source")
        if(source == "down") {
            console.log("down scroll")
            id("side_bar_scroll").scroll()
        }
    }
    
    componentDidMount() {
        console.log("mounted")
        var pathname = this.props.location.pathname;
        var sect, sub_sect = null
        console.log("pathname: ", pathname)
        var sectMatches = pathname.match(/\/search\/(cat|sub_cat|country|state|city|)\/([^\/]+)/i)
        console.log("sectMatches: ", sectMatches)

        var apiPath = "products/?"
        if(sectMatches != null) {
            apiPath += sectMatches[1].toLowerCase()+"_name="+sectMatches[2].toLowerCase();

        } else {
            const queryValues = queryString.parse(this.props.location.search.substring(1))
            console.log("SearchPage Queries", queryValues)
            var t = {d: "lll", p: 9}
            var i = 0;

        }
        document.title = SITE_TITLE
        
        
        this.setState({loading_products: true})

        //get cats & sub cats
        browser.axios.get(API_ROOT + "products/cats_and_sub_cats")
        .then(resp => {
            if(resp && resp.data) {
                this.setState({cats: resp.data})
            }
        })
        
        //get countries
        browser.axios.get(API_ROOT + "countries")
        .then(resp => {
            if(resp && resp.data && resp.data.countries) {
                this.setState({countries: resp.data.countries})
            }
        })

        //get products
        browser.axios.get(API_ROOT + apiPath)
        .then(resp => {
            if(resp && resp.data && resp.data.list) {
                this.setState({products: resp.data.list})
            }
            this.setState({loading_products: false})
        })
    }

    render() {
        return (
                <div className="h-bg-grey  h-pb-15">
                    <div>
                        <div className="b-main-page">
                                
                            <div className="container">
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
                                <div className="row">
                                <div className="b-filters-wrapper col-xs-12 col-md-3" data-v-4e3f0b28="">
 

 <div className="h-mb-15 h-ph-15 b-list-category-stack" style={{marginTop: "20px"}} data-v-4e3f0b28="">
  <div className="" data-v-4e3f0b28="" style={{display: "none"}}>
   <div className="b-bouncing-loader" style={{bottom: "0px"}}>
    <div>
    </div>
    <div>
    </div>
    <div>
    </div>
   </div>
  </div>

  <form onSubmit={this.applyFilter} className="qa-filters-component b-filters red-border" data-v-4e3f0b28="">
   <div className={"b-filters__loader"+(this.state.loading_products || this.state.checking_products?" active":"")}>
    <div style={{display: "block"}}>
     <div className="b-bouncing-loader" style={{bottom: "0px"}}>
      <div>
      </div>
      <div>
      </div>
      <div>
      </div>
     </div>
    </div>
   </div>
   <ul className="added-set-list">
   </ul>
   <div className="qa-filters-form">

    <div className="b-form-section">
        <div data-v-2f9b1610="">
         <div className=" b-form-section h-mb-15 qa-choose-category">
          <label className="b-form-section__title">
           Country
          </label>
          <div className="form-group">
            <select className="form-control" name="country" value={this.state.country} onChange={this.handleChange}>
              <option value="-1">--- Choose country ---</option>
              {this.state.countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </div>
         </div>
        </div>
    </div>

    <div className="b-form-section">
        <div id="state-section" data-v-2f9b1610="" 
        className={this.state.states_loading?
            "hide loading-section":this.state.country == -1?
            "hide":""}>
         <div className=" b-form-section h-mb-15 qa-choose-category">
          <label className="b-form-section__title">
           State
          </label>
          <div className="form-group">
            <select className="form-control" name="state" value={this.state.state} onChange={this.handleChange}>
              <option value="-1">--- Choose state ---</option>
              {this.state.states.map(state => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
          </div>
         </div>
        </div>
    </div>

    <div className="b-form-section">
        <div id="state-section" data-v-2f9b1610="" 
        className={this.state.cities_loading?
            "hide loading-section":this.state.country == -1 || this.state.state == -1 || this.state.cities == null || this.state.cities.length == 0?
            "hide":""}>
         <div className=" b-form-section h-mb-15 qa-choose-category">
          <label className="b-form-section__title">
           City
          </label>
          <div className="form-group">
            <select className="form-control" name="city" value={this.state.city} onChange={this.handleChange}>
              <option value="-1">--- Choose city ---</option>
              {this.state.states.map(state => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
          </div>
         </div> 
        </div>
    </div>

    <div className="b-form-section">
        <div id="cat-section" data-v-2f9b1610="">
         <div className=" b-form-section h-mb-15 qa-choose-category">
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
          </div>
         </div>
        </div>
    </div>

    <div className="b-form-section">
        <div id="state-section" data-v-2f9b1610="" 
        className={this.state.sub_cat_loading?
            "hide loading-section":this.state.cat == -1?
            "hide":""}>
         <div className=" b-form-section h-mb-15 qa-choose-category">
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
          </div>
         </div>
        </div>
    </div>

    <div className="b-form-section">
        <div id="custom-section" data-v-2f9b1610=""className={this.state.sub_cat_loading || this.state.attrs_loading?
            "hide loading-section":this.state.cat == -1 || this.state.sub_cat == -1 || 
            (this.state.input_attrs.length == 0 && this.state.select_attrs.length == 0 && this.state.checkbox_attrs.length == 0)?
            "hide":""}>

          {this.state.input_attrs.map(attr => (
            <div key={"custom-"+attr.key} className="b-form-section h-mb-15">
              <label className="b-form-section__title">
                {attr.key}
              </label>
              <div className="form-group">
                <input data-attr="yes" name={attr.key} onChange={this.handleChange} type="text" className="form-control" />
              </div>
            </div>
          ))}

          {this.state.select_attrs.map(attr => (
            <div key={"custom-"+attr.key} className="b-form-section h-mb-15">
              <label className="b-form-section__title">
                {attr.key}
              </label>
              <div className="form-group">
                <select data-attr="yes" className="form-control" name={attr.key} onChange={this.handleChange}>
                  <option>--- Select {attr.key} ---</option>
                  {attr.values.map(value => (
                    <option key={"custom-"+attr.key+value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {this.state.checkbox_attrs.map(attr => (
            <div key={"custom-"+attr.key} className="b-form-section h-mb-15">
              <label className="b-form-section__title">
                {attr.key}
              </label>
              <div classname="b-form-section__elem-wrapp">
                {attr.values.map(value => (
                  <div key={"custom-"+attr.key+value} className="b-form-section__row">
                    <div className="qa-checkbox b-form-section h-mb-0">
                    <input data-attr="yes" onChange={this.handleChange} name={attr.key} value={value} id={"custom-"+attr.key+"-"+value} type="checkbox" className="b-form-section__checkbox"/> 
                      <label for={"custom-"+attr.key+"-"+value} className="qa-description-label">{value}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
        </div>
    </div>
    
    <div className="b-form-section b-input-range h-mb-15 qa-range-filter">
     <label className="b-form-section__title" for="price">
      Price Range in USD ($)
     </label>
     <div className="h-hflex h-overflow-inherit-f">
      <div className="b-input-range__item-wrap">
       <input onKeyUp={this.handleKeyUp} onChange={this.handleChange} data-type="number" className="h-ph-10 qa-range-filter-price-min" id="price" name="price_min" placeholder="Price min " type="text"/>
      </div>
      <div className="b-input-range__separ">
      </div>
      <div className="b-input-range__item-wrap">
       <input onKeyUp={this.handleKeyUp} onChange={this.handleChange} data-type="number" className="h-ph-10 qa-range-filter-price-max" name="price_max" placeholder="Price max " type="text"/>
      </div>
     </div>
    </div>
   </div>
   <button type="submit" className=" b-filters__submit-btn b-button b-button--primary b-button--border-radius b-button--shadow b-button--size-full h-mt-10">
    Apply Filters ({this.state.result_count})
   </button>
  </form>
 </div>
 <div className="b-fixed-element-outer b-fixed-element-outer--right" data-v-4e3f0b28="">
  <div className="b-fixed-element b-fixed-element-static" style={{right: "0px", transform: "translateY(0px)", bottom: "auto", top: "0px"}}>
   <div className="qa-show-adsense h-iblock" data-v-4e3f0b28="">
    
   </div>
  </div>
 </div>
</div>
                                    <div className="b-main-page__main-section-wrapper col-xs-12 col-md-9">
                                        <main>
                                            {
                                                this.state.products.length > 0?
                                            <div>
                                                <h3 className="b-listing-cards-title">Search/Filter results</h3>
                                                <div className="row">
                                                    {
                                                        this.state.products.map((product, index) => (
                                                            <div className="col-xs-6 col-sm-3 h-mb-15">
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
                                                :
                                                <div className="h-mb-10" style={{marginTop: "20px"}}>
                                                <div className="b-empty-cart box-shadow">
                                                 <div className="h-centerItem">
                                                  <div className="b-empty-cart__info">
                                                   <img alt="" className="h-mb-10 h-rl-15" src={STATIC_IMAGES_CLIENT_DIR+"no_ads.png"}/>
                                                   <p>No result found.<br />Please try widening your search.</p>
                                                  </div>
                                                 </div>
                                                </div>
                                               </div>
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

export default SearchPage