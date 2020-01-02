import React, { Component } from "react"
import {getCopy} from "../utils/Funcs"

class Account extends Component {
    render() {
        return (
            <div className="js-body-wrapper b-body-wrapper">
                <div className="js-content h-bg-grey h-flex" data-use-spa="true" data-web-id="1573237260##534d110b8ac58e6d2a64119336f6a80aac2fffad" id="js-vue-scope">
                    <div className="b-stickers-wrapper" id="js-stickers-wrapper">
                    </div>
                    <div className="b-js-load-app-replacement js-load-app-replacement" style={{ display: "none" }}>
                    </div>
                    <div className="h-bg-grey container h-pt-10 h-pb-15">
                        <div>
                            <div className="b-notification b-notification__red qa-confirm-email-notification ">
                                <div className="h-ph-25 h-pv-7 h-dflex h-flex-main-center h-flex-dir-column">
                                    <div className="b-notification-text">
                                        <div className="h-main-gray-force">
                                            <div className="h-font-18 h-darker-red h-bold h-mb-5">
                                                Your ad won't be posted unless you confirm your email address!
        </div>
                                            <div>
                                                Email: "<b>
                                                    jinminetics@gmail.com
         </b>
                                                If you did not receive the email with confirmation link you can request it again.
        </div>
                                            <div>
                                                <form action="/resend-confirmation-email.html" method="post" name="baseform" validate="true">
                                                    <input id="csrf_token" name="csrf_token" type="hidden" value="1573237260##534d110b8ac58e6d2a64119336f6a80aac2fffad" />
                                                    <button className="b-button b-button--black-light b-button--bg-transparent b-button--border-radius-5 b-button--size-small-2 h-mt-10">
                                                        Resend email
          </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-dflex h-mt-20">
                                <div className="h-flex-0-0-270 h-pl-0">
                                    <form action="" className="b-user-settings__avatarblock">
                                        <div className="js-avatar b-user-settings__avatarblock__avatar" style={{backgroundImage: "url(https://static.jiji.ng/static/img/no-image/user/no_avatar.png)"}}>
                                            <button className="b-user-settings__avatarblock__upload-foto" data-target="#add_profile_photo" data-toggle="modal" type="button">
                                                <i className="h-icon icon-profile-settings-upload">
                                                </i>
                                            </button>
                                        </div>
                                        <div className="b-user-settings__avatarblock__name">
                                            <a href="/sellerpage-4496445">
                                                Feyijinmi Adegoke
        </a>
                                        </div>
                                        <div className="h-hidden" id="img_status">
                                            Your photo is None
       </div>
                                    </form>
                                    <div aria-labelledby="ModalLabel" className="modal" id="add_profile_photo" role="dialog" tabIndex="-1">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header h-text-center h-font-16" style={{ background: "rgb(242, 244, 248) none repeat scroll 0% 0%" }}>
                                                    <button aria-hidden="true" className="close" data-dismiss="modal" type="button">
                                                        �
          </button>
                                                    <h5 className="h-bold">
                                                        Add a profile photo
          </h5>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="b-popup-form js-input-image-block" name="advert_image">
                                                        <div className="js-upload b-user-settings__avatarblock__avatar " style={{backgroundImage: "url(https://static.jiji.ng/static/img/no-image/user/no_avatar.png)"}}>
                                                        </div>
                                                        <div className="js-upload-preview h-hidden b-user-settings__avatarblock__avatar" style={{ zIndex: "2" }}>
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
                                                            <img className="js-upload-progress h-hidden h-mt-20" src="https://static.jiji.ng/static/img/profile/preload2.gif" />
                                                            <a className="js-upload-link">
                                                                <div className="b-user-settings__avatarblock__btnblock">
                                                                    <div className="b-user-settings__avatarblock__btn btn btn-lg">
                                                                        <div className="btn btn-lg btn-success btn-block" id="file-name-btn">
                                                                            Choose a File
               </div>
                                                                        <input className="h-hidden" name="image_id" type="text" value="" />
                                                                        <input accept="image/*" className="js-input-image" name="photo" type="file" />
                                                                    </div>
                                                                </div>
                                                            </a>
                                                            <div className="js-success-btns b-user-settings__avatarblock__btnblock h-hidden h-width-100p">
                                                                <button className="js-go-back btn btn-default h-bold" style={{ width: "22%" }}>
                                                                    GO BACK
             </button>
                                                                <button aria-hidden="true" className="btn btn-success h-bold" data-dismiss="modal" style={{ width: "22%" }}>
                                                                    OK
             </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <a className="b-notification b-notification__green qa-premium-create-ad-tips" href="/create-ad-tips">
                                        <div className="b-notification-icon">
                                            <i className="h-icon icon-profile-lightbulb">
                                            </i>
                                        </div>
                                        <div className="h-pr-10 h-dflex h-flex-main-center h-flex-dir-column">
                                            <div className="b-notification-text">
                                                <div>
                                                    Tips how to create an effective ad
         </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div className="h-flex h-mb-20 h-pl-15">
                                    <div className="b-profile__body">
                                        <div className="b-profile-statistics">
                                            <div className="b-profile-statistics__no-ad">
                                                <img src="https://static.jiji.ng/static/img/profile/market.png" />
                                                <div className="b-profile-statistics__no-ad__text">
                                                    It remains only to post an ad and you will become a pro.
          <br/>
                                                        Post your ad now.
          <br/>
                                                </div>
                                                <a className="b-button b-button--primary b-button--border-radius b-button--shadow" href="/add-free-ad.html">
                                                    Post Ad
         </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div className="b-chat-support">
                                        <a className="b-icon-button--base b-icon-button--primary b-widget" href="" target="">
                                            <svg className="chat-support" style={{ width: "65px", height: "65px", maxWidth: "65px", maxHeight: "65px", fill: "rgb(255, 255, 255)", stroke: "inherit" }}>
                                                <use xlinkHref="#chat-support">
                                                </use>
                                            </svg>
                                        </a>
                                        <div className="b-chart-support-buttons" style={{ display: "none" }}>

                                            <div className="h-mb-5 fb-holder">
                                                <div id="fb-root">
                                                </div>
                                                <div attribution="setup_tool" className="fb-customerchat" greeting_dialog_display="hide" page_id="463583521052737" theme_color="#3C5A99">
                                                </div>
                                            </div>
                                            <a className="b-icon-button--base h-mb-5 b-icon-button--intercom b-widget-chat" href="" target="">
                                                <svg className="intercom" style={{ width: "28px", height: "28px", maxWidth: "28px", maxHeight: "28px", fill: "rgb(255, 255, 255)", stroke: "inherit" }}>
                                                    <use xlinkHref="#intercom">
                                                    </use>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fw-fixed-background" style={{ display: "none" }}>
                    </div>
                    <div className="vue-portal-target">
                    </div>
                    
            </div>
            <div className="js-footers">
                {getCopy()}
            </div>
</div >
        )
    }
}

export default Account