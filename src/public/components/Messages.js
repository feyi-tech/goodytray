import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { NO_PROFILE_PHOTO_IMAGE, API_ROOT, ERROR_NET_UNKNOWN, STATIC_IMAGES_CLIENT_DIR, SITE_NAME, PRODUCTS_PHOTOS_CLIENT_DIR } from '../utils/Constants'
import { commaNum, truncText, profilePhoto, modalAlert, dataCall, id } from '../utils/Funcs'
const browser = require("../utils/Browser")
import $ from 'jquery';

class Messages extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: props.user,
            page: 0,
            messages: [],
            selected: null
        }
        this.handleMessageView = this.handleMessageView.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleBackPressed = this.handleBackPressed.bind(this)
        this.dataCall = dataCall.bind(this)
    }

    componentDidMount() {
        console.log("Messages", "Mounted", Math.random() * 10)
        const id = this.props.match.params.id
        if(id) {
            this.state.recipient_id = id
            this.loadMessages()
            this.loadMessage(id)

        } else {
            this.loadMessages()
        }
    }

    loadMessages = () => {
        var page = this.state.page + 1
        this.setState({loading: true})
        browser.axios.get(API_ROOT + "messages/threads?page="+page)
        .then(res => {
            console.log('DATA', res.data.success)
            var messages= []
            if(res.data.success) {
                this.setState({messages: this.state.messages.concat(res.data.list)})
                this.setState({page: page})
                for(var i = 0; i < this.state.messages.length; i++) {
                    if(this.state.messages[i].from_id == this.state.recipient_id || this.state.messages[i].to_id == this.state.recipient_id) {
                        const message = this.state.messages[i]
                        var recipient = {
                            id: this.state.recipient_id,
                            firstname: message.user_firstname,
                            lastname: message.user_lastname,
                            profile_photo: message.user_photo,
                            message: message
                        }
                        this.setState({recipient: recipient})
                        console.log('DATA', 'REC', this.state.recipient)
                    }
                }
                console.log('DATA', 'SUX', this.state.messages)
                //this.setState({loading: false})

            } else {
                console.log('DATA', 'FA', this.state.messages)
            }
            this.setState({loading: false})
        })
        .catch(e => {
            this.setState({loading: false})
        })
    }

    handleMessageView = (e) => {
        const index = e.target.getAttribute("data-index")
        console.log("handleMessageView", "index = "+index, "message = "+this.state.messages[index])
        var recipientId = this.state.messages[index].from_id != this.state.user.id?this.state.messages[index].from_id:this.state.messages[index].to_id
        this.props.history.push("/messages/"+recipientId)
        this.loadMessage(recipientId)
    }

    loadMessage = (id) => {
        console.log("LoadMessage", id)
        this.setState({selected: "loading"})
        
        
        browser.axios.get(API_ROOT + "messages/threads/"+id)
        .then(res => {
            console.log('DATA2', res.data.success)
            var selected = {user_id: id}
            selected.threads = []
            if(res.data.success) {
                selected.threads = res.data.list
                this.setState({selected: selected})
                console.log('DATA2', 'SUX', this.state.selected)

            } else {
                console.log('DATA2', 'FA', this.state.messages)
                this.setState({selected: null})
            }
            console.log("MMM", this.state.recipient.message)
        })
        .catch(e => {
            this.setState({selected: null})
        })
    }

    dateNovComma2Year(time) {
        return "November, 2 2019"
    }

    date16R45(time) {
        return "16:45"
    }

    handleBackPressed = (e) => {
        this.props.history.goBack()
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault()
        if(this.state.msg && this.state.msg.length > 0) {
            const thread = {created: 78, body: this.state.msg, seen: -1}
            var selected = this.state.selected
            selected.threads.push(thread)
            this.setState({selected: selected})
            this.setState({msg: ""})
            //id("msgScrollPane").scrollTo(id("msgScrollPane").scrollHeight)
            browser.axios.post(API_ROOT + "messages/send", {
                text: thread.body,
                to_id: this.state.recipient.id,
                product_id: this.state.recipient.message.product_id
            })
            .then(res => {
                const data = res.data
                if(data.auth_required) {
                    this.location.href = "/login"

                } else if(data.status == 0 && data.message) {
                    modalAlert(data.message, null)

                } else if(data.status == 1 || data.success) {
                    var selected = this.state.selected
                    selected.threads[selected.threads.length - 1].seen = 0
                    this.setState({selected: selected})
                    console.log("SELECTED", this.state.selected)
                }
            })
            .catch(e => {
                modalAlert(ERROR_NET_UNKNOWN, null)
            })
        }
    }

    render() {
        return (

<div style={{minHeight: "200px"}}>
    {
    this.state.loading?
    <div className="container" style={{height: "80vh"}}>
    <div className="b-bouncing-loader-wrapper" style={{display: "block"}}>
        <div className="b-bouncing-loader spinner-absolute h-pt-20">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    </div>
    :
 <div className="container">
  <div className="qa-messenger-wrapper b-messenger-wrapper">
   <div className={"b-messenger-sidebar"+(this.state.selected?" sm-hide-down":"")}>
    <header className="b-messenger-header qa-messenger-rooms-header">
     <div className="b-messenger-header-title">
      My messages
     </div>
     <div className="h-pos-rel">
      <div className="b-messenger-context-menu-wrapper">
      </div>
     </div>
    </header>
    <div className="h-bg-white qa-messenger-rooms-list b-messenger-room-list">
     {
         this.state.messages.length == 0?
         <div className="b-empty-cart__info" style={{display: "block", width: "200px", margin: "10px auto"}}>
             <i class="fa fa-envelope fa-5x"></i>
            <p>You have no messages.</p>
         </div>
         :
         this.state.messages.map((message, index) => (
            <div onClick={this.handleMessageView} data-index={index} key={message.id} className={"qa-room-label-link b-room-label-wrapper"+(this.state.selected && this.state.selected.user_id && (this.state.selected.user_id == message.from_id || this.state.selected.user_id == message.to_id)?" b-room-label-wrapper--active":"")}>
            <div className="b-user-avatar-icon h-flex-center h-flex-center" style={{flex: "0 0 48px", height: "48px", width: "48px", backgroundImage: "url("+profilePhoto(message.user_photo)+")"}}>
            </div>
            <div data-index={index} className="b-room-label">
             <header data-index={index}>
              <div data-index={index} className="h-text-one-line h-lh-em-1_3">
               <span data-index={index} className="qa-room-label-link-name">
                {message.user_firstname + " " + message.user_lastname}
               </span>
              </div>
              <div data-index={index} className="hide b-room-label-date">
               Nov 2
              </div>
             </header>
             <div data-index={index} className="b-room-label-ad-title h-text-one-line">
              <span data-index={index} className="qa-room-label-link-title">
               {message.product_title}
              </span>
             </div>
             <div data-index={index} className="h-dflex h-flex-cross-baseline">
              <div data-index={index} className="h-flex">
               <span data-index={index}>
                {(message.from_id == this.state.user.id?"You: ":"")+truncText(message.body, 70)}
               </span>
              </div>
             </div>
            </div>
           </div>
         ))
     }
    </div>
   </div>
   
   <div className={"b-messenger-main-frame"+(!this.state.selected?" sm-hide-down":"")}>
    <div className="qa-messenger-room-wrapper b-messenger-room-wrapper">
    {
       this.state.selected == "loading"?
        <div className={"b-filters__loader active"}>
            <div style={{display: "block"}}>
                <div className="b-bouncing-loader" style={{bottom: "0px"}}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
       :
       this.state.selected?
       <div className="b-messenger-room-transition-wrapper">
      <div className="b-messenger-room-header-fixed-wrapper js-messenger-room-header-fixed-wrapper">
       <header className="b-messenger-room-header-wrapper">
        <div className="b-messenger-room-header-part b-messenger-room-header-part--left">
         <div onClick={this.handleBackPressed} style={{color: "#fff"}} className="md-hide-up b-messenger-room-header-icon-wrapper fa fa-arrow-left">
         </div>
         <Link className="qa-messenger-room-avatar" to={"/"}>
          <div className="b-user-avatar-icon h-flex-center" style={{flex: "0 0 40px", height: "40px", width: "40px", backgroundImage: "url("+this.state.recipient.profile_photo+")", transition: "all 0.3s ease 0s", filter: "blur(0px)", opacity: "1"}}>
          </div>
         </Link>
        </div>
        <div className="b-messenger-room-header-part b-messenger-room-header-part--middle">
         <Link className="qa-messenger-room-user-name b-messenger-room-header-user-name h-text-one-line" to={"/seller/"+this.state.recipient.id} style={{transition: "all 0.3s ease 0s", filter: "blur(0px)", opacity: "1"}}>
          {this.state.recipient.firstname+" "+this.state.recipient.lastname}
         </Link>
        </div>
        <div className="b-messenger-room-header-part b-messenger-room-header-part--right">
         <div className="b-messenger-room-header-icons-wrapper">
          <div>
           <div className="hide qa-messenger-room-report-abuse b-messenger-room-header-icon">
            <a className="qa-button-report-abuse">
             <span className="h-font-14 h-flex-center">
              <svg className="flag-2" strokeWidth="0" style={{width: "16px", height: "16px", maxWidth: "16px", maxHeight: "16px", fill: "rgb(255, 255, 255)", stroke: "inherit"}}>
               <use xlinkHref="#flag-2">
               </use>
              </svg>
             </span>
            </a>
           </div>
          </div>
          <div className="h-pos-rel">
           <div className="hide b-messenger-room-header-icon">
            <div className="qa-messenger-room-context-menu h-flex-center">
             <svg className="sub-menu" strokeWidth="0" style={{width: "16px", height: "16px", maxWidth: "16px", maxHeight: "16px", fill: "rgb(255, 255, 255)", stroke: "inherit"}}>
              <use xlinkHref="#sub-menu">
              </use>
             </svg>
            </div>
           </div>
           <div className="b-messenger-context-menu-wrapper">
           </div>
          </div>
         </div>
        </div>
       </header>
       <div className="b-messenger-room-advert-info">
        <a className="b-messenger-room-advert-info-link" href="/lekki-phase-1/cars/maserati-5000-2017-gray-7vUC5hG9eKtiC04hxF99T0vc.html">
         <div className="b-messenger-room-advert-info-image-wrapper h-a-without-underline" style={{transition: "all 0.3s ease 0s", filter: "blur(0px)", opacity: "1"}}>
          <div className="b-messenger-room-advert-info-image" style={{backgroundImage: "url("+this.state.recipient.message.product_photos.split(",")[0]+")"}}>
          </div>
         </div>
         <div className="b-messenger-room-advert-info-title">
          <div className="b-messenger-room-advert-info-title-link" style={{transition: "all 0.3s ease 0s", filter: "blur(0px)", opacity: "1"}}>
           {this.state.recipient.message.product_title}
          </div>
          <div dangerouslySetInnerHTML={{__html: this.state.recipient.message.product_currency_symbol+" "+commaNum(this.state.recipient.message.product_price)}} className="b-messenger-room-advert-info-price h-text-one-line" style={{transition: "all 0.3s ease 0s", filter: "blur(0px)", opacity: "1"}}>
          </div>
         </div>
        </a>
        <div className="b-messenger-room-advert-info-extra">
         <a className="qa-show-contact cy-show-contact js-show-contact b-show-contact" rel="nofollow">
          <span className="b-show-contact-content">
           <div className="b-show-contact-wrapper h-pointer" style={{transition: "all 0.3s ease 0s", filter: "blur(0px)", opacity: "1"}}>
            <svg className="h-mr-5 phone2" strokeWidth="0" style={{width: "20px", height: "20px", maxWidth: "20px", maxHeight: "20px", fill: "rgb(70, 75, 79)", stroke: "inherit"}}>
             <use xlinkHref="#phone2">
             </use>
            </svg>
            <button onClick={this.dataCall} data-call-class="fa fa-phone-square" data-call={this.state.recipient.message.user_number} className="b-btn b-btn--main h-ml-10 text-uppercase">
             Call seller
            </button>
           </div>
          </span>
         </a>
        </div>
       </div>
      </div>
      <div id="msgScrollPane" className="b-messenger-room-output">
       <div className="b-messenger-room-output-inner" style={{maxHeight: "100%"}}>
        {
            this.state.selected.threads.map((thread, index) =>(
                <div key={index} className="b-messenger-room-list-inner" id="messenger-top-message">
         {
             index == 0 || this.dateNovComma2Year(thread.created) != this.dateNovComma2Year(this.state.selected.threads[index-1])?
             <div className="qa-group-message-date b-messenger-room-message-block-date">
                {this.dateNovComma2Year(thread.created)}
            </div>:""

         }
         <div className="b-messenger-room-message-wrapper b-messenger-room-message-owner">
          <div className="qa-message-wrapper b-messenger-room-message-outer">
           <div className="b-messenger-room-message-inner">
            <div className="b-messenger-room-message">
             <div className="qa-message-text b-messenger-room-message-text">
              {thread.body}
             </div>
             <div className="b-messenger-room-message-date">
              <span className="qa-message-date b-messenger-room-message-date-text">
               {this.date16R45(thread.created)}
              </span>
              <div className="b-messenger-room-message-icon-wrapper">
                  {
                      thread.seen < 0?
                      <span style={{fontWeight: "bold", fontStyle: "italic", color: "#000"}}>....</span>
                      :
                      <svg className="check" strokeWidth="0" style={{width: "16px", height: "9px", maxWidth: "16px", maxHeight: "9px", fill: "rgb(130, 180, 87)", stroke: "inherit"}}>
                        <use xlinkHref={thread.seen == 0?"#check":"#doublecheck"}>
                        </use>
                      </svg>
                  }
              </div>
             </div>
            </div>
           </div>
          </div>
         </div>
        </div>
            ))
        }
       </div>
      </div>
      <form onSubmit={this.handleSubmit} className="js-input-messenger-wrapper b-messenger-input-wrapper">
       <div className="b-messenger-input-block">
        <div className="b-messenger-input__stickers-button">
         <svg className="stickers" strokeWidth="0" style={{width: "26px", height: "26px", maxWidth: "26px", maxHeight: "26px", fill: "rgb(166, 184, 189)", stroke: "inherit"}}>
          <use xlinkHref="#stickers">
          </use>
         </svg>
         <span className="b-messenger-input__stickers-button__new">
          new
         </span>
        </div>
        <div className="b-messenger-input__wrapper">
            <input value={this.state.msg} onChange={this.handleChange} name="msg" type="text" placeholder="Write your message here" className="qa-messenger-send-message-textarea b-messenger-input"/>
        </div>
        <div className="b-messenger-input-icon-wrapper">
         <label className="hide b-app-image-reader">
          <svg className="b-messenger-input-icon add-file" strokeWidth="0" style={{width: "24px", height: "24px", maxWidth: "24px", maxHeight: "24px", fill: "rgb(196, 196, 196)", stroke: "inherit"}}>
           <use xlinkHref="#add-file">
           </use>
          </svg>
          <input accept="image/*" className="qa-messenger-send-image" multiple="multiple" type="file"/>
         </label>
         <svg className="qa-messenger-send-message b-messenger-input-icon h-ml-15 send" strokeWidth="0" style={{width: "24px", height: "19px", maxWidth: "24px", maxHeight: "19px", fill: "rgb(196, 196, 196)", stroke: "inherit"}}>
            <use xlinkHref="#send"></use>
         </svg>
        </div>
       </div>
      </form>
     </div>
       :
    <div className="b-messenger-room-unselected h-flex-center">
        <div>
            <svg className="messenger-girl" strokeWidth="0" style={{width: "152px", height: "126px", maxWidth: "152px", maxHeight: "126px", fill: "inherit", stroke: "inherit"}}>
                <use xlinkHref="#messenger-girl"></use>
            </svg>
            <div className="h-mt-10">
                Select a chat to view conversation
            </div>
        </div>
    </div>
   }
    </div>
   </div>
  </div>
 </div>
    }
</div>
        )
    }
}

export default Messages