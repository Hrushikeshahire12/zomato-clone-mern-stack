import React, { Component } from 'react'
import './Style/Style.css'
import Wallpaper from './Wallpaper'
import QuickSearches from './QuickSearches'
import axios from 'axios';


class Zomoto extends Component {
  constructor(){
      super();
      this.state = {
          locations : [],
          mealtypes : [],
          restaurants : []
      }
  }
 
  componentDidMount = async() => {
  let location = await axios({
    method : 'GET',
    url : 'http://localhost:8100/locations',
    headers : {'content-type' : 'application/json'}
});
this.setState({locations : location.data});
console.log(this.state.locations)

let mealtype = await axios({
  method : 'GET',
  url : 'http://localhost:8100/mealtypes',
  headers : {'content-type' : 'application/json'}
});
this.setState({mealtypes : mealtype.data});}


  render() {
    return (
      <div>
    <Wallpaper ddlocation={this.state.locations}/>
    <QuickSearches quicksearch={this.state.mealtypes}/>
      </div>
    )
  }
}

export default Zomoto