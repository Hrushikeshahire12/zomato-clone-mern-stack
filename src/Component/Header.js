import React, { Component } from 'react'


import Modal from 'react-modal';
import { withRouter } from 'react-router-dom';
// import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import GoogleLogin from 'react-google-login';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px'

  }
};

export class Header extends Component {
  constructor() {
    super();
    this.state = {
      loginModalIsOpen: false,
      username: undefined,
      isLoggedin: false,
      imageUrl: undefined,
      loading: false,
      signupModalOpen: false,
      signinModalOpen: false,
      email: undefined,
      password: undefined,
      confirmPassword: undefined,
      signupError: "",

    }
  }
  debugger;
  responseGoogle = (response) => {
    console.log(response);
  }

 


handleHome = () => {
  this.props.history.push('/');
}





  handleSignup = () => {
    this.setState({ signupModalOpen: true });
  }

  closeSignupModal = () => {
    this.setState({ signupModalOpen: false, signupError: "", loading: false });
  }


  handlesSignupFields = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  }
  // This method get the values of input fields from login form
  handleLoginFields = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  }
  // This method will handle form validation of signup form
  handleSignupForm = (event) => {
    event.preventDefault();
    const { password, confirmPassword } = this.state;
    let condition = true;
    if (password !== confirmPassword) {
      condition = false;
      this.setState({ signupError: 'Password doesn"t match!' });
    }
    var lowerCaseLetters = /[a-z]/g;
    var numbers = /[0-9]/g;
    if (!numbers.test(password) || !lowerCaseLetters.test(password)) {
      condition = false;
      this.setState({ signupError: "Password should contains letters and numbers" });
    }
    if (condition) {
      this.signupFormApiCall();
    }

  }
  // This method will handle API call to register the new user 
  signupFormApiCall = async () => {
    this.setState({ loading: true });
    console.log(this.state.loading)
    const { username, email, password, confirmPassword } = this.state;

    const inputObj = {
      fullname: username,
      email: email,
      password: password
    }
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:8100/signup',
      headers: { 'Content-Type': 'application/json' },
      data: inputObj

    })
    if (result.data === false) {
      this.setState({ signupError: "you are already logged in! Please Sign in!", loading: false });
    } else {
      localStorage.setItem('loginData', JSON.stringify(this.state));
      // window.location.reload();
    }
  }
  switchToSignin = () => {
    this.setState({ signupModalOpen: false, loginModalIsOpen: true, signupError: "", loading: false });
  }
  //Display Modal
  handleLogin = () => {
    this.setState({ loginModalIsOpen: true });
  }


  switchToSignup = () => {
    this.setState({ loginModalIsOpen: false, signupModalOpen: true, signupError: "", loading: false });
  }

  closeLoginModal = () => {
    this.setState({ loginModalIsOpen: false });
  }


  closeSignupModal = () => {
    this.setState({ signupModalOpen: false });
  }




  render() {
    const { value, cartQty } = this.props;

    const { loginModalIsOpen } = this.state;
    const { signinModalOpen, signupModalOpen, isLoggedin, username, imageUrl, handleEmptyCart, openCart, cartMenuitems, loading } = this.state;
    return (
      <div>
        <div className="NavBar" style={{ background: 'red', height: '60px' ,margintop:"30px"}} >
          <div className="logoE" onClick={this.handleNavigate} >
         
          
            <div className="NavBar-Box" style={{display:'flex',justifyContent:"center"}}>
             
              <button style={{height:"50px",width:"50px",borderRadius:"50px",backgroundColor:"white",float:"left"}} onClick={this.handleHome} >e!</button>
             
             
              <button className="LoginButton" onClick={this.handleLogin} >Login</button>
              <button className="CreateButton" onClick={this.handleSignup} >Create an Account</button>
          
            

              </div>
             
           
          </div>
        </div>
        <Modal
          isOpen={signupModalOpen}
          style={customStyles}
        >

          {/* Google Login */}
          <GoogleLogin
            clientId="871265285127-6qu03tg5jehg04mg0nbo0su6f7anls7i.apps.googleusercontent.com"
            buttonText="Continue with Google"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
          <div className="container-login">

            <div className="wrap-login">
              <button className="login-close" onClick={this.closeSignupModal}>Cancel</button>
              <form className="login-form" onSubmit={this.handleSignupForm}>

                <div className="signin-with" style={{ justifyContent: 'normal' }}>Sign Up</div>
                <div style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{loading ? null : this.state.signupError}</div>

                <div class="wrap-input100 validate-input alert-validate" data-validate="Username is required">
                  <input class="input100 form-control" type="text" name="username" onChange={this.handlesSignupFields} placeholder="Full Name" required />
                </div>
                <div class="wrap-input100 validate-input alert-validate" data-validate="Username is required">
                  <input class="input100 form-control" type="email" name="email" onChange={this.handlesSignupFields} placeholder="Email" required />
                </div>
                <div class="wrap-input100 validate-input alert-validate" data-validate="Username is required">
                  <input class="input100 form-control" type="password" name="password" onChange={this.handlesSignupFields} placeholder="Password" minlength="8" required />
                </div>
                <div class="wrap-input100 validate-input alert-validate" data-validate="Username is required">
                  <input class="input100 form-control" type="password" name="confirmPassword" onChange={this.handlesSignupFields} placeholder="Confirm Password" minlength="8" required />
                </div>
                <div style={{ marginTop: '17px' }}>
                  <button type="submit" className="login-submit" disabled={loading}>{loading ? <i class="fa fa-refresh fa-spin"></i> : <i ></i>}Create account</button>
                </div>
                <div style={{ marginTop: '17px', fontSize: '16px', textAlign: 'center' }}>Already have an account? <a href="#" onClick={this.switchToSignin}>Sign in now</a></div>
              </form>
            </div>
          </div>


        </Modal>
        <Modal
          isOpen={loginModalIsOpen}
          style={customStyles}

        >
          <div>
            <button className="login-close" onClick={this.closeLoginModal}><span className="fa fa-times"></span>cancel</button>
            <h2>login</h2>
            <div style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{loading ? null : this.state.signupError}</div>

            <form className="login-form" onSubmit={this.handleLoginModal}>
              <div style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{loading ? null : this.state.signupError}</div>
              <div class="wrap-input100 validate-input alert-validate" data-validate="Username is required">
                <input class="input100 form-control" type="email" name="email" placeholder="Email" onChange={this.handleLoginFields} required />
              </div>
              <div class="wrap-input100 validate-input alert-validate" data-validate="Username is required">
                <input class="input100 form-control" type="password" name="password" placeholder="password" onChange={this.handleLoginFields} required />
              </div>
              <div style={{ marginTop: '17px' }}>
                <button className="login-submit" disabled={loading}>{loading ? <i class="fa fa-refresh fa-spin"></i> : <i ></i>}Sign In</button>
              </div>
              <div style={{ marginTop: '17px', fontSize: '16px', textAlign: 'center' }}>Don't have an account? <a href="#" onClick={this.switchToSignup}>Sign up now</a></div>
            </form>
          </div>



        </Modal>

      </div>
    )
  }
}
// 
export default withRouter(Header);