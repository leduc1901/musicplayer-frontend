import React, { Component } from 'react'
import axios from "axios";
import {Link} from "react-router-dom"
import {loggedIn , logOut} from "../actions/playerAction"
import {connect} from "react-redux"
import   Sidebar  from "./Sidebar"

export class AllUser extends Component {
    constructor(props){
        super(props)
        this.state = {
            users : [],
            searchValue : ''
        }
    }

    handleSearch = (input) => {
        this.setState({
            searchValue : input.target.value
        })
        
        setTimeout(() => {
          if(this.state.searchValue === ""){
            this.fetchAllUsers()
          }else{
            this.fetchSearchusers()
          }
        }, 300);
      }
  

    componentDidMount(){
        this.fetchAllUsers()
    }

    async fetchAllUsers(){
        try {
            const users = await axios.get("/users" ,  {headers : {'Authorization': this.props.token}})
            this.setState({users : users.data})
        } catch (error) {
            const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
            this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
            const users = await axios.get("/users" ,  {headers : {'Authorization': this.props.token}})
            this.setState({users : users.data})
        }
    }


    async fetchSearchusers(){
        try {
          const users = await axios.post(`/searchusers/${this.state.searchValue}`)
          this.setState({users : users.data })
        } catch (error) {
          const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
          this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
          const users = await axios.post(`/searchusers/${this.state.searchValue}`)
          this.setState({users : users.data})
        }
    }


    async deleteUserAsync(index){
        try {
          const del = axios.delete(`/users/${index}` ,{headers : {'Authorization': this.props.token}} ).then( res => {
            alert("Delete Successful")
            this.fetchAllUsers()
          })
        } catch (error) {
          const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
          this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
          const del = axios.delete(`/users/${index}` ,{headers : {'Authorization': this.props.token}} ).then(res =>{
            alert("Delete Successful")
            this.fetchAllUsers()
          })
  
        }
      }
  
      deleteUser = (index) => {
        if(window.confirm("Are you sure ?")){
          this.deleteUserAsync(index)
        }
      }
  

    render() {
        return (
            <div className="true-container">
                <Sidebar/>
                <div className="admin-container">
                    <div className="admin-title">All Users</div>
                    <div className="search-btn">
                    
                        <i class="fa fa-search" aria-hidden="true"></i><input onChange={this.handleSearch} type="text" size="50" placeholder="Search user's name" />
                    </div>
                    <div className="data-wrapper">
                    {this.state.users && this.state.users.map((item) => {
                        if(this.props.id !== item.id){
                            return (
                            <div className="song-item user-item" >
                            <img src={item.avatar !== "" ? item.avatar : "/images/default-profile.png"}/>

                            <div className="song-des"> 
                                        <p className="song-name">
                                          {item.name}
                                          
                                        </p>
                                        <p className="song-artist" >{item.email}</p>
                                    </div>
                                    <div className="add-and-del" >                             
                                        <Link to={`/edit-user/${item.id}`}>Sửa</Link>    
                                      <div onClick={() => this.deleteUser(item.id)}>Xóa</div>          
                                    </div>
                                </div>
                        )
                        }
                    })}
                    </div>
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
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(AllUser)
