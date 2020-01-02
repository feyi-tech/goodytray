import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { SITE_NAME } from '../utils/Constants'


class CreateTips extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="h-bg-grey h-pb-15">
 <div>
  <div firstLoad="true">
   <div className="b-tips__wrapper">
    <h1 className="b-tips__h1">
     <svg className="light-bulb" style={{width: "16px", height: "22px", maxWidth: "16px", maxHeight: "22px", fill: "inherit", stroke: "inherit", marginBottom: "-2px", marginRight: "8px"}}>
      <use xlinkHref="#light-bulb">
      </use>
     </svg>
        7 Tips how to create an effective ad
    </h1>
    <div className="b-tips__list">
     <p className="h-mt-20 h-mb-30 h-text-center h-font-16">
      If you really want to create an effective ad, it is highly recommended to follow our top <span className="h-bold b-tips__green-color">7 expert’s instructions below:</span>
     </p>
     <div className="h-hflex b-tip__wrapper">
      <div className="b-tip__content-wrapper">
       <img src="/public/res/images/static/tips-attention.png"/>
      </div>
      <div className="b-tip__content-wrapper">
       <div className="h-bold h-font-16 h-mb-5">
        Attention-grabbing title
       </div>
       <div className="h-font-14">
        Use a clear title which includes the name of the item you sell.
       </div>
      </div>
     </div>
     <div className="h-hflex b-tip__wrapper">
      <div className="b-tip__content-wrapper">
       <img src="/public/res/images/static/tips-relevant-price.png"/>
      </div>
      <div className="b-tip__content-wrapper">
       <div className="h-bold h-font-16 h-mb-5">
        Relevant price
       </div>
       <div className="h-font-14">
        Set an appropriate price for your item so that the advert is approved. Comparing price on {SITE_NAME} can help you ensure your item is in line with the current market.
       </div>
      </div>
     </div>
     <div className="h-hflex b-tip__wrapper">
      <div className="b-tip__content-wrapper">
       <img src="/public/res/images/static/tips-detailed-description.png"/>
      </div>
      <div className="b-tip__content-wrapper">
       <div className="h-bold h-font-16 h-mb-5">
        Detailed description
       </div>
       <div className="h-font-14">
        The description of your product must be informative enough and mustn’t contain any false information regarding your product or service.
       </div>
      </div>
     </div>
     <div className="h-hflex b-tip__wrapper">
      <div className="b-tip__content-wrapper">
       <img src="/public/res/images/static/tips-picture.png"/>
      </div>
      <div className="b-tip__content-wrapper">
       <div className="h-bold h-font-16 h-mb-5">
        A picture says a thousand words
       </div>
       <div className="h-font-14">
        The better photos you add, the more attractive your ad looks to the potential buyers and the more calls you receive.
       </div>
      </div>
     </div>
     <div className="h-hflex b-tip__wrapper">
      <div className="b-tip__content-wrapper">
       <img src="/public/res/images/static/tips-answer-calls.png"/>
      </div>
      <div className="b-tip__content-wrapper">
       <div className="h-bold h-font-16 h-mb-5">
        Answer your calls and chats
       </div>
       <div className="h-font-14">
        Indicate correct contact details. Try to respond all the incoming calls or to call back your customers once available.
       </div>
      </div>
     </div>
     <div className="h-hflex b-tip__wrapper">
      <div className="b-tip__content-wrapper">
       <img src="/public/res/images/static/tips-check-location.png"/>
      </div>
      <div className="b-tip__content-wrapper">
       <div className="h-bold h-font-16 h-mb-5">
        Double-check your location and category
       </div>
       <div className="h-font-14">
        It is important to ensure that you post your ad in the right location and category.
       </div>
      </div>
     </div>
     <div className="h-hflex b-tip__wrapper">
      <div className="b-tip__content-wrapper">
       <img src="/public/res/images/static/tips-pay-little.png"/>
      </div>
      <div className="b-tip__content-wrapper">
       <div className="h-bold h-font-16 h-mb-5">
        Pay a little, get a lot
       </div>
       <div className="h-font-14">
        Sometimes, an ad might just need a little boost to receive the exposure it deserves. Free classifieds are a great start, but if you are motivated towards increasing exposure, consider upgrading your free advertisement with premium services.
       </div>
      </div>
     </div>
    </div>
   </div>
   <div className="b-tips__button-wrapper">
    <a className="b-button b-button--primary b-button--border-radius" href="/sell">
     Sell now
    </a>
   </div>
  </div>
 </div>
</div>
        )
    }
}

export default CreateTips