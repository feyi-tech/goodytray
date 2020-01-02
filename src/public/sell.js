import React from 'react'
import ReactDOM from 'react-dom'
import Sell from './components/Sell'

ReactDOM.hydrate(
  <Sell suppressHydrationWarning={true} initialData={window.__INITIAL__DATA__} />,
  document.getElementById('root')
)
