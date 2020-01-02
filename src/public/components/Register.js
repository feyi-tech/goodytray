import React, { Component } from 'react'
import {Link} from "react-router-dom"
import { register } from './UserFunctions'
import {isValidNumber, isValidEmail, id, cls, shuffleHash, randomHashString} from '../utils/Funcs'

class Register extends Component {
    constructor() {
        super()
        this.state = {
          firstname: '',
          lastname: '',
          number: '',
          email: '',
          password: '',
          posting_form: false,
          hasErrors: false
        }
    
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    

    setError(elId, error) {
        var group = id(elId + "-group")
        console.log(group)
        var err = id(elId + "-error")
        group.classList.add(["has-error"], ["has-feedback"])
        err.innerHTML = error
        err.classList.remove(["hide"])
    }


    removeErrors() {
        var errs = cls("fw-field__error");
        var groups = cls("has-error");
        if(groups.length > 0) {
            for(var i = 0; i < groups.length; i++) {
                groups[i].classList.remove(["has-error"], ["has-feedback"])
            }
        }

        if(errs.length > 0) {
            for(var j = 0; j < errs.length; j++) {
                errs[j].classList.add(["hide"])
            }
        }
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
        //console.log([e.target.name] +": "+e.target.value)
    }
    
    onSubmit(e) {
        e.preventDefault()
        
        this.removeErrors()
        this.state.hasErrors = false
        if(this.state.firstname.length == 0) {
            this.setError("firstname", "Please enter your firstname")
            this.state.hasErrors = true
        }

        if(this.state.email.length == 0) {
            this.setError("email", "Please enter your email")
            this.state.hasErrors = true

        } else if(!isValidEmail(this.state.email)) {
            this.setError("email", "Please enter a valid email")
            this.state.hasErrors = true

        }

        if(this.state.password.length == 0) {
            this.setError("password", "Please enter your password")
            this.state.hasErrors = true
        }

        if(this.state.number.length == 0) {
            this.setError("number", "Please enter your phone number")
            this.state.hasErrors = true

        } else if(!isValidNumber(this.state.number)) {
            this.setError("number", "Please enter a valid number")
            this.state.hasErrors = true

        }

        if(!this.state.hasErrors) {
            const newUser = {
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                email: this.state.email,
                password: this.state.password,
                number: this.state.number
            }
            this.setState({posting_form: true})
            register(newUser).then(res => {
                /*
                {status: 1, message: message, login_token: login_token, form_errors: form_error}
                form_errors = null 
                    || 
                {
                    email_error: String, 
                    password_error: String, 
                    firstname_error: String, 
                    lastname_error: String, 
                    number_error: String
                }
                */
               if(res.login_token != null) {
                    localStorage.setItem("login_token", res.login_token)
                    //redirect to after after login page
                    this.props.history.push('/profile')
               } else if(res.form_errors != null) {
                   for(var key in res.form_errors) {
                    console.log("error_key: "+ key)
                       if(res.form_errors[key].length > 0) {
                           var error_name = key.substring(0, key.indexOf("_"));
                           console.log("error_name: "+ error_name)
                           this.setError(error_name, res.form_errors[key])
                       }
                   }
                   this.setState({posting_form: false})
               } else {
                   if(res.message == null) res.message = "Failed to get response from the server"
                   console.log("reg_message: "+res.message)
                   this.setState({posting_form: false})
               }
               //console.log("randomHashString: "+randomHashString(5))
               //console.log("shuffleHash: ", "shuffleHash".shuffleHash())
               console.log("reg_response_text: "+JSON.stringify(res))
                
            })
        }
    }
    render() {
        return (
            <div>
                <div className="h-bg-grey  h-pb-15">
                    <div>
                        <div className="container" postUrl="https://jiji.ng/add-free-ad.html" firstload="true">
                            <div className="row center-xs">
                                <div className="col-sm-10 col-xs-12">
                                    

                                    <div className="fw-card qa-fw-card bc-auth-card">
                                        <div className="fw-card-title">
                                            <svg strokeWidth="0" className="person"
                                                style={{ width: "40px", height: "40px", maxWidth: "40px", maxHeight: "40px", fill: "rgb(112, 185, 63)", stroke: "inherit" }}>
                                                <use xlinkHref="#person"></use>
                                            </svg>
                                            Registration
                                        </div>
                                        <div className="fw-card-content qa-fw-card-content">
                                            <div className="row center-xs">
                                                <div className="bc-auth-card__form-holder">
                                                    <form noValidate onSubmit={this.onSubmit}>
                                                        <div className="bc-social-buttons hide">
                                                            <div className="row">
                                                                <div className="col-xs-12"><a
                                                                    href="https://jiji.ng/social-auth.html?url=%2Fregistration.html"
                                                                    target=""
                                                                    className="js-handle-link-event h-width-100p bc-facebook fw-button qa-fw-button fw-button--type-success fw-button--size-large"
                                                                    dataGa_params="[&quot;FB_Login&quot;, &quot;Click_to_login_button&quot;, &quot;registration_page&quot;]"><span
                                                                        className="fw-button__content"> <span
                                                                            className="fw-button__slot-wrapper"><svg
                                                                                strokeWidth="0" className="facebook"
                                                                                style={{ width: "20px", height: "20px", maxWidth: "20px", maxHeight: "20px", fill: "rgb(255, 255, 255)", stroke: "inherit" }}>
                                                                                <use xlinkHref="#facebook"></use>
                                                                            </svg>
                                                                            Login with Facebook
                                                                </span></span></a></div>
                                                                <div className="col-xs-12"><a
                                                                    href="https://jiji.ng/google-auth.html?url=%2Fregistration.html"
                                                                    target=""
                                                                    className="js-handle-link-event h-width-100p bc-google fw-button qa-fw-button fw-button--type-success fw-button--size-large"
                                                                    dataGa_params="[&quot;Google_Login&quot;, &quot;Click_to_login_button&quot;, &quot;registration_page&quot;]"><span
                                                                        className="fw-button__content"> <span
                                                                            className="fw-button__slot-wrapper"><svg
                                                                                strokeWidth="0" className="google"
                                                                                style={{ width: "30px", height: "30px", maxWidth: "30px", maxHeight: "30px", fill: "rgb(255, 255, 255)", stroke: "inherit" }}>
                                                                                <use xlinkHref="#google"></use>
                                                                            </svg>
                                                                            Login with Google
                                                                </span></span></a></div>
                                                            </div>
                                                        </div>
                                                        <div className="bc-auth-card__form-separator hide"></div>

                                                        <div className="text-left">
                                                            
                                                            <div id="email-group" className="form-group input-group-lg">
                                                                <label for="email">Email:</label>
                                                                <input autoComplete="off" type="text"
                                                                        className="form-control"
                                                                        name="email"
                                                                        id="email"
                                                                        value={this.state.email}
                                                                        onChange={this.onChange}/>
                                                                <span id="email-error" className="fw-field__error qa-fw-field__error hide">
                                                                    This field is required.
                                                                </span>
                                                            </div>

                                                            <div id="password-group" className="form-group input-group-lg">
                                                                <label for="password">Password:</label>
                                                                <input autoComplete="off" type="password"
                                                                        className="form-control"
                                                                        name="password"
                                                                        id="password"
                                                                        value={this.state.password}
                                                                        onChange={this.onChange}/>
                                                                <span id="password-error" className="fw-field__error qa-fw-field__error hide">
                                                                    This field is required.
                                                                </span>
                                                            </div>

                                                            <div id="firstname-group" className="form-group input-group-lg">
                                                                <label for="firstname">Firstname:</label>
                                                                <input autoComplete="off" type="text"
                                                                        className="form-control"
                                                                        name="firstname"
                                                                        id="firstname"
                                                                        value={this.state.firstname}
                                                                        onChange={this.onChange}/>
                                                                <span id="firstname-error" className="fw-field__error qa-fw-field__error hide">
                                                                    This field is required.
                                                                </span>
                                                            </div>

                                                            <div id="lastname-group" className="form-group input-group-lg">
                                                                <label for="lastname">Lastname (optional):</label>
                                                                <input autoComplete="off" type="text"
                                                                        className="form-control"
                                                                        name="lastname"
                                                                        id="lastname"
                                                                        value={this.state.lastname}
                                                                        onChange={this.onChange}/>
                                                                <span id="lastname-error" className="fw-field__error qa-fw-field__error hide">
                                                                    This field is required.
                                                                </span>
                                                            </div>
                                                            
                                                            <div id="number-group" className="form-group input-group-lg">
                                                                <label for="number">Phone number (e.g <b>+1</b>xxx...):</label>
                                                                <div className="input-group input-group-lg">
                                                                    <input autoComplete="off" type="text"
                                                                        className="form-control"
                                                                        name="number"
                                                                        id="phone_number"
                                                                        data-type="phone-number"
                                                                        value={this.state.number}
                                                                        onChange={this.onChange}/>
                                                                    <span className="input-group-addon">Tel</span>
                                                                </div>
                                                                <span id="number-error" className="fw-field__error qa-fw-field__error hide">
                                                                    This field is required.
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="fw-checkbox qa-fw-checkbox h-mb-30 fw-checked">
                                                            <label className="fw-checkbox__label">
                                                                By clicking the registration button below, you agree with our <a href="/tos" className="h-base-link">Terms of Services</a> and <a href="/privacy-policy" className="h-base-link">Privacy Policy</a>.
                                                            </label>
                                                        </div>
                                                        {
                                                            this.state.posting_form?
                                                            <button id="submit" type="submit" disabled="disabled" 
                                                                className="fw-button--disabled h-width-100p h-bold fw-button qa-fw-button fw-button--type-success fw-button--size-large">
                                                                <span className="fw-button__content"> 
                                                                    <span className="fw-button__slot-wrapper italic">Please wait...</span>
                                                                </span>
                                                            </button>
                                                            :
                                                            <button id="submit" type="submit" 
                                                                className="h-width-100p h-bold fw-button qa-fw-button fw-button--type-success fw-button--size-large">
                                                                <span className="fw-button__content"> 
                                                                    <span className="fw-button__slot-wrapper">REGISTER</span>
                                                                </span>
                                                            </button>
                                                        }
                                                    </form> 
                                                    <span className="bc-auth-card-error"></span>
                                                </div>
                                            </div>
                                            <div className="fw-card-content-icon"></div>
                                        </div>
                                    </div>
                                    <div className="bc-social-buttons-container col-xs">
                                        <div className="h-font-12 row center-xs">
                                            <div className="bc-auth-card__form-holder">
                                                Already registered? <Link to="/login" className="h-base-link">Sign in</Link></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fw-fixed-background" style={{ display: "none" }}></div>
                <div className="vue-portal-target"></div>
            </div>
        )
    }
}

export default Register