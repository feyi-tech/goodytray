import React from 'react'
import { Route } from 'react-router-dom'
import Landing from './Landing'
import Profile from './Profile'
import Navbar from './Navbar'
import Footer from './Footer'

import ProductPage from "./ProductPage"
import ProductReviews from "./ProductReviews"
import CreateReview from "./CreateReview"
import SellerPage from "./SellerPage"
import CreateTips from "./CreateTips"
import SearchPage from "./SearchPage"

import Settings from "./Settings"
import Messages from "./Messages"

const MultipleRoutesLogin = (props) => (
  <div className="App">
    <Route 
      path="/*" 
      render={(propz) => <Navbar {...propz} user={props.initialData.user} />}
    />
    <Route exact path="(/|/index.html|/index.php|/index.js|/products)" 
      render={(propz) => <Landing {...propz} user={props.initialData.user} />}
    />
    <Route path="/(search|search/:sect/:sub_sect)" 
      render={(propz) => <SearchPage {...propz} user={props.initialData.user} />}
    />
    <Route 
      exact path="/(profile|register|login)" 
      render={(propz) => <Profile {...propz} user={props.initialData.user} />}
    />
    <Route exact path="/products/:title/:id" 
      render={(propz) => <ProductPage {...propz} user={props.initialData.user} />}
    />
    <Route exact path="/reviews/:id" 
      render={(propz) => <ProductReviews {...propz} user={props.initialData.user} />}
    />
    <Route exact path="/create-review/:id" 
      render={(propz) => <CreateReview {...propz} user={props.initialData.user} />}
    />
    <Route exact path="/seller/:id" 
      render={(propz) => <SellerPage {...propz} user={props.initialData.user} />}
    />
    <Route exact path="/create-ad-tips" 
      render={(propz) => <CreateTips {...propz} user={props.initialData.user} />}
    />
    <Route exact path="/settings" 
      render={(propz) => <Settings {...propz} user={props.initialData.user} />}
    />
    <Route exact path="/messages" 
      render={(propz) => <Messages {...propz} user={props.initialData.user} />}
    />
    <Route exact path="/messages/:id" 
      render={(propz) => <Messages {...propz} user={props.initialData.user} />}
    />
    <Route path="/*" component={Footer} />
  </div>
)

export default MultipleRoutesLogin
