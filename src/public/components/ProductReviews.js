import React, { Component } from "react"
import { Link } from "react-router-dom"
import { API_ROOT, SERVER_ADDR, ERROR_NET_UNKNOWN, NO_PROFILE_PHOTO_IMAGE } from "../utils/Constants"
const browser = require("../utils/Browser")
var dateFormat = require('dateformat');


class ProductReviews extends Component {
    constructor() {
        super()
        this.state = {
          product: {},
          reviews_data: {reviews: []}
        }

        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
      var pathname = this.props.location.pathname
      pathname = pathname.endsWith("/")? pathname.substring(0, pathname.length - 1) : pathname
      const paths = pathname.split("/")
      const id = parseInt(paths[paths.length - 1])
      console.log("productId", id)

      //get the product
      browser.axios.get(API_ROOT + "products/details?id="+id)
      .then(response => {
        if(response.data.details) {
          this.setState({product: response.data.details})

        } else {
          this.props.history.push('/')
        }
        //get the reviews
        browser.axios.get(API_ROOT + "reviews?product_id="+id)
        .then(response => {
          if(response.data.reviews) {
            this.setState({reviews_data: response.data})

          }
        })
        .catch(e => {
          console.log("No reviews from response:", response.data, API_ROOT + "reviews")
        })
      })
      .catch(e => {
        console.log("No reviews from response:", response.data, API_ROOT + "reviews")
      })
    }

    handleClick = e => {
      console.log("clickDetected")
      var dataType = e.target.getAttribute("data-type")
      console.log("clickdDataType", dataType)
      if(dataType == "create-review") {
        console.log("clickDataType is", "create-review")
        this.props.history.push("/create-review/"+this.state.product.id)
      }
    }

    render () {
        return (
            <div className="h-bg-grey h-pb-15">
            <div>
             <div className="container">
              <div className="row center-xs h-pt-30">
               <div className="bc-opinions-left-container">
                <div className="b-opinions-card">
                 <div className="b-opinions-card__title">
                  Feedbacks&nbsp;
                  <div className="b-bouncing-loader-wrapper" data-v-67bc6bc4="" style={this.state.product.id?{display: "none"}:{display: "block"}}>
                    <div className="b-bouncing-loader spinner-absolute h-pt-20" style={{bottom: "0px"}}>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                  {
                    this.state.product.id?
                    <Link to={"/seller/"+this.state.product.user_id}>
                      {this.state.product.poster_firstname + " " +this.state.product.poster_lastname}
                    </Link>
                    :
                    ""
                  }
                 </div>

                 {
                   this.state.product && this.state.product.id?
                   <div>
                       <div className="b-tab-feedback__summary b-tab-feedback__summary--white">
                       <div className="b-tab-feedback__summary--reactions hide">
                        <div className="b-tab-feedback__summary--reactions-item b-tab-feedback__summary--reactions-item-positive">
                         <svg className="positive" strokeWidth="0" style={{width: "34px", height: "34px", maxWidth: "34px", maxHeight: "34px", fill: "rgb(112, 185, 63)", stroke: "inherit"}}>
                          <use xlinkHref="#positive">
                          </use>
                         </svg>
                         <br/>
                          <span>
                           Positive (1)
                          </span>
                        </div>
                        <div className="b-tab-feedback__summary--reactions-item b-tab-feedback__summary--reactions-item-neutral">
                         <svg className="neutral" strokeWidth="0" style={{width: "34px", height: "34px", maxWidth: "34px", maxHeight: "34px", fill: "rgb(241, 173, 78)", stroke: "inherit"}}>
                          <use xlinkHref="#neutral">
                          </use>
                         </svg>
                         <br/>
                          <span>
                           Neutral (0)
                          </span>
                        </div>
                        <div className="b-tab-feedback__summary--reactions-item b-tab-feedback__summary--reactions-item-negative">
                         <svg className="negative" strokeWidth="0" style={{width: "34px", height: "34px", maxWidth: "34px", maxHeight: "34px", fill: "rgb(255, 100, 78)", stroke: "inherit"}}>
                          <use xlinkHref="#negative">
                          </use>
                         </svg>
                         <br/>
                          <span>
                           Negative (1)
                          </span>
                        </div>
                       </div>
                       <div className="b-tab-feedback__summary--copy-link">
                        <button onClick={this.handleClick} data-type="create-review" className="h-width-100p h-bold fw-button qa-fw-button fw-button--type-success fw-button--size-medium" type="button">
                         <span className="fw-button__content" data-type="create-review">
                          <span className="fw-button__slot-wrapper" data-type="create-review">
                           Leave Feedback
                          </span>
                         </span>
                        </button>
                       </div>
                      </div>
                      {
                        this.state.reviews_data.reviews.map((review, index) => (
                         <div className="b-feedback-item" key={review.id}>
                         <div className="b-feedback-item--user">
                          <div className="b-feedback-item--logo" style={review.writer_profile_photo.length == 0?{backgroundImage: 'url('+NO_PROFILE_PHOTO_IMAGE+')'}:{backgroundImage: 'url('+review.writer_profile_photo+')'}}>
                          </div>
                          <div className="b-feedback-item--profile-info">
                           <span className="b-feedback-item--profile-info-name">
                            {review.writer_firstname + " " + review.writer_lastname}
                           </span>
                           <span className="b-feedback-item--profile-info-status b-feedback-item--profile-info-status--negative">
                            {review.weight < 0? "Negative" : review.weight > 0? "Positive" : "Neutral"}
                           </span>
                          </div>
                         </div>
                         <div className="b-feedback-item--comment-container">
                          <div className="b-feedback-item--comment">
                           {review.body}
                           <br/>
                          </div>
                         </div>
                         <div className="b-feedback-item--date">
                          {dateFormat(new Date(review.created), "mm-yyyy")}
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
               <div className="b-opinions-card-info">
                <div className="b-feedback-info-card">
                 <svg className="without-feedback" strokeWidth="0" style={{width: "96px", height: "84px", maxWidth: "96px", maxHeight: "84px", fill: "rgb(112, 185, 63)", stroke: "inherit"}}>
                  <use xlinkHref="#without-feedback">
                  </use>
                 </svg>
                 <br/>
                  Your feedback is very important for the seller review. Please, leave the honest review to help other buyers and the seller in the customer attraction.
                 
                </div>
               </div>
              </div>
             </div>
            </div>
           </div>
        )
    }
}

export default ProductReviews