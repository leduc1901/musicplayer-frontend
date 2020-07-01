import React, { Component } from 'react'
import axios from "axios"
import {loggedIn , logOut} from "../actions/playerAction"
import {connect} from "react-redux"
import   Sidebar  from "./Sidebar"
import {  Link } from "react-router-dom"


export class AllSinger extends Component {
    constructor(props){
        super(props)
        this.state = {
            singers : [],
            searchValue : ""
        }
    }

    componentDidMount(){
        this.fetchAllsingers()
    }

    handleSearch = (input) => {
        this.setState({
            searchValue : input.target.value
        })
        
        setTimeout(() => {
          if(this.state.searchValue == ""){
            this.fetchAllsingers()
          }else{
            this.fetchSearchSingers()
          }
        }, 300);
      }
  

      async fetchSearchSingers(){
        try {
          const Singers = await axios.post(`searchsinger/${this.state.searchValue}` )
          this.setState({singers : Singers.data })
        } catch (error) {
          const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
          this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
          const Singers = await axios.post(`searchsinger/${this.state.searchValue}` )
          this.setState({singers : Singers.data})
        }
    }


    async fetchAllsingers(){
        try {
            const singers = await axios.get("/singers" ,  {headers : {'Authorization': this.props.token}})
            this.setState({singers : singers.data})
        } catch (error) {
            const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
            this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
            const singers = await axios.get("/singers" ,  {headers : {'Authorization': this.props.token}})
            this.setState({singers : singers.data})
        }
    }

    async deleteSingerAsync(index){
      try {
        const del = axios.delete(`/singers/${index}` ,{headers : {'Authorization': this.props.token}} ).then( res => {
          alert("Delete Successful")
          this.fetchAllsingers()
        })
      } catch (error) {
        const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
        this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
        const del = axios.delete(`/singers/${index}` ,{headers : {'Authorization': this.props.token}} ).then(res =>{
          alert("Delete Successful")
          this.fetchAllsingers()
        })

      }
    }

    deleteSinger = (index) => {
      if(window.confirm("Are you sure ?")){
        this.deleteSingerAsync(index)
      }
    }



    render() {
        return (
            <div className="container">
            <Sidebar/>
            <div className="admin-container">
                <div className="admin-title">All Singers</div>
                <div className="search-btn">
                    
                    <i class="fa fa-search" aria-hidden="true"></i><input onChange={this.handleSearch} type="text" size="50" placeholder="Search singer's name" />
                </div>
                <div className="add-playlist" >         
                    <Link to="/new-singer"><i class="fa fa-plus" aria-hidden="true"></i></Link>                    
                                                      
                        </div>
                <div className="data-wrapper">
                {this.state.singers && this.state.singers.map((item , index) => {
                    return (
                        <div className="song-item user-item" >
                        <img src={item.image != "" ? item.image : "/images/default-profile.png"}/>

                        <div className="song-des"> 
                                    <p className="song-name">
                                      {item.name}
                                      
                                    </p>
                                    <p className="song-artist" >{item.singer}</p>
                                </div>
                                <div className="add-and-del" onClick={() => this.deleteSinger(item.id)} >                             
                                  
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
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(AllSinger)

