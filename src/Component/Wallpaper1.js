import React, { Component } from 'react'
import './style10.css'
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import Header from '../HeaderComp/Header';


class Wallpaper1 extends Component {
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
    const result = await axios({
      method: 'GET',
      url: 'http://localhost:8900/restaurants',
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
      url: `http://localhost:8900/restaurants/${location_id}`,
      headers: { 'Content-Type': 'application/json' }
    });
    this.setState({ restaurantList: result.data });
    console.log("Restaurants"+result.data)
  };

  handleSearch = (event) => {
    const { restaurantList, restaurants } = this.state;
    const text = event.target.value;
    this.setState({ text });
    if (restaurantList.length === 0) {
      const result = text.length > 0 ? restaurants.filter(item => item.name.toLowerCase().includes(text.toLowerCase())) : [];
      this.setState({ suggestions: result }); 
    } else 
    {
      const filteredRestaurants = text.length > 0 ? restaurantList.filter(item => item.name.toLowerCase().includes(text.toLowerCase())) : [];
      this.setState({ suggestions: filteredRestaurants }); console.log(restaurantList.length,filteredRestaurants)
    }

  }
  //Navigate intenally to Display Page
  handleNavigate = (id) => {
    this.props.history.push(`/details?restaurant=${id}`);
  }

  // //Display Modal
  // handleLogin = ()=>{
  // this.setState({loginModalIsOpen:true});
  // }  

  // //Close Modal
  // handleCancel = ()=>{
  //   this.setState({loginModalIsOpen:false});
  //   }  
  render() {
       // Destructure the locations value props variable which is coming from homepage component.
       const { ddlocations } = this.props;
       const { suggestions, text,loginModalIsOpen } = this.state;
    return (
      <div>
        <Header/>
        {/* <div className="NavBar" >
        <div className="logoE" >e!</div>
                      <div className="NavBar-Box">
                        <button className="LoginButton" onClick={this.handleLogin}>Login</button>
                        <button className="CreateButton">Create an Account</button>
                      </div>
         </div> */}
        <img src="/images/background.jpeg" alt="Image cannot be displayed" className="HomeImg"/>
          
    <div className="topSection">
        <div className="logo">e!</div>
        <h1 style={{color: 'white'}}> Find the best Restaurants</h1>
        <div className="searchOptions">  
            <span>
                <select className="locationBox"   onChange={this.handleLocationChange}>
                    <option value="LOC" >Select a Location</option>
                    {ddlocations.map((item) => {
                        return (
                    <option value={item.location_id}>
                              {item.name}
                    </option>
                  );
                })}
                </select> 
            </span>
            
            <span className="searchBox">
                <img src="/images/search.svg" alt="Image not found" className="searchLogo"/>
                <input type="text"  className="searchInput" placeholder="Search for the Restaurant" onChange={this.handleSearch}/>
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
            </span>
        </div>
    </div>

  
      </div>
    )
  }
}
export default Wallpaper1;