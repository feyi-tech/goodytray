import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import MultipleRoutes from './components/MultipleRoutes'
import MultipleRoutesLogin from './components/MultipleRoutesLogin'
import SingleRoute from './components/SingleRoute'

console.log("window.__initialData__", window.__initialData__)
console.log("window.__initialData__.user", window.__initialData__.user)
const initialData = window.__initialData__
delete window.__initialData__
console.log("isSingle", initialData.isSingle)
const AppLogout = () => (
  <Router>
    <MultipleRoutes initialData={initialData} />
  </Router>
)

const AppLogin = () => (
  <Router>
    <MultipleRoutesLogin initialData={initialData} />
  </Router>
)

const AppSingle = () => (
  <Router>
    <SingleRoute initialData={initialData} />
  </Router>
)

var App;
if(initialData.isSingle) {
  App = AppSingle

} else {
  App = initialData.user == null? AppLogout : AppLogin
}

ReactDOM.hydrate(<App suppressHydrationWarning={true} />, document.getElementById('root'))