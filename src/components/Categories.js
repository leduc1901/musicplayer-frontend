import React, { Component } from 'react'
import axios from "axios"
import {loggedIn , logOut} from "../actions/playerAction"
import {connect} from "react-redux"
import   Sidebar  from "./Sidebar"
import {  Link } from "react-router-dom"




export class Categories extends Component {
    constructor(props){
        super(props)
        this.state = {
            categories : [],
            searchValue : ""
        }
    }

    componentDidMount(){
        this.fetchCategories()
    }

    handleSearch = (input) => {
        this.setState({
            searchValue : input.target.value
        })
        
        setTimeout(() => {
          if(this.state.searchValue == ""){
            this.fetchCategories()
          }else{
            this.fetchSearchCategories()
          }
        }, 300);
      }
  

    async fetchCategories(){
        try {
            const categories = await axios("/categories" , {headers : {'Authorization': this.props.token}})
            this.setState({categories : categories.data})
        } catch (error) {
            const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
            this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
            const categories = await axios("/categories" , {headers : {'Authorization': this.props.token}})
            this.setState({categories : categories})
        }
    }

    async fetchSearchCategories(){
        try {
          const categories = await axios.post(`searchcategories/${this.state.searchValue}` , {headers : {'Authorization': this.props.token}})
          this.setState({categories : categories.data})
        } catch (error) {
          const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
          this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
          const categories = await axios.post(`searchcategories/${this.state.searchValue}` , {headers : {'Authorization': this.props.token}})
          this.setState({categories : categories.data})
        }
    }

    async deleteCategoryAsync(index){
        try {
          const del = axios.delete(`/categories/${index}` ,{headers : {'Authorization': this.props.token}} ).then( res => {
            alert("Delete Successful")
            this.fetchCategories()
          })
        } catch (error) {
          const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
          this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
          const del = axios.delete(`/categories/${index}` ,{headers : {'Authorization': this.props.token}} ).then(res =>{
            alert("Delete Successful")
            this.fetchCategories()
          })
  
        }
      }
  
      deleteCategory = (index) => {
        if(window.confirm("Are you sure ?")){
          this.deleteCategoryAsync(index)
        }
      }
  

    render() {
        return (
            <div className="container">
            <Sidebar/>
            <div className="admin-container">
                <div className="admin-title">All Categories</div>
                <div className="search-btn">
                    
                    <i class="fa fa-search" aria-hidden="true"></i><input onChange={this.handleSearch} type="text" size="50" placeholder="Search singer's name" />
                </div>
                <div className="add-playlist" >         
                    <Link to="/new-category"><i class="fa fa-plus" aria-hidden="true"></i></Link>                    
                                                      
                        </div>
                <div className="data-wrapper">
                {this.state.categories && this.state.categories.map((item , index) => {
                    return (
                        <div className="song-item user-item" >
                        <img src={item.image != "" ? item.image : "/images/default-profile.png"}/>

                        <div className="song-des"> 
                                    <p className="song-name">
                                      {item.name}
                                      
                                    </p>
                                </div>
                                <div className="add-and-del"  onClick={() => this.deleteCategory(item.id)} >                             
                                  
                                  <div>Xóa</div>          
                                </div>
                            </div>
                    )
                    
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
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Categories)

