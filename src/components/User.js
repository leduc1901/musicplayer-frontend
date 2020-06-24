import React, { Component } from 'react'
import axios from "axios"
import {loggedIn , logOut} from "../actions/playerAction"
import {connect} from "react-redux"
import ActiveStorageProvider from 'react-activestorage-provider'

export class User extends Component {
  constructor(props){
    super(props)
    this.state = {
      name : "",
      email : "",
      password : "",
      avatar : "",
      newPhoto : ""
    }
  }

  handleImageChange = e => {
      if (e.target.files[0]) this.setState({ newPhoto: e.target.files[0] });
  };

  handleEmailChange = (e) => {
    this.setState({email : e.target.value})
  }

  handleNameChange = (e) => {
    this.setState({name : e.target.value})
  }

  handlePasswordChange = (e) => {
    this.setState({password : e.target.value})
  }

  componentDidMount(){
    this.getUserInfo()

  }

  async uploadImage(){
    const formData = new FormData();
    formData.append("file", this.state.newPhoto);
    try{
      const photo = await axios.patch(`/users/${this.props.id}`, formData , {headers : {'Authorization': this.props.token}})
      this.getUserInfo()
    }catch(e){
      const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
      this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id)
      const photo = await axios.patch(`/users/${this.props.id}`, formData , {headers : {'Authorization': this.props.token}})
      this.getUserInfo()
    }
  }

  async getUserInfo(){
    try {
      const user = await axios.get(`/users/${this.props.id}` , {headers : {'Authorization': this.props.token}} )
      this.setState({name : user.data.name , email : user.data.email , avatar : user.data.avatar})
    } catch (error) {
      const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
      this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id)
      const user = await axios.get(`/users/${this.props.id}` , {headers : {'Authorization': this.props.token}} )
      this.setState({name : user.data.name , email : user.data.email , avatar : user.data.avatar})
    }
  }

  renderUpdateForm = () => {
    return (
      <div class="login100-form validate-form">
    <span class="login100-form-title p-b-26">
        Welcome
    </span>
    
    
    <div class="wrap-input100 validate-input" data-validate = "Valid email is: a@b.c">
        <input class="input100" type="text" onChange={(e) => this.handleNameChange(e)} />
        <span class="focus-input100" data-placeholder="Name"></span>
    </div>

    <div class="wrap-input100 validate-input" data-validate = "Valid email is: a@b.c">
        <input class="input100" type="text" name="email" onChange={(e) => this.handleEmailChange(e)} />
        <span class="focus-input100" data-placeholder="Email"></span>
    </div>

    <div class="wrap-input100 validate-input" data-validate="Enter password">
        <span class="btn-show-pass">
            <i class="zmdi zmdi-eye"></i>
        </span>
        <input class="input100" type="password" onChange={(e) => this.handlePasswordChange(e)}/>
        <span class="focus-input100" data-placeholder="Password"></span>
    </div>

    <div class="wrap-input100 validate-input" data-validate="Enter password">
        <span class="btn-show-pass">
            <i class="zmdi zmdi-eye"></i>
        </span>
        <input class="input100" type="file" />
        <span class="focus-input100" data-placeholder="Avatar"></span>
    </div>


    <div class="container-login100-form-btn">
        <div class="wrap-login100-form-btn">
            <div class="login100-form-bgbtn"></div>
            <button class="login100-form-btn" >
                Update
            </button>
        </div>
    </div>

   
</div>
    )
  }

  render() {

    

    return (
      <div>
       
        <img src={this.state.avatar} />
        <input type="file" name="newPhoto"accept="image/png, image/jpeg" onChange={this.handleImageChange}/>
        <button onClick={this.uploadImage.bind(this)}>Upload</button>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
      email : state.email,
      token : state.token,
      password : state.password,
      loggedIn : state.loggedIn,
      id : state.id
  }
}

function mapDispatchToProps(dispatch){
  return {
      dispatchLoggedIn : (email, password, token , id) => dispatch(loggedIn(email, password, token , id)),
      dispatchLogOut : () => dispatch(logOut())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(User)