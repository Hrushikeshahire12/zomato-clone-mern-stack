import React, { Component } from 'react'
import Header from './Header';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import './Style/Style.css'

class Wallpaper extends Component {
  constructor() {
    super();
    this.state = {

      restaurantList: [],
      restaurants: [],
      suggestions: [],
      text: ''
    }
  }

  componentDidMount = async () => {
    sessionStorage.clear();
    const result = await axios({
      method: 'GET',
      url: 'http://localhost:8100/restaurants',
      headers: { 'Content-Type': 'application/json' }
    });
    this.setState({ restaurants: result.data });
    console.log(result.data)
  }
  // get the value from locations dropdown menu.
  handleLocationChange = async (event) => {
    const location_id = event.target.value;
    // save into session storage.
    sessionStorage.setItem("location_id", location_id);
    const result = await axios({
      method: 'GET',
      url: `http://localhost:8100/Restaurants/${location_id}`,
      headers: { 'Content-Type': 'application/json' }
    });
    this.setState({ restaurantList: result.data });
    console.log(result.data)
  };

  handleSearch = (event) => {
    const { restaurantList, restaurants } = this.state;
    const text = event.target.value;
    this.setState({ text });
    if (restaurantList.length === 0) {
      const result = text.length > 0 ? restaurants.filter(item => item.name.toLowerCase().includes(text.toLowerCase())) : [];
      this.setState({ suggestions: result });
    } else {
      const filteredRestaurants = text.length > 0 ? restaurantList.filter(item => item.name.toLowerCase().includes(text.toLowerCase())) : [];
      this.setState({ suggestions: filteredRestaurants }); console.log(restaurantList.length, filteredRestaurants)
    }

  }
  //Navigate intenally to Display Page
  handleNavigate = (id) => {
    this.props.history.push(`/Details?restaurant=${id}`);
  }

  render() {
    const { ddlocation } = this.props;
    const { suggestions, text, loginModalIsOpen } = this.state;
    return (
      <div>

        <div className="topDiv">
          {/* <div className="button">
            <button className="btn1">Login</button>
            <button className="btn2">Create an account</button>
        </div> */}
          <Header />
          

<div style={{}}>
          <h2 style={{ color: "black",fontSize:"50px",fontWeight:"50px",marginleft:"200px"}}>
            Find the best restaurants, cafés <br />and bars in India
          </h2>
          </div>

          <select name="city" id="city" onChange={this.handleLocationChange} style={{width:"200px",fontSize:"20px",height:"30px"}}>
            <option value="hellolocation" style={{width:"200px",fontSize:"20px"}}>select locations</option>
           
            {ddlocation.map((item) => {
              return (
                <option value={item.location_id}>
                  {item.name}
                </option>
              );
            })}

          </select>

          {/* <img className="search_icon" src="search.svg" alt="image not found" />  */}

          <label for="browser"></label>
          {/* <img className="search_icon" src="search.svg" alt="image not found" />  */}

          <input list="browser" name="browser" id="browser" placeholder="Search for restaurants" onChange={this.handleSearch}style={{width:"200px",fontSize:"20px",height:"30px"}} />
          <div className='dropdown'>
            <div className='drop_box'>
              {suggestions.length > 0 ? suggestions.map((item) => {
                return <div className="search-result-restaurant-block" onClick={() => this.handleNavigate(item._id)}>

                  <div className="search-result-image-block">
                    <img src={item.thumb} height="43" width="43" style={{ borderRadius: '50%' }}></img>
                  </div>
                  <div className="search-result-restaurant-details">
                    <div className="search-result-restaurant-name"> {item.name}</div>
                    <div className="search-result-restaurant-address">{item.address}</div>
                  </div>
                  <div style={{ border: '1px solid #e9e9f2' }}></div>
                </div>
              }) : text.length > 0 ? <div className="no-result-block">
                <div className="no-result-message">No results found</div>
              </div> : null}
            </div>
          </div>
        </div>
      </div>
      
    )
  }
}
export default withRouter(Wallpaper)