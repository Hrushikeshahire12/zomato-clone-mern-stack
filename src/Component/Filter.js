import React, { Component } from 'react'
// import './style11.css'
// import './Style/style1.css'
// import Header from '../HeaderComp/Header'
import './Style/Style.css'
import Header from './Header';
import queryString from 'query-string'
import axios from 'axios'


export  class Filter extends Component {
  constructor() {
    super();
    this.state = {
        restuarant: [],          // Whole restuarant data.
         option: "",              // This shows heading based on what mealtypes we clicks. (ex) Breakfast places in delhi.
        currentPage: 1,           // This is current page which default value is 1.
        itemsPerPage: 2,         // This how many restaurant data will show per page. ideally 2.
        mealtype_id: undefined,  // This is mealtype_id
        location_id: undefined,  // This is location_id
        sort: 1,                 // This is sort value. if (1) = Ascending order , (-1) = Descending order.
        cuisine_id: [],          // This is cuisine_id. Initially empty array.
        lcost: undefined,        // This is minimum price for restaurant.
        hcost: undefined,        // This is maximum price for restaurant.
        location: []             // This is locations dropdown data.
    }
}

    componentDidMount = async () => {
      // Get the values from query string which is coming from homepage, Quick Search component
      const qs = queryString.parse(this.props.location.search);
      const location = qs.location;
      const mealtype = Number(qs.mealtype);
      const mealtype_name = qs.mealtype_name;

      this.setState({ option: mealtype_name });
      // Declare the locations and mealtypes value in payload.
      const inputObj = {
          location_id: location,
          mealtype_id: mealtype
      }

      // Making api call to fetch the restaurant data based on payload.
      const restuarant = await axios({
          method: 'POST',
          url: 'http://localhost:8100/filter',
          headers: { 'Content-Type': 'application/json' },
          data: inputObj
      })
      // once get the value then update the state variable.
      this.setState({ restuarant: restuarant.data, mealtype_id: mealtype, location_id: location });

      // Making api call for locations data to showing drop-downs filters.
      const locationDD = await axios({
        method: 'GET',
        url: 'http://localhost:8100/locations',
        headers: { 'Content-Type': 'application/json' }
    });
    // Update the location variable in state.
    this.setState({ location: locationDD.data });
    // console.log("Hello",this.state.location)
}


    // User clicks locations drop down menu this will execute.
    handleLocationChange = async (event) => {
      // Getting the location id from drop-down.
      const location_id = event.target.value;
      console.log(location_id);
      const { sort, mealtype_id, lcost, hcost, cuisine_id } = this.state;

      // Loading the all values in payload.
      const inputObj = {
          sort: sort,
          mealtype_id: mealtype_id,
          location_id: location_id,
          lcost: lcost,
          hcost: hcost,
          // if cuisine_id is empty array, this function willn't work so set the value as undefined.
          cuisine_id: cuisine_id && cuisine_id.length > 0 ? cuisine_id : undefined
      }
      // Making the api call to get location based restaurant data.
      const restuarant = await axios({
          method: 'POST',
          url: 'http://localhost:8100/filter',
          headers: { 'Content-Type': 'application/json' },
          data: inputObj
      });
      // Once get the data, then update restaurant, location id and page number in 1.
      this.setState({ restuarant: restuarant.data, location_id, currentPage: 1 });
  }
  
  
   // User clicks on cuisine check-box this function will execute.
   handleCuisineChange = async (value) => {
    //get all values from the checkbox and slice the values into tempArray, if repeated selection splice it
    let tempArray = this.state.cuisine_id.slice();
    if (tempArray.indexOf(value) === -1) {
        tempArray.push(value);
    } else {
        tempArray.splice(tempArray.indexOf(value), 1);
    }

    const { sort, mealtype_id, location_id, lcost, hcost } = this.state;
    // Loading the all values in payload.
    const inputObj = {
        sort: sort,
        mealtype_id: mealtype_id,
        location_id: location_id,
        lcost: lcost,
        hcost: hcost,
        cuisine_id: tempArray.length > 0 ? tempArray : undefined
    }
    // Making the api call to fetch the cuisine based restaurant data.
    const restuarant = await axios({
        method: 'POST',
        url: 'http://localhost:8100/filter',
        headers: { 'Content-Type': 'application/json' },
        data: inputObj
    });
    // Once get the data, then update restaurant, cuisne id and page number in 1.
    this.setState({ restuarant: restuarant.data, cuisine_id: tempArray, currentPage: 1 });
}


    // User clicks the cost  button this function will execute.
    handleCost = async (lcost, hcost) => {
      const { sort, mealtype_id, location_id, cuisine_id } = this.state;
      // loading all values in payload.
      const inputObj = {
          sort: sort,
          mealtype_id: mealtype_id,
          location_id: location_id,
          lcost: lcost,
          hcost: hcost,
          // if cuisine_id is empty array, this function willn't work so set the value as undefined.
          cuisine_id: cuisine_id && cuisine_id.length > 0 ? cuisine_id : undefined

      }
      // making api call to get expected cost based restaurant data.
      const restuarant = await axios({
          method: 'POST',
          url: 'http://localhost:8100/filter',
          headers: { 'Content-Type': 'application/json' },
          data: inputObj
      });
      // Once get the data, then update restaurant, lcost, hcost and page number in 1.
      this.setState({ restuarant: restuarant.data, lcost, hcost, currentPage: 1 });
    }    

      
    // User clicks the sort button this function will execute.
    handleSort = async (sort) => {
      const { mealtype_id, location_id, lcost, hcost, cuisine_id } = this.state;
      // loading the values in payload
      const inputObj = {
          sort: sort,
          mealtype_id: mealtype_id,
          location_id: location_id,
          lcost: lcost,
          hcost: hcost,
          // if cuisine_id is empty array, this function willn't work so set the value as undefined.
          cuisine_id: cuisine_id && cuisine_id.length > 0 ? cuisine_id : undefined
      }
      // Making api call to sorting data.
      const restuarant = await axios({
          method: 'POST',
          url: 'http://localhost:8100/filter',
          headers: { 'Content-Type': 'application/json' },
          data: inputObj
      })
      // Once get the data, then update restaurant, sort and page number as 1.
      this.setState({ restuarant: restuarant.data, sort, currentPage: 1 })
  }

   // User clicks the pagenumber will upadate current page number in state.
   handleClickPage = (event) => {
    this.setState({ currentPage: Number(event.target.id) });
}

handlePrev = () => {
    this.setState({ currentPage: this.state.currentPage - 1 });
}

handleNext = () => {
    this.setState({ currentPage: this.state.currentPage + 1 });
}

handleViewRestaurant = (id) => {
    this.props.history.push(`/Details?restaurant=${id}`);
}

  render() {

    const { restuarant,location,itemsPerPage,currentPage} = this.state;
     // This is the pagination logic to showing restaurant data per page.
     const lastIndex = currentPage * itemsPerPage;
     const firstIndex = lastIndex - itemsPerPage;
     const currentRestuarant = restuarant.slice(firstIndex, lastIndex);
     let result;

             // Calculating the total page numbers and push into new array.
             const pageNumbers = [];
             for (let i = 1; i <= Math.ceil(restuarant.length / itemsPerPage); i++) {
                 pageNumbers.push(i);
             }   
             // iterating the page numbers and showing in display with styling.
     
             // This is the logic for prev button in pagination
             let prevButton;
             if (pageNumbers.length === 1) {
                 prevButton = <li style={{ display: 'none' }}><a href="#" className="page-link" >Prev</a></li>
             }
             if (pageNumbers.length > 1) {
                 prevButton = <li className="page-list"><a href="#" className="page-numbers" onClick={this.handlePrev}>{`<`}</a></li>
             }
             if (currentPage === 1 && pageNumbers.length > 1) {
                 prevButton = <li className="page-list disabled"><a className="page-numbers" >{`<`}</a></li>
             }
             // This is the logic for next button in pagination
             let nextButton;
             if (pageNumbers.length === 1) {
                 nextButton = <li style={{ display: 'none' }}><a href="#" className="page-link" >Next</a></li>
             }
             if (pageNumbers.length > 1) {
                 nextButton = <li className="page-list"><a href="#" className="page-numbers" onClick={this.handleNext}>{`>`}</a></li>
             }
             if (currentPage === pageNumbers.length && pageNumbers.length > 1) {
                 nextButton = <li className="page-list disabled"><a className="page-numbers">{`>`}</a></li>
             }
             // Rendering page numbers
             let renderPageNumbers = pageNumbers.map(number => {
                 return (
                     <li key={number} className="page-list">
                         <a className="page-numbers" style={currentPage === number ? { background: '#192f60', color: '#fff' } : {}} href="#" id={number} onClick={this.handleClickPage}>{number}</a>
                     </li>
                 )
             })

             result= (currentRestuarant.length>0) ? currentRestuarant.map((item)=>{
                return     <div className="rightGridItem1" >
                <div className="col-sm-12" onClick={() => this.handleViewRestaurant(item._id)} style={{ cursor: 'pointer' }}>
                
                <div> <img src={item.thumb }alt="Image cannot be displayed" className="imgUdipi" 
                  style={{ borderRadius: "25px" }} />
                   </div>
               <div  className="spanUdipi" style ={{fontSize:'25px',display:'flex',justifyContent:'space-between',gap:"10px",margin:"20px",marginTop:'60px'}} >{item.name}</div>
             
                 
                    {item.address}
                
                            <div>
                 Address   :{item.locality }
                 </div>
                 </div>
                 
                <div> Cuisine   :{item.cuisine_id.map((cuis) => cuis.name + " ")}</div>
                <div>   Cost For Two:₹{item.cost}</div>
                </div>           
            
             }):<div style={{color:'red',textAlign:'center',fontSize:'35px',fontWeight:'bold'}}>No Restaurants in this Category</div>
 

    return (
      <div>
          <Header/>
  
          

        <h1>Breakfast Places in Mumbai</h1>


     <div className="parentContainer" >
        <div className="leftDiv" style={{backgroundColor:"pink",borderRadius:"1rem",gap:"30px"}}>
                <h3> Filters</h3> 
                <h3>Select Location</h3>
                <select className="Location" onChange={this.handleLocationChange}>
                  {location.map((item)=>{
                    return <option value={item.location_id}>{item.name}</option>
                  })}
             
                </select>

                <div className="Cuisine"><h3>Cuisine</h3>                
                <input type="checkbox" name="north" value="N_Indian" onChange={() => this.handleCuisineChange(1)}/>
                <label for="north"> North Indian</label><br/>
                <input type="checkbox"  name="south" value="S_Indian" onChange={() => this.handleCuisineChange(2)}/>
                <label for="south"> South Indian</label><br/>
                <input type="checkbox"  name="chinese" value="Chinese" onChange={() => this.handleCuisineChange(3)}/>
                <label for="chinese"> Chinese</label><br/>
                <input type="checkbox"  name="ffood" value="F_Food" onChange={() => this.handleCuisineChange(4)}/>
                <label for="ffood"> Fast Food</label><br/>
                <input type="checkbox"  name="sfood" value="S_Food"onChange={() => this.handleCuisineChange(5)}/>
                <label for="sfood"> Street Food</label>
                </div>

                <div className="cost2Div" > <h3>Cost for two</h3>
                <input type="radio" className="cuisinoption" name="cost" onChange={() => this.handleCost(1, 500)}/>
                <label>Less Than &#8377;500</label>
         
    <br/>
                <input type="radio" className="cuisinoption" name="cost"onChange={() => this.handleCost(500,1000)}/>
                <label>&#8377;500 to &#8377;1000</label>
                
                </div>
    
                <div className="CusineOptions">
                <input type="radio" className="cuisinoption" name="cost" onChange={() => this.handleCost(1000, 1500)}/>
                <label>&#8377;1000 to &#8377;1500</label>
              
    <br/>
                <input type="radio" className="cuisinoption" name="cost" onChange={() => this.handleCost(1500, 2000)}/>
                <label>&#8377;1500 to &#8377;2000</label>
                
    <br/>
                <input type="radio" className="cuisinoption" name="cost" onChange={() => this.handleCost(2000, 2500)}/>
                <label>&#8377;2000+</label>
                
                </div>

              <div className="sort"><h3>Sort</h3>
              <input type="radio" className="cuisinoption" name="price" onChange={() => this.handleSort(1)}/>
              <label>price low to high</label>
             
  <br/>
              <input type="radio" className="cuisinoption" name="price" onChange={() => this.handleSort(-1)}/>
              <label>price high to low</label>
             
            </div>  
            
        </div>
        <div className="rightDiv" style={{borderRadius:"1rem"}}>
        
         
            <div class="Pagination">
               
                {result}
               
                <div style={{display:"flex",justifyContent:"center",textDecoration:"none",fontsize:"40px"}} >
                 
                                        {/* Rendering Page numbers */}
                                        {prevButton}
                                        {renderPageNumbers}
                                        {nextButton}
                   
                </div>
   
      </div>
      </div> 
      
      </div>
      </div>
     
    )
  }
}
export default Filter





