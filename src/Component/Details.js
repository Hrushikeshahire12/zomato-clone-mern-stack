
import React, { Component } from 'react';
// import './detailsPage.css'
import Header from './Header';
import queryString from 'query-string';
import axios from 'axios';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import StripeCheckout from 'react-stripe-checkout';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

 class Details extends Component {

    constructor() {
        super();
        this.state = {
            restaurant:{},
            restaurant_id:undefined, 
            menuItems: [], 
            galleryModalIsOpen: false,
            menuModalIsOpen: false,
            orderMenuItems:[],
            paymentForm:false,
            isPaymentSuccess:false
        }}

    componentDidMount = async () => {
        // Get the restaurant ID from query-string.
        const qs = queryString.parse(this.props.location.search);
        const restaurant_id = qs.restaurant;
        const open = qs.open;
        console.log(restaurant_id);
        const result = await axios({
            method: "GET",
            url: `http://localhost:8100/Rest/${restaurant_id}`,
            headers: { 'Content-Type': 'application/json' }
        })
        console.log("This is the result")
        this.setState({ restaurant: result.data, restaurant_id });
        // console.log(result)
    }

    // Below two methods for tab
    openOverview = () => {
        this.setState({ content_value: 1 });
    }
    openContact = () => {
        this.setState({ content_value: 2 });
    }

    // This is image-gallery modal open method and close method
    handleGalleryModal = () => {
      this.setState({ galleryModalIsOpen: true });
  }
  closeModal = () => {
      this.setState({ galleryModalIsOpen: false });
  }
  menuModalIsOpen = () => {
    this.setState({   menuModalIsOpen: false });
  }
  closeMenuModal  = () => {
    this.setState({   menuModalIsOpen: false });
  }

  // Thihandles is hotel menu modal open method
  handleMenuModal = async () => {
    const { restaurant_id } = this.state;
    this.setState({ menuModalIsOpen: true });
    // API call to fetch the restaurant menu details.
    const result = await axios({
        method: 'GET',
        url: `http://localhost:8100/getmenu/${restaurant_id}`,
        headers: { 'Content-Type': 'application/json' }
    });
    this.setState({ menuItems: result.data[0].menu_items})
  }
 
  //Event handling to add/subtract menu items
  handleAdd = (index, operation_type) => {
    // let cart_value = localStorage.getItem('cartValue');
    // cart_value = JSON.parse(cart_value);
    // if user have items in cart he select items from other restaurant menu this handleAlert will open.
    // if (cart_value && this.state.restaurant.name != cart_value.restaurant.name) {
    //     const filterValue = cart_value.menuItems.filter(item => item.qty !== 0);
    //     this.setState({ handleAlert: true, oldCartRestaurant: cart_value.restaurant, cartMenuitems: filterValue });
    // } else
     {
        let total = 0;
        const { menuItems } = this.state;
        let items = [...menuItems];
        let item = items[index];
        console.log(item,index,items)
        if (operation_type === "add") {
            item.qty = item.qty + 1;
        }
        if (operation_type === "subtract") {
            item.qty = item.qty - 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
            console.log(total)
            
        })
        // Store the selected items in cart.
        // const filterData = items.filter((item) => item.qty != 0);
        // let cartQty = filterData.map(item => 1 * item.qty);
        // cartQty = cartQty.length > 0 ? cartQty.reduce((a, b) => a + b) : 0;
        // this.setState({ menuItems: items, subTotal: total, cartQty });
          this.setState({ menuItems: items, subTotal: total});
    }
}
    // This is menu modal closing method.
    closeModal= () => {
  this.setState({paymentForm: false });
    }
    // Click the continue button method on menu modal.
    handlePayButton = () => {
        const orderedItems = this.state.menuItems.filter((item) => item.qty != 0);
        if (orderedItems && this.state.subTotal > 0) {
            this.setState({ paymentForm: true, orderMenuItems: orderedItems });
        }
    }
        // if (orderedItems && this.state.subTotal > 0) {
        //     localStorage.setItem('cartValue', JSON.stringify(this.state));
        // }
        // const loginData = localStorage.getItem('loginData');
        // if (loginData) {
        //     this.setState({ paymentForm: true, orderMenuItems: orderedItems });
        // } else {
        //     localStorage.setItem('shouldLogin', true);
        //     this.setState({ shouldLogin: true, menuModalIsOpen: false });
        // }
        // localStorage.setItem('cartQty', this.state.cartQty);
    
    // In menu modal when click add or remove items this method will happens
    // this method is making payment with stripe-checkout
    makePayment = (token) => {
        this.setState({ loading: true });
        const { subTotal } = this.state;
        const productList = this.state.menuItems.filter((item) => item.price !== 0);
        const product = productList.map(item => item.name);
        const body = {
            token,
            product,
            subTotal
        };
        const headers = {
            "Content-Type": "application/json"
        };
        // Make the api call to make payment.
        return fetch(`http://localhost:8100/payment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        })
            .then(response => {
                console.log("RESPONSE ", response);
                const { status } = response;
                console.log("STATUS ", status);
                // Get the user address
                const address = {
                    name: token.card.name,
                    address_line: token.card.address_line1,
                    city: token.card.address_city
                }
                // Get the order time and date
                var d = new Date();
                const date = d.toString();

                // Remove cart values from cart once user ordered.
                localStorage.removeItem('cartValue');
                localStorage.removeItem('cartQty');
                // Store the order details, user-address, order-date and time in local storage.
                localStorage.setItem('orderData', JSON.stringify(this.state.orderMenuItems));
                localStorage.setItem('restaurant', JSON.stringify(this.state.restaurant));
                localStorage.setItem('subTotal', this.state.subTotal);
                localStorage.setItem('address', JSON.stringify(address));
                localStorage.setItem('date', date);
                this.setState({ cartQty: 0, isPaymentSuccess: true, paymentForm: false, menuModalIsOpen: false, subTotal: 0 });
            })
            .catch(error => console.log(error));
    };

  render() {
   
    const { restaurant, galleryModalIsOpen, menuModalIsOpen, menuItems, shouldLogin, subTotal, cartQty ,isPaymentSuccess} = this.state;

    return (
  
      <div>
          <Header/>
        <div>
        <img src={restaurant.thumb} className="detail-img" alt="restaurant-image" width="100%" height="352px" style={{ marginTop: "50px" }} />
                    <button className="gallery-button" onClick={this.handleGalleryModal}>Click to see Image Gallery</button>
                    <div className="restaurant-name">{restaurant.name}</div>
                    <button className="order-button" onClick={this.handleMenuModal}>Place Online Order</button>
        </div>

        {/* Rendering Overview and Contact */}
        <div className="btn-box">
           
                        <button className="btn-1" style={this.state.content_value == 1 ? { color: '#ce0505' } : { color: 'black' }} onClick={this.openOverview}>Overview</button>
                        
                        <button className="btn-2" style={this.state.content_value == 2 ? { color: '#ce0505' } : { color: 'black' }} onClick={this.openContact}>Contact</button>
                        
                    </div>
                    <div className="path" ></div>
                  < div style={{backgroundColor:"red"}}>
                    <div id="content1" className="content" style={this.state.content_value === 1 ? { display: 'block' } : { display: 'none' }}>
                        <div className="restaurant-name2" style={{ marginTop: '20px', marginBottom: '30px',fontSize:"40px",fontWeight:"30px" }}>About this place</div>
                        <div className="cuisine-detail">Cuisine</div>
                        
                        <div className="address" style={{ marginBottom: '30px' }}>{restaurant.cuisine_id ? restaurant.cuisine_id.map(item => `${item.name} `) : null}</div>
                        <div className="cuisine-detail">Average Cost</div>
                        <div className="address" style={{ marginBottom: '0px' }}>₹{restaurant.cost} for two people (approx)</div>
                    </div>
                    <div id="content2" className="content" style={this.state.content_value === 2 ? { display: 'block' } : { display: 'none' }}>
                        <div className="phone-number" style={{ marginTop: '30px' }}>Phone Number</div>
                        <div className="number" style={{ marginBottom: '30px' }}>{restaurant.contact_number}</div>
                        <div className="restaurant-name2">{restaurant.name}</div>
                        <div className="address" style={{ marginBottom: '50px' }}>{restaurant.address}</div>
                    </div>
                    </div>
{/* This is Image-gallery maodal */}
<Modal

                        isOpen={galleryModalIsOpen}
                        style={customStyles}
                    >
                        <button className="carousel-closebutton" style={{ float: 'right', borderRadius: '50%' }} onClick={this.closeModal} ><span style={{ padding: '7px',backgroundColor:"black" }} className="glyphicon glyphicon-remove"></span></button>
                        <div>
                            <Carousel showThumbs={false}>
                           
                                <div >
                                    <img src="assets/breakfast.png" className="carousel-image" style={{width:"500px",height:"500px"}} />
                                </div>
                                <div>
                                    <img src="https://cdn.apartmenttherapy.info/image/fetch/f_auto,q_auto:eco/https://storage.googleapis.com/gen-atmedia/3/2018/08/1129fc706d9f16e36dc08d35154ab104d37dde44.jpeg" className="carousel-image" style={{width:"500px",height:"500px"}}/>
                                </div>
                                <div>
                                    <img src="https://th.bing.com/th/id/OIP.SgW3_9rZWJt4M2mhGiiThgHaEK?w=317&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" className="carousel-image" style={{width:"500px",height:"500px"}}/>
                                </div>
                                <div>
                                    <img src="https://th.bing.com/th?id=OIP.cDMP2VoRSQPyGf_NqOGfPQHaHr&w=245&h=254&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" className="carousel-image" style={{width:"500px",height:"500px"}} />
                                </div>
                                <div>
                                    <img src="https://th.bing.com/th?id=OIP.kVdospZcbTYAoMVBp7JmmQHaKC&w=214&h=291&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" className="carousel-image" style={{width:"500px",height:"500px"}}/>
                                </div>
                                <div>
                                    <img src="assets/nightlife.png" className="carousel-image" style={{width:"500px",height:"500px"}}/>
                                </div>
                         
                            </Carousel>
                        </div>
                    </Modal>
{/* Disply menu items */}
<Modal
isOpen={menuModalIsOpen}
style={customStyles}
contentLabel="Example Modal"
>

{/* <button onClick={this.closeMenuModal}>close</button> */}
<button className="carousel-button" onClick={this.closeMenuModal}><span style={{ padding: '7px' }} className="glyphicon glyphicon-remove"></span>close</button>
                        <div className="menu-modal">

                            <div className="container">
                                <div className="restaurant-menu-title">{restaurant.name}</div>
                                {menuItems.map((item, index) => {
                                    return <div>
                                        <div className="green-rectangle">
                                            <div className="green-dot"></div>
                                        </div>
                                        <div style={{ display: 'inline-block' }}>
                                            <div className="Gobi-Manchurian">{item.name}</div>
                                            <div className="menu-price">₹{item.price}</div>
                                            <div className="menu-content">{item.description}</div>
                                        </div>
                                        <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
                                            <img src={item.image_url} alt="" height="92" width="92" style={{ borderRadius: '10px' }} />
                                            {item.qty === 0 ? <div className="add-button" onClick={() => this.handleAdd(index, "add")}>Add</div> :
                                                <div style={{ textAlign: 'center' }}>
                                                    <span style={{ fontSize: '15px', color: 'grey', fontWeight: '600', marginRight: '10px', cursor: 'pointer' }} onClick={() => this.handleAdd(index, "subtract")}>-</span>
                                                    <span style={{ fontSize: '15px', color: '#61b246', fontWeight: '600', marginRight: '10px' }}>{item.qty}</span>
                                                    <span style={{ fontSize: '15px', color: '#61b246', fontWeight: '600', marginRight: '10px', cursor: 'pointer' }} onClick={() => this.handleAdd(index, "add")}>+</span>
                                                </div>}
                                        </div>
                                        <div style={index === menuItems.length - 1 ? { display: 'none' } : { display: 'block' }} className="Path-6229"></div>
                                    </div>
                                })}
                            </div>
                            <div className="Rectangle-3352">
                                <span className="Subtotal" >Subtotal</span>
                                <span className="Subtotal-price"> ₹ {subTotal}</span>
                                <button className="Rectangle-3353" onClick={this.handlePayButton} style={{fontSize:"35px",marginLeft:"50px"}}>Continue</button>
                            </div>
                        </div>
</Modal>
<Modal
 
                        isOpen={this.state.paymentForm}
                        style={customStyles}>
                             <button className="payment-form-button"  onClick={this.closeModal}>Go to Back</button> 
                     
                        {this.state.subTotal > 0 ? <div style={{ width: '400px' }}>
                            <h1 style={{ margin: '10px' }}>Order Summary</h1>
                            <div style={{ height: '350px' }}>
                                <div style={{ padding: '10px', background: 'rgb(248, 248, 248)' }}>
                                    <div style={{ fontSize: '24px', fontWeight: '600px', color: '#192f60' }}>{restaurant.name}</div>
                                    <div style={{ fontSize: '14px' }}>{restaurant.locality}, {restaurant.city_name}</div>
                                </div>

                                {this.state.orderMenuItems.map((item) => {
                                    return <div>
                                        <img src={item.image_url} alt="" height="50" width="50" style={{ borderRadius: '10px', margin: '10px' }} />
                                        <span style={{ fontSize: '12px' }}>{item.qty} &#215; {item.name}</span>
                                        <span style={{ fontSize: '12px', margin: '25px 10px 0 0px', float: 'right' }}>₹{item.qty * item.price}</span>
                                        <hr style={{ margin: '0' }} />
                                    </div>
                                })}
                                <div style={{ padding: '10px' }}>
                                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Grandtotal</span>
                                    <span style={{ fontSize: '18px', float: 'right', fontWeight: 'bold' }}>₹{this.state.subTotal}</span>
                                </div>
                                <hr />
                            </div>


                            <div className="payment-form-footer">
                           
                                <StripeCheckout
                                    stripeKey="pk_test_51O7vK8SCU10lo8i8vPEx09B1V8cKK3kasZnwalN0dDQ3tJvCcymm7rfdxBKV3bTiTga1x1VaoRxKDKPX1xmXYPIh00r3SOsaoR"
                                    
                                    token={this.makePayment}
                                    name={restaurant.name}
                                    amount={this.state.subTotal * 100}
                                    currency="INR"
                                    image={restaurant.thumb}
                                    shippingAddress
                                    billingAddress
                                    alipay
                                    bitcoin
                                >
                                    <button className="payment-form-button">Proceed</button>
                                   
                                </StripeCheckout>
                            </div> </div> : <div style={{ padding: '10px', color: 'orange', width: '300px', fontSize: '16px', fontWeight: 'bold' }}>Please select the items!!!</div>}
                           
                    </Modal>
                    <Modal
        isOpen={isPaymentSuccess}
        style={customStyles}
        contentLabel="Succcesful Transaction"
      >
        <div>
          <button onClick={this.closePaymentSuccess}>
              <img src="./assets/Success.png" style={{height: '250px', width: '100vw',background:"transparent"}} />
          </button>
        </div>
      </Modal>
</div>
    )
  }
}

export default Details;





// import React, { Component } from 'react';
// // import './detailsPage.css'
// import queryString from 'query-string';
// import axios from 'axios';
// import Modal from 'react-modal';
// // import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from 'react-responsive-carousel';

// const customStyles = {
//   content: {
//     top: '50%',
//     left: '50%',
//     right: 'auto',
//     bottom: 'auto',
//     marginRight: '-50%',
//     transform: 'translate(-50%, -50%)',
  
//   },
// };

//  class Details extends Component {

//     constructor() {
//         super();
//         this.state = {
//             restaurant:{},
//             restaurant_id:undefined, 
//             menuItems: [], 
//             galleryModalIsOpen: false,
//             menuModalIsOpen: false,
//         }}

//     componentDidMount = async () => {
//         // Get the restaurant ID from query-string.
//         const qs = queryString.parse(this.props.location.search);
//         const restaurant_id = qs.restaurant;
//         const open = qs.open;
//         console.log(restaurant_id);
//         const result = await axios({
//             method: "GET",
//             url: `http://localhost:8100/Rest/${restaurant_id}`,
//             headers: { 'Content-Type': 'application/json' }
//         })
//         console.log("This is the result")
//         this.setState({ restaurant: result.data, restaurant_id });
//         console.log(result)
//     }

//     // This is image-gallery modal open method and close method
//     GalleryModal = () => {
//       this.setState({ galleryModalIsOpen: true });
//   }
//   closeModal = () => {
//       this.setState({ galleryModalIsOpen: false });
//   }


//   // Thihandles is hotel menu modal open method
//   handleMenuModal = async () => {
//     const { restaurant_id } = this.state;
//     this.setState({ menuModalIsOpen: true });
//     // API call to fetch the restaurant menu details.
//     const result = await axios({
//         method: 'GET',
//         url: `http://localhost:8100/getmenu/${restaurant_id}`,
//         headers: { 'Content-Type': 'application/json' }
//     });
//     this.setState({ menuItems: result.data[0].menu_items})
//   }
 
//     // This is menu modal closing method.
//     closeMenuModal = () => {
//   this.setState({ menuModalIsOpen: false });
//     }

//   render() {
//     const { restaurant, galleryModalIsOpen, menuModalIsOpen, menuItems, shouldLogin, subTotal, cartQty } = this.state;

//     return (
//       <div>
//         <div>
//         <img src={restaurant.thumb} className="detail-img" alt="restaurant-image" width="100%" height="352px" style={{ marginTop: "50px" }} />
//                     <button className="gallery-button" onClick={this.handleGalleryModal}>Click to see Image Gallery</button>
//                     <div className="restaurant-name">{restaurant.name}</div>
//                     <button className="order-button" onClick={this.handleMenuModal}>Place Online Order</button>
//         </div>
      

// <Modal
// isOpen={menuModalIsOpen}
// style={customStyles}
// contentLabel="Example Modal"
// >

// <button onClick={this.closeMenuModal}>close</button>
// <button className="carousel-button" onClick={this.closeMenuModal}><span style={{ padding: '7px' }} className="glyphicon glyphicon-remove"></span></button>
//                         <div className="menu-modal" style={{backgroundColor:"pink",fontSize:"35px"}}>

//                             <div className="container">
//                                 <div className="restaurant-menu-title">{restaurant.name}</div>
//                                 {menuItems.map((item, index) => {
//                                     return <div>
//                                         <div className="green-rectangle">
//                                             <div className="green-dot"></div>
//                                         </div>
//                                         <div style={{ display: 'inline-block' }}>
//                                             <div className="Gobi-Manchurian">{item.name}</div>
//                                             <div className="menu-price">₹{item.price}</div>
//                                             <div className="menu-content">{item.description}</div>
//                                         </div>
//                                         <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
//                                             <img src={item.image_url} alt="" height="92" width="92" style={{ borderRadius: '10px' }} />
//                                             </div>
//                                             </div>})
//                                 }
//                               </div>
//                           </div>    
// </Modal>
// </div>
//     )
//   }
// }

// export default Details;