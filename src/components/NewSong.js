import React, { Component } from 'react'
import axios from "axios"
import {loggedIn , logOut} from "../actions/playerAction"
import {connect} from "react-redux"
import   Sidebar  from "./Sidebar"

export class NewSong extends Component {
    constructor(props){
        super(props)
        this.state = {
            name : "",
            singer : "",
            singerId : null,
            category : "",
            categoryId: null,
            song : null,
            chooseSinger : false,
            chooseCategory : false,
            singers : [],
            categories : [],
            searchValue : ""
        }
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


    async createSong(){
      const formData = new FormData();
        formData.append("file", this.state.song);
        formData.append('name', this.state.name)
        formData.append('category_id' , this.state.categoryId)
        formData.append('singer_id' , this.state.singerId)
      try{
        
        const song = await axios.post("/songs" , formData ,  {headers : {'Authorization': this.props.token}})
        this.props.history.push("/all-songs")
      }catch(e){
        const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
        this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
        const song = await axios.post("/songs" , formData ,  {headers : {'Authorization': this.props.token}})
        this.props.history.push("/all-songs")
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

  async fetchSearchSingers(){
    try {
      const Singers = await axios.post(`searchsinger/${this.state.searchValue}` , {headers : {'Authorization': this.props.token}})
      this.setState({singers : Singers.data })
    } catch (error) {
      const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
      this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
      const Singers = await axios.post(`searchsinger/${this.state.searchValue}` , {headers : {'Authorization': this.props.token}})
      this.setState({singers : Singers.data})
    }
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

  addSinger = (id , name) => {
    this.setState({singer : name , singerId : id , chooseSinger : false})
  }

  addCategory = (id , name) => {
    this.setState({category : name , categoryId : id , chooseCategory: false})
  }


    handleNameChange = (e) => {
        this.setState({name : e.target.value})
    }
    

    handleSongChange = e => {
        if(e.target.files[0].type === 'audio/mpeg'){
         this.setState({ song: e.target.files[0] });
        }else{
            alert("Wrong File Type!")
            document.getElementById("input-image").value = "";
        }
     };
       
     closeChoosing = () => {
       this.setState({chooseCategory : false , chooseSinger : false , searchValue : ""})
     }

    chooseSinger = () => {
      this.setState({chooseSinger : true})
      this.fetchAllsingers()
    }

    chooseCategory = () => {
      this.setState({chooseCategory : true})
      this.fetchCategories()
    }

     renderAddSinger = () => {
      if(this.state.chooseSinger){
        return (
          <>
          <div className="add-playlist-container" >         
          </div>
          <div className="add-playlist-middle" >
                <div className="add-playlist-header">
                    Choose Singer
                    <i class="fa fa-times" onClick={this.closeChoosing} aria-hidden="true"></i>    
                </div>
                <div className="search-btn">
                    
                    <i class="fa fa-search" aria-hidden="true"></i><input onChange={this.handleSearch} style={{color: "black"}} type="text" size="50" placeholder="Search singer's name" />
                </div>
                <div className="add-to-playlist-option">
                  { this.state.singers && this.state.singers.map((item , index) => {
                                
                                  return (
                                    <>
                                      <div className="add-playlist-item"  onClick={() => this.addSinger(item.id , item.name)}>
                                          {item.name}
                                          
                                      </div>
                                     
                                    </>
                                  )
                                
                    })}
                </div>
              </div>
              </>
        )
      }
    }

    renderAddCategory = () => {
      if(this.state.chooseCategory){
        return (
          <>
          <div className="add-playlist-container" >         
          </div>
          <div className="add-playlist-middle" >
                <div className="add-playlist-header">
                    Choose Category
                    <i class="fa fa-times" onClick={this.closeChoosing} aria-hidden="true"></i>    
                </div>
                
                <div className="add-to-playlist-option">
                  { this.state.categories && this.state.categories.map((item , index) => {
                                
                                  return (
                                    <>
                                      <div className="add-playlist-item"  onClick={() => this.addCategory(item.id, item.name)}>
                                          {item.name}
                                          
                                      </div>
                                     
                                    </>
                                  )
                                
                    })}
                </div>
              </div>
              </>
        )
      }
    }

    render() {
        return (
            <div className="container">
            <Sidebar/>
            {this.renderAddSinger()}
            {this.renderAddCategory()}
            <div className="admin-container">
            <div className="admin-title">New Song</div>
              <div className="update-container">
                <div className="update-part">
                    <div className="admin-para">Song Name</div>
                      <div className="search-btn">
                        <i class="fa fa-user" aria-hidden="true"></i><input onChange={(e) => this.handleNameChange(e)} type="text" size="50" placeholder="Enter Your New Name" />
                      </div>
                      <div className="admin-para">Singer Name</div>
                        <button className="choose-new-song" onClick={this.chooseSinger}>{this.state.singer != "" ? this.state.singer : "Click Here"}</button>
                        <div className="admin-para">Category Name</div>
                        <button className="choose-new-song" onClick={this.chooseCategory} >{this.state.category != "" ? this.state.category : "Click Here"}</button>
                </div>
                <div className="update-part">
                  <img className="update-img" src="/images/channels4_profile.jpg"/>
                  <input type="file"  id="input-image" name="newPhoto" accept="audio/mpeg, audio/mp3" onChange={this.handleSongChange}/>
                  
                </div>
              </div>
              <button className="update-btn" onClick={this.createSong.bind(this)}>Update</button>
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
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(NewSong)
