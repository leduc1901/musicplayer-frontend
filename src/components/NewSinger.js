import React, { Component } from 'react'
import axios from "axios"
import {loggedIn , logOut} from "../actions/playerAction"
import {connect} from "react-redux"
import   Sidebar  from "./Sidebar"


export class NewSinger extends Component {
    constructor(props){
        super(props)
        this.state = {
            name : "",
            newPhoto : ""
        }
    }

    handleNameChange = (e) => {
        this.setState({name : e.target.value})
    }

    handleImageChange = e => {
       if(e.target.files[0].type === 'image/png' || e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/jpg"){
        this.setState({ newPhoto: e.target.files[0] });
       }else{
           alert("Wrong File Type!")
           document.getElementById("input-image").value = "";
       }
    };
      
    async createSinger(){
        const formData = new FormData();
        formData.append("file", this.state.newPhoto);
        formData.append('name', this.state.name)
        try{
            const photo = await axios.post(`/singers`, formData, {headers : {'Authorization': this.props.token}})
            this.props.history.push("/all-singers")
               }catch(e){
            const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
            this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
            const photo = await axios.post(`/singers`, formData , {headers : {'Authorization': this.props.token}})
            this.props.history.push("/all-singers")
        }
    }

    submitBtn = () => {
        if(this.state.name != "" && this.state.newPhoto != ""){
            this.createSinger()
        }else{
            alert("Empty Field")
        }
    }

    render() {
        return (
            <div className="container">
        <Sidebar/>
        <div className="admin-container">
        <div className="admin-title">New Singer</div>
          <div className="update-container">
            <div className="update-part">
                <div className="admin-para">Name</div>
                  <div className="search-btn">
                    <i class="fa fa-user" aria-hidden="true"></i><input onChange={(e) => this.handleNameChange(e)} type="text" size="50" placeholder="Enter Your New Name" />
                  </div>
                 
            </div>
            <div className="update-part">
              <img className="update-img" src="/images/default-profile.png" />
              <input id="input-image" type="file" name="newPhoto" accept="image/png, image/jpeg" onChange={this.handleImageChange}/>
              
            </div>
          </div>
          <button className="update-btn" onClick={this.submitBtn}>Create</button>
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
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(NewSinger)
