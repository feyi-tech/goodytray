import React, { Component } from 'react'
import {Link} from "react-router-dom"
import { login } from './UserFunctions'
import {id, cls} from '../utils/Funcs'
import queryString from 'querystring'

class Login extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      posting_form: false,
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

setError(elId, error) {
    var err = id(elId + "-error")
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

    if(this.state.email.length == 0) {
      this.setError("email", "Please enter your email")
      this.state.hasErrors = true
    }

    if(this.state.password.length == 0) {
      this.setError("password", "Please enter your password")
      this.state.hasErrors = true
    }
    console.log("state_hasErrors: "+this.state.hasErrors)
    if(!this.state.hasErrors) {
      console.log("no error")
      const user = {
        email: this.state.email,
        password: this.state.password
      }
  
      this.setState({posting_form: true})
      login(user).then(res => {
         if(res.login_token != null) {console.log("login_token: "+res.login_token)
           localStorage.setItem("login_token", res.login_token)
            //redirect to after after login page
            console.log("this.props.location: "+JSON.stringify(this.props.location))
            const queryValues = queryString.parse(this.props.location.search.substring(1))
            console.log("LOGIN_REZ: "+res.data)
            
            if(queryValues.next) {
              window.location.href = decodeURI(queryValues.next)

            } else {console.log("q2")
              window.location.href = "/profile"
            }

          } else if(res.form_errors != null) {
            for(var key in res.form_errors) {
              console.log("error_key: "+ key)
              if(res.form_errors[key].length > 0) {
                  var error_name = key.substring(0, key.indexOf("_"));
                  console.log("error_name: "+ error_name)
                  this.setError(error_name, res.form_errors[key])
              }
            }
          } else {
               if(res.message == null) res.message = "Failed to get response from the server"
               console.log("login_message: "+res.message)
          }
          console.log("reg_response_text: "+JSON.stringify(res))
          this.setState({posting_form: false})
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
                <div className="bc-auth-notification fw-notification fw-notification--success">
                  <div className="fw-notification__content">
                    <div className="fw-notification__title">Please sign in or register to publish your adverts ;)</div> 
                    <div className="fw-notification__text"></div>
                  </div>
                </div>

              <div className="fw-card qa-fw-card bc-auth-card">
                <div className="fw-card-title">
                  <svg strokeWidth="0" className="person" style={{width: "40px", height: "40px", maxWidth: "40px", maxHeight: "40px", fill: "rgb(112, 185, 63)", stroke: "inherit"}}>
                    <use xlinkHref="#person"></use>
                  </svg>
                  Sign in
                </div> 
                <div className="fw-card-content qa-fw-card-content">
                  <div className="row center-xs">
                    <form noValidate onSubmit={this.onSubmit} className="bc-auth-card__form-holder">
                      <div className="bc-social-buttons hide">
                        <div className="row">
                          <div className="col-xs-12">
                            <a href="https://jiji.ng/social-auth.html?url=%2Flogin.html" target="" className="js-handle-link-event h-width-100p bc-facebook fw-button qa-fw-button fw-button--type-success fw-button--size-large" dataGa_params="[&quot;FB_Login&quot;, &quot;Click_to_login_button&quot;, &quot;registration_page&quot;]">
                              <span className="fw-button__content"> 
                                <span className="fw-button__slot-wrapper">
                                  <svg strokeWidth="0" className="facebook" style={{ width: "20px", height: "20px", maxWidth: "20px", maxHeight: "20px", fill: "rgb(255, 255, 255)", stroke: "inherit" }}>
                                    <use xlinkHref="#facebook"></use>
                                  </svg>
                                  Login with Facebook
                                </span>
                              </span>
                            </a>
                          </div> 
                          <div className="col-xs-12">
                            <a href="https://jiji.ng/google-auth.html?url=%2Flogin.html" target="" className="js-handle-link-event h-width-100p bc-google fw-button qa-fw-button fw-button--type-success fw-button--size-large" dataGa_params="[&quot;Google_Login&quot;, &quot;Click_to_login_button&quot;, &quot;registration_page&quot;]">
                              <span className="fw-button__content"> 
                                <span className="fw-button__slot-wrapper">
                                  <svg strokeWidth="0" className="google" style={{ width: "30px", height: "30px", maxWidth: "30px", maxHeight: "30px", fill: "rgb(255, 255, 255)", stroke: "inherit" }}>
                                    <use xlinkHref="#google"></use>
                                  </svg>
                                  Login with Google
                                </span>
                              </span>
                            </a>
                          </div>
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
                            this field is required.
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
                            this field is required.
                          </span>
                        </div>                          
                      </div>
                      
                     
                      <div className="bc-auth-card__remember-block row between-xs">
                        <div className="col-xs-3"></div> 
                        <div className="col-xs-9 h-text-right">
                          <a href="/forgot-password.html" className="h-base-link">Forgot your password</a>
                        </div>
                      </div> 
                      {
                        this.state.posting_form?
                        <button id="submit" type="submit" disabled="disabled" className="fw-button--disabled h-width-100p h-bold fw-button qa-fw-button fw-button--type-success fw-button--size-large">
                          <span className="fw-button__content"> 
                            <span className="fw-button__slot-wrapper italic">Please wait...</span>
                          </span>
                        </button>
                        :
                        <button id="submit" type="submit" className="h-width-100p h-bold fw-button qa-fw-button fw-button--type-success fw-button--size-large">
                          <span className="fw-button__content"> 
                            <span className="fw-button__slot-wrapper">SIGN IN</span>
                          </span>
                        </button>
                      }
                      <span className="bc-auth-card-error"></span>
                    </form>
                  </div> 
                  <div className="fw-card-content-icon"></div>
                </div>
              </div> 
              <div className="bc-social-buttons-container col-xs">
                <div className="h-font-12 row center-xs">
                  <div className="bc-auth-card__form-holder">
                    Don't have an account? <Link to="/register" className="h-base-link">Registration</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
      </div >
    </div >

    <div className="fw-fixed-background" style={{ display: "none" }}></div>
    <div className="vue-portal-target"></div>
  </div >
    )
  }
}

export default Login