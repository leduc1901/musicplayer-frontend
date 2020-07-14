import React, { Component } from 'react'
import axios from "axios"
import {loggedIn , logOut} from "../actions/playerAction"
import {connect} from "react-redux"
import   Sidebar  from "./Sidebar"
import {  Link } from "react-router-dom"


export class AllSong extends Component {
    constructor(props){
        super(props)
        this.state = {
            songs : []
        }
    }

    componentDidMount(){
        this.fetchSongs()
    }

    async fetchSearchSongs(){
        try {
          const songs = await axios.post(`search/${this.state.searchValue}`)
          this.setState({songs : songs.data })
        } catch (error) {
          const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
          this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
          const songs = await axios.post(`search/${this.state.searchValue}`)
          this.setState({songs : songs.data})
        }
    }

    async deleteSongAsync(index){
      try {
        const del = axios.delete(`/songs/${index}` ,{headers : {'Authorization': this.props.token}} ).then( res => {
          alert("Delete Successful")
          this.fetchSongs()
        })
      } catch (error) {
        const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
        this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
        const del = axios.delete(`/songs/${index}` ,{headers : {'Authorization': this.props.token}} ).then(res =>{
          alert("Delete Successful")
          this.fetchSongs()
        })

      }
    }

    async fetchSongs(){
        try {
            this.setState({loading : true})
            const songs = await axios.get(`/songs` , {headers : {'Authorization': this.props.token}})
            this.setState({songs : songs.data , loading : false})
        } catch (error) {
            this.setState({loading : true})
            const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
            this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id, logged.data.role)
            const songs = await axios.get(`/songs` , {headers : {'Authorization': this.props.token}})
            this.setState({songs : songs.data , loading : false})
        }
    }

    handleSearch = (input) => {
        this.setState({
            searchValue : input.target.value
        })
        
        setTimeout(() => {
          if(this.state.searchValue == ""){
            this.fetchSongs()
          }else{
            this.fetchSearchSongs()
          }
        }, 300);
      }
  

      deleteSong = (index) => {
        if(window.confirm("Are you sure ?")){
          this.deleteSongAsync(index)
        }
      }

    render() {
        return (
            <div className="true-container">
                <Sidebar/>
                <div className="admin-container">
                    <div className="admin-title">All Songs</div>
                    <div className="search-btn">
                        <i class="fa fa-search" aria-hidden="true"></i><input onChange={this.handleSearch} type="text" size="50" placeholder="Search your song's name, singer, or category" />
                    </div>
                    <div className="add-playlist" >         
                    <Link to="/new-song"><i class="fa fa-plus" aria-hidden="true"></i></Link>                    
                                                      
                        </div>
                    <div className="data-wrapper">
                    
                    {this.state.songs && this.state.songs.map((item , index) => {
                        return (
                            <div className="song-item user-item" >

                            <div className="song-des"> 
                                        <p className="song-name">
                                          {item.name}
                                          
                                        </p>
                                        <p className="song-artist" >{item.singer}</p>
                                    </div>
                                    <div className="add-and-del" onClick={() => this.deleteSong(item.id)}>                             
                                      
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
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(AllSong)
