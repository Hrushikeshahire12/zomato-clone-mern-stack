import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Filter from './Filter'
import Zomoto from './Zomoto'
import Details from './Details'



function Router() {
  return (
  
      <BrowserRouter>
<Route exact path='/Details' component={Details}/>
<Route exact path='/' component={Zomoto}/>
<Route exact path='/filter' component={Filter}/>

      
    
      </BrowserRouter>
  
  )
}

export default Router



