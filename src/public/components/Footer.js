import React, {Component} from "react"
import {Link, withRouter} from "react-router-dom"
import { getCopy } from "../utils/Funcs"
//import { unlink } from "fs"

class Footer extends Component {
    render() {
        return (
            <div className="b-app-footer__wrapper">
                <div className="b-app-footer__image">
                    <svg strokeWidth="0" className="h-mb--2 footer" style={{width: "100%", height: "auto", maxWidth: "100%", fill: "rgb(112, 185, 63)", stroke: "inherit"}}>
                        <use xlinkHref="#footer"></use>
                    </svg>
                </div>
                <div className="b-app-footer__inner">
                    <div className="container">
                        <div className="row">
                                <a href="/about" className="b-app-footer__group-link col-xs-6 col-sm-4 col-md-2">About Us</a>
                                <a href="/tos" className="b-app-footer__group-link col-xs-6 col-sm-4 col-md-2">Terms &amp; Conditions </a>
                                <a href="/privacy-policy" className="b-app-footer__group-link col-xs-6 col-sm-4 col-md-2">Privacy Policy</a>
                                <a href="/billing-policy" className="b-app-footer__group-link col-xs-6 col-sm-4 col-md-2">Billing Policy</a>
                                <a href="/contact-us" className="b-app-footer__group-link col-xs-6 col-sm-4 col-md-2">Contact Us</a>
                        </div>
                    </div>
                        
                    <div className="b-app-footer__copyright">
                        <div>{getCopy()}</div>
                    </div>
                </div>
                <div style={{marginTop: "56px"}} className="modal" id="modalAlert" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button className="close" data-dismiss="modal" type="button">
                                    &times;
                                </button>
                                <h4 className="hide modal-title"></h4>
                            </div>
                            <div className="modal-body">
                                <p id="modalBody"></p>
                            </div>
                            <div className="modal-footer row">
                                <button style={{float:"right"}} className="btn btn-default" id="modalCancel" type="button">
                                    Cancel
                                </button>
                                <button style={{float:"right", marginLeft:"30px", background:"#70b93f"}} className="btn" data-dismiss="modal" id="modalOk" type="button">
                                    Ok
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          
        )
    }
}

export default withRouter(Footer)