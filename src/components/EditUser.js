import React, { Component } from 'react'
import axios from "axios"
import {loggedIn , logOut} from "../actions/playerAction"
import {connect} from "react-redux"
import   Sidebar  from "./Sidebar"

export class EditUser extends Component {
  constructor(props){
    super(props)
    this.state = {
      name : "",
      email : "",
      password : "",
      passwordConfirmation: "",
      avatar : "",
      newPhoto : "",
      trueName : "",
      id : null
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

  handlePasswordConfirmation = (e) => {
    this.setState({passwordConfirmation: e.target.value})
  }

  componentDidMount(){
      let id1 = this.props.match.params.id
      this.getUserInfo(id1)
      this.setState({id : id1} , () => {console.log(this.state.id)})
      
  }

  updateAll = () => {
    if(this.state.newPhoto != ""){
      this.updateUser()
    }else{
      alert("pls select image")
    }
    
  }


  async updateUser(){
    const formData = new FormData();
        formData.append("file", this.state.newPhoto);
        formData.append('name', this.state.name)
        formData.append('email' , this.state.email)
        formData.append('password' , this.state.password)
        formData.append('password_confirmation' , this.state.passwordConfirmation)
    if(this.state.name != "" && this.state.email != "" && this.state.password != "" && this.state.passwordConfirmation != "" && this.state.name.length >= 6 && this.state.password.length >= 6){
      try{
        
        const photo = await axios.put(`/users/${this.state.id}`, formData, {headers : {'Authorization': this.props.token}}).then(res => {
            this.getUserInfo(this.state.id)
            alert("Update Success")
        })  
      }catch(e){
        console.log(e.message)
        const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
        this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
        const photo = await axios.put(`/users/${this.state.id}`, formData, {headers : {'Authorization': this.props.token}}).then(res => {
            this.getUserInfo(this.state.id)
            alert("Update Success !")
        })
      }
    }else{
      alert("Empty or Password or Name not invalid")
    }
    
  }

  async getUserInfo(id){
    try {
      const user = await axios.get(`/users/${id}` , {headers : {'Authorization': this.props.token}} )
      console.log(user.data)
      this.setState({trueName : user.data.name , email : user.data.email , avatar : user.data.avatar})
    } catch (error) {
      console.log(error)
      const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
      this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
      const user = await axios.get(`/users/${id}` , {headers : {'Authorization': this.props.token}} )
      this.setState({trueName : user.data.name , email : user.data.email , avatar : user.data.avatar})
    }
  }

  render() {

    

    return (
      <div className="container">
        <Sidebar/>
        <div className="admin-container">
        <div className="admin-title">Edit Profile : {this.state.trueName}</div>
          <div className="update-container">
            <div className="update-part">
              <div className="admin-para">Username</div>
                  <div className="search-btn">
                    <i class="fa fa-user" aria-hidden="true"></i><input onChange={(e) => this.handleNameChange(e)} type="text" size="50" placeholder="Enter Your New Name" />
                  </div>
                  <div className="admin-para">Email</div>
                  <div className="search-btn">
                    <i class="fa fa-envelope" aria-hidden="true"></i><input onChange={(e) => this.handleEmailChange(e)} type="email" size="50" placeholder="Enter Your New Email" />
                  </div>
                  <div className="admin-para">Password</div>
                  <div className="search-btn">
                    <i class="fa fa-unlock-alt" aria-hidden="true"></i><input onChange={(e) => this.handlePasswordChange(e)} type="password" size="50" placeholder="Enter Your Password" />
                  </div>
                  <div className="admin-para">Password Confirmation</div>
                  <div className="search-btn">
                    <i class="fa fa-unlock-alt" aria-hidden="true"></i><input onChange={(e) => this.handlePasswordConfirmation(e)} type="password" size="50" placeholder="Enter Your Password" />
                  </div>
            </div>
            <div className="update-part">
              <img className="update-img" src={this.state.avatar != "" ? this.state.avatar : "/images/default-profile.png"} />
              <input type="file" name="newPhoto" accept="image/png, image/jpeg" onChange={this.handleImageChange}/>
              
            </div>
          </div>
          <button className="update-btn" onClick={this.updateAll}>Update</button>
        </div>
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
      id : state.id,
      role : state.role
  }
}

function mapDispatchToProps(dispatch){
  return {
      dispatchLoggedIn : (email, password, token , id , role) => dispatch(loggedIn(email, password, token , id , role)),
      dispatchLogOut : () => dispatch(logOut())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(EditUser)