import React, { Component } from "react"
import { Link, withRouter } from "react-router-dom"
//import { unlink } from "fs"
import { isClientSide } from "../utils/Funcs"
import {SITE_NAME} from "../utils/Constants"
import { HOME_PATHS } from "../utils/RoutePaths"
import queryString from 'querystring'


class Navbar extends Component {
  constructor(props) {
    super(props)
    //this.state = props.user
    this.state = {
      user: props.user,
      collapsed: true
    }
    this.onClick = this.onClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.toggleNavbar = this.toggleNavbar.bind(this)
    this.closeNavbar = this.closeNavbar.bind(this)
  }

  componentDidMount() {
    console.log("mounted: "+JSON.stringify(this.state))
    console.log("mounted: "+JSON.stringify(this.props))
    //this.setState({collapsed: true})
    var queryValues;
    if(this.props.location && this.props.location.search) {
      var queryValues = queryString.parse(this.props.location.search.substring(1))
      console.log("mounted: Q ", queryValues)

    }
    
    if(queryValues && queryValues.search) {
      this.setState({search: queryValues.search})

    } else {
      this.setState({search: ""})
    }
    //document.location.href = "/profile"
    /*
    this.setState({
      email: "dd"//window.__initialData__.token_email
    })*/
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSearch = (e) => {
    e.preventDefault()
    if(this.state.search && this.state.search.length > 0) {
      document.location.href = "/search?q="+this.state.search
      //this.closeNavbar();
    }
  }

  onClick(e) {
    e.preventDefault()
  }

  logOut() {
    $("#logoutform").submit()

  }
  toggleNavbar() {
    this.setState({collapsed: !this.state.collapsed})
  }
  closeNavbar() {
    if (!this.state.collapsed) {
      this.toggleNavbar();
    }
  }
  render() {
    const circleButtonStyle = {
      backgroundColor: "rgb(255, 255, 255)",
      position: "relative",
    };

    const circleButtonSVGStyle = {
      width: 16 + "px",
      height: 16 + "px",
      maxWidth: 16 + "px",
      maxHeight: 16 + "px",
      fill: "rgb(166, 184, 189)",
      stroke: "inherit"
    };

    var stateLinks
    if(!this.props.user) {
      console.log("State-Logout: " + this.state)
      //if the user is not logged in
      stateLinks = (
        <ul className="nav navbar-nav b-app-header-user-bar navbar-right">
          <li className="nav-item">
            <Link onClick={this.closeNavbar} to="/login" className="h-flex-center">
              Sign in
            </Link>
          </li>
          <li className="nav-item">
            <Link onClick={this.closeNavbar} to="/register" className="h-flex-center">
              Registration
            </Link>
          </li>
          <li className="nav-item">
            <div className="h-width-120">
              <Link onClick={this.closeNavbar} to="/login" className="h-width-100p fw-button qa-fw-button fw-button--type-warning fw-button--size-medium">
                <span className="fw-button__content">
                  <span className="fw-button__slot-wrapper">SELL</span>
                </span>
              </Link>
            </div>
          </li>
        </ul>
      )

    } else {
      console.log("State-Login: " + JSON.stringify(this.state))
      stateLinks = (
        <ul className="nav navbar-nav b-app-header-user-bar navbar-right">
          <li className="nav-item">
            <Link onClick={this.closeNavbar} to="/profile" className="h-flex-center">
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link onClick={this.closeNavbar} to="/messages" className="h-flex-center">
              Messages
            </Link>
          </li>
          <li className="nav-item">
            <Link onClick={this.closeNavbar} to="/notifications" className="hide h-flex-center">
              Notifications
            </Link>
          </li>
          <li className="nav-item">
            <Link onClick={this.closeNavbar} to="/settings" className="h-flex-center">
              Settings
            </Link>
          </li>
          <li className="nav-item">
            <form id="logoutform" method="post" action="/login">
              <input type="hidden" name="log_out" value="ok"/>
            </form>
            <a href="javascript:void(0)" onClick={this.logOut} className="h-flex-center">
              Logout
            </a>
          </li>
          <li className="nav-item">
            <div className="h-width-120">
              <a href="/sell" className="h-width-100p fw-button qa-fw-button fw-button--type-warning fw-button--size-medium">
                <span className="fw-button__content">
                  <span className="fw-button__slot-wrapper">SELL</span>
                </span>
              </a>
            </div>
          </li>
        </ul>
      )
    }

    return (
      <div id="header" className="b-app-header-wrapper">
        <div style={{height: "66px"}}></div>
        <nav className="navbar b-app-header navbar-fixed-top">
          <div className="container-fluid nav-container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse"  onClick={this.toggleNavbar}>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link onClick={this.closeNavbar} to="/" className="navbar-brand logo font-bask-normal">
                <img src="/public/logo.png" width="45" alt="logo" className="d-inline-block align-middle mr-2"/>
                <span>{SITE_NAME}</span>
              </Link>
            </div>
            <div className={"collapse navbar-collapse"+(this.state.collapsed?"":" in")} id="myNavbar">
              <form style={{display: "inline-block", height: "40px", width:"100%"}} className={"md-w-up-2"+(HOME_PATHS.includes(this.props.location.pathname)?" md-hide-up":"")} onSubmit={this.handleSearch}>
                <div className="input-group input-group-lg fw-search--rounded">
                  <input autoComplete="off" onChange={this.handleChange}
                  type="text" className="form-control" value={this.state && this.state.search?this.state.search:""} name="search" 
                  placeholder="Enter your search..." onChange={this.handleChange}/>
                  <span onClick={this.handleSearch} type="submit" style={{cursor: "pointer", height: "40px", background: "#FFA010", borderColor: "#FFA010"}} className="input-group-addon">
                    <div onClick={this.handleSearch} className="fw-search__icon">
                      <svg onClick={this.handleSearch} className="loupe-2" strokeWidth="0" style={{width: "16px", height: "16px",maxWidth: "16px",maxHeight: "16px",fill: "rgb(255, 255, 255)",stroke: "inherit"}}>
                        <use xlinkHref="#loupe-2"></use>
                      </svg>
                    </div>
                  </span>
                </div>
              </form>
              {stateLinks}
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default withRouter(Navbar)