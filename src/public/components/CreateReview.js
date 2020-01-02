import React, { Component } from "react"

class CreateReview extends Component {
    constructor() {
        super()
        this.state = {
          selected_weight: 0,
          rating: 4,
          ratings_text: [
            {key: 0, text: "Successful purchase(you bought the product)"},
            {key: 1, text: "The deal failed(the product didn't meet your expectation)"},
            {key: 2, text: "Can`t reach the seller(by call or by chat)"},
            {key: 3, text: "Successful purchase(you bought the product)"},
            {key: 4, text: "My experience is not listed(Let us no in the feedback)"}
          ]
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {

    }

    handleClick = function (e) {
      const target = e.target;
      if(target.getAttribute("data-weight")) {
        this.setState({selected_weight: target.getAttribute("data-weight")});
      }
    }

    handleChange = (e) => {
      this.setState({[e.target.name]: e.target.value});
    }

    render () {
        return (
            <div className="h-bg-grey h-pb-15">
            <div>
             <div className="container">
              <div className="row center-xs h-pt-30">
               <div className="b-opinions-card">
                <div className="b-opinions-card__title">
                 Leave feedback 
                 <a className="hide" href="/sellerpage-187196">
                  Bibiana O-Onadipe
                 </a>
                </div>
                <div className="b-opinions-card__form">
                 <div className="b-opinions-card__form--rating">
                  <span className="b-opinions-card__form--rating-title">
                   How was your experience?
                  </span>
                  <div className="b-opinions-card__form--rating__container">
                   <div onClick={this.handleClick} data-weight={1} className={"b-opinions-card__form--rating__container--item b-opinions-card__form--rating__container--item-positive"+(this.state.selected_weight==1?" b-opinions-card__form--rating__container--item-active":"")}>
                    <svg data-weight={1} className="positive" strokeWidth="0" style={{width: "24px", height: "24px", maxWidth: "24px", maxHeight: "24px", fill: "rgb(112, 185, 63)", stroke: "inherit"}}>
                     <use xlinkHref="#positive">
                     </use>
                    </svg>
                    <span data-weight={1}>
                     Positive
                    </span>
                   </div>
                   <div onClick={this.handleClick} data-weight={0} className={"b-opinions-card__form--rating__container--item b-opinions-card__form--rating__container--item-neutral"+(this.state.selected_weight==0?" b-opinions-card__form--rating__container--item-active":"")}>
                    <svg data-weight={0} className="neutral" strokeWidth="0" style={{width: "24px", height: "24px", maxWidth: "24px", maxHeight: "24px", fill: "rgb(241, 173, 78)", stroke: "inherit"}}>
                     <use xlinkHref="#neutral">
                     </use>
                    </svg>
                    <span data-weight={0}>
                     Neutral
                    </span>
                   </div>
                   <div onClick={this.handleClick} data-weight={-1} className={"b-opinions-card__form--rating__container--item b-opinions-card__form--rating__container--item-negative"+(this.state.selected_weight==-1?" b-opinions-card__form--rating__container--item-active":"")}>
                    <svg data-weight={-1} className="negative" strokeWidth="0" style={{width: "24px", height: "24px", maxWidth: "24px", maxHeight: "24px", fill: "rgb(255, 100, 78)", stroke: "inherit"}}>
                     <use xlinkHref="#negative">
                     </use>
                    </svg>
                    <span data-weight={-1}>
                     Negative
                    </span>
                   </div>
                  </div>
                  <div className="form-group" style={{maxHeight: "600px"}} tabIndex="-1">
                       <select onChange={this.handleChange} name="rating" className="form-control">
                         <option>Select your experience</option>
                         {
                           this.state.ratings_text.map((rt, i) => (
                            <option key={rt.key} value={rt.key}>{rt.text}</option>
                           ))
                         }
                       </select>
                      </div>
                 </div>
                 <div className="b-opinions-card__form--text">
                  <div className="fw-field-container qa-fw-field-container">
                   <div className="fw-field">
                    <div className="fw-field__content">
                     <label for="">
                      Write a detailed feedback
                     </label>
                     <textarea className="fw-textarea"></textarea>
                    </div>
                   </div>
                  </div>
                  <div className="b-tab-feedback__summary--copy-link">
                   <button className="h-width-100p h-bold fw-button qa-fw-button fw-button--type-success fw-button--size-medium fw-button--disabled" disabled="disabled" type="button">
                    <span className="fw-button__content">
                     <span className="fw-button__slot-wrapper">
                      Send Feedback
                     </span>
                    </span>
                   </button>
                  </div>
                 </div>
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

export default CreateReview