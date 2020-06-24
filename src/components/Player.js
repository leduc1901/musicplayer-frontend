import React, { Component , createRef} from 'react'
import {connect} from "react-redux"
import axios from "axios"
import {loggedIn , logOut} from "../actions/playerAction"
import {withRouter} from "react-router"
import Slider from "react-input-slider"
import PrevIcon from "../Icons/PrevIcon";
import NextIcon from "../Icons/NextIcon";
import PauseIcon from "../Icons/PauseIcon"; 
import PlayIcon from "../Icons/PlayIcon";
import { Link } from "react-router-dom"
import Logout from "./Logout"



export class Player extends Component {
    constructor(props){
        super(props)
        this.state = {
            songs : [],
            currentTime : 0,
            duration : 0,
            isPlaying : false,
            songIndex : 0,
            playlists : [],
            personal : false,
            onPlaylist : false,
            isAdding : false,
            addSong : 0,
            currentPlaylist : null,
            isRandom : false,
            searchValue : "",
            userAvatar : ""
        }
    }
    audioReference = createRef()
    changeToAll = () => {
      if(this.state.personal){
        this.setState({personal: false})
        this.fetchAllPlaylists()
      }
    }

    changeToMine = () => {
      if(!this.state.personal){
        this.setState({personal: true})
        this.fetchMyPlaylists()
      }
    }


    changeSong = (index) => {
        this.setState({
            isPlaying : true ,
            songIndex : index
        })
    }



    backToAll = () => {
      this.setState({onPlaylist : false , currentPlaylist : null})
      this.fetchSongs()
    }

    componentDidMount(){
        if(!this.props.loggedIn){
            this.props.history.push("/")
        }
        this.fetchSongs()
        this.fetchAllPlaylists()
        this.fetchUserAvatar()
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

    pausePlayClick = () => {
        if(this.state.isPlaying){
          this.audioReference.current.pause();
        }else{
          this.audioReference.current.play();
        }
        this.setState({
          isPlaying : !this.state.isPlaying
        })
      }

    
    sliderChange = ({x}) => {
        console.log(x)
        this.audioReference.current.currentTime = x;
        this.setState({
          currentTime : x
        })
        
        if(!this.state.isPlaying){
          this.setState({
            isPlaying : true
          })
          this.audioReference.current.play()
        }
      }

      loadData = () => {
        this.setState({
          duration : this.audioReference.current.duration
        })
        
        if(this.state.isPlaying){
          this.audioReference.current.play();
        }
      }
    
    async fetchUserAvatar(){
      try{
        const avatar = await axios.get(`/users/${this.props.id}` , {headers : {'Authorization': this.props.token}})
        console.log(avatar.data)
        this.setState({userAvatar : avatar.data.avatar})
      }catch(e){
        const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
        this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id)
        const avatar = await axios.get(`/users/${this.props.id}` , {headers : {'Authorization': this.props.token}})
        this.setState({userAvatar : avatar.data.avatar})

      }
    }

    async fetchAllPlaylists(){
      try {
        const playlists = await axios.get(`/playlists` , {headers : {'Authorization': this.props.token}})
        this.setState({playlists : playlists.data})
      } catch (error) {
        const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
        this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id)
        const playlists = await axios.get(`/playlists` , {headers : {'Authorization': this.props.token}})
        this.setState({playlists : playlists.data})
      }
    }

    async fetchMyPlaylists(){
      try {
        const playlists =  await axios.get(`/playlists/user/${this.props.id}` , {headers : {'Authorization': this.props.token}})
        this.setState({playlists : playlists.data})
      } catch (error) {
        const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
        this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id)
        const playlists =  await axios.get(`/playlists/user/${this.props.id}` , {headers : {'Authorization': this.props.token}})
        this.setState({playlists : playlists.data})
      }
    }


    async fetchSongs(){
        try {
            const songs = await axios.get(`/songs` , {headers : {'Authorization': this.props.token}})
            this.setState({songs : songs.data})
        } catch (error) {
            const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
            this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id)
            const songs = await axios.get(`/songs` , {headers : {'Authorization': this.props.token}})
            this.setState({songs : songs.data})
        }
    }

    async fetchPlaylistSong(index){
      this.setState({songIndex : 0 , currentPlaylist : index})
      try {
        const songs = await axios.get(`playlists/${index}`, {headers : {'Authorization': this.props.token}})
        this.setState({songs : songs.data.songs , onPlaylist : true})
        console.log(this.state.songs)
      } catch (error) {
        const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
        this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id)
        const songs = await axios.get(`playlists/${index +1}`, {headers : {'Authorization': this.props.token}})
        this.setState({songs : songs.data})
      }
    }

    async fetchSearchSongs(){
      try {
        const songs = await axios.post(`search/${this.state.searchValue}` , {headers : {'Authorization': this.props.token}})
        this.setState({songs : songs.data})
      } catch (error) {
        const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
        this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id)
        const songs = await axios.post(`search/${this.state.searchValue}` , {headers : {'Authorization': this.props.token}})
        this.setState({songs : songs.data})
      }
    }

    async addToPlaylist(index){
      try {
        const add =  await axios.post(`playlists_songs`  ,{playlists_song : {playlist_id : index+1 , song_id : this.state.addSong}})
        this.setState({addSong : 0})
        alert("Added to playlist")
      } catch (error) {
        alert("You already have this song on this playlist")
      }
    }

    async deletePlaylistSong(index){
      try {
        const del = await axios.delete(`playlists_songs/${index}`)
        alert("Delete Successful")
        this.fetchPlaylistSong(this.state.currentPlaylist)
      } catch (error) {
        alert("Something Went Wrong")
      }
    }

    async addNewList(text){
      try {
        const add = await axios.post(`playlists`, {playlist : {name: text , privacy : "public" , user_id : this.props.id}}  , {headers : {'Authorization': this.props.token}} )
        if(this.state.onPlaylist){
          this.fetchMyPlaylists()
        }else{
          this.fetchAllPlaylists()
        }
      } catch (error) {
        console.log(error)
      }
    }

    async deletePlaylist(index){
      console.log(index)
      try {
        const del = await axios.delete(`playlists/${index}` , {headers : {'Authorization': this.props.token}} )
        this.backToAll()
        this.fetchMyPlaylists()
      } catch (error) {
        console.log(error)
      }
    }

    prevBtn = () => {
      if(this.state.songIndex > 0){
        let index = this.state.songIndex - 1
        this.setState({
          songIndex :  index
        })
      }
    }

    addNewPlaylist = () => {
      let text = window.prompt("Enter New Playlist Name")
      if(text != null){
        this.addNewList(text)
      }
    }

    closeAdding = () => {
      this.setState({isAdding : false})
    }

    deleteOrAdd = (index) => {
      if(this.state.onPlaylist){
          if(window.confirm("Are You Sure ?")){
            this.deletePlaylistSong(index)
          }
          
      }else{
        this.setState({isAdding : true , addSong : index})
      }
    }

    deletePlaylistBtn = (index) => {
      if(window.confirm("Are You Sure")){
        this.deletePlaylist(index)
      }
    }

    nextBtn = () => {
      if(this.state.songIndex < this.state.songs.length - 1){
        let index = this.state.songIndex + 1
        this.setState({
          songIndex :  index
        })
      }
    }

    randomMode = () => {
      if(this.state.isRandom){
        this.setState({isRandom:false})
      }else{
        this.setState({isRandom:true})
      }
    }

    nextSong = () => {
      let sI = this.state.songIndex
      if(this.state.isRandom == false){   
        sI++
        if(this.state.songIndex === this.state.songs.length - 1){
          this.setState({songIndex : 0})
        }else{
          this.setState({songIndex : sI})
        }
      }else{
        sI = Math.floor(Math.random() * (this.state.songs.length - 1))
        this.setState({songIndex : sI})
      }
      
    }

    renderPlayer = () => {
        if(this.state.songs.length >= 1){
          return (
                    <>
                    <img className="thumbnail" src={this.state.songs[this.state.songIndex].image} alt="thumbnail" />
                    <h2 className="title" >{this.state.songs[this.state.songIndex].name}</h2>
                    <p className="singer" >{this.state.songs[this.state.songIndex].singer}</p>
                    <h5>{this.state.songs[this.state.songIndex].category}</h5>
                    <div className="button-group" >
                        <div className="prev-btn " onClick={this.prevBtn} >
                            <PrevIcon/>
                        </div>
                        <div className="play-pause-btn" onClick={this.pausePlayClick}>
                            {this.state.isPlaying ? <PauseIcon/> : <PlayIcon/>}
                        </div>
                        <div className="next-btn" onClick={this.nextBtn}>
                            <NextIcon/>
                        </div>
                     </div>
                    </>
          )
        }else{
          return (
            <div>
              No Songs Yet
            </div>
          )
        }
      }

    renderSongHeader = () => {
      if(this.state.onPlaylist){
        return (
          <>
            <div onClick={this.backToAll} className="playlist-option">
              Back
            </div>
            <div className="">
                  My Playlist
            </div>
          </>
        )
      }else{
        return (
          <div className="songs-header">
            All Songs
          </div>
        )
      }
    }

    renderPlayBtn = () => {
        return (
          <PlayIcon/>
        )
    }

    renderSearchBtn = () => {
      if(!this.state.onPlaylist){
        return (
          <div className="search-btn">
            <i class="fa fa-search" aria-hidden="true"></i><input onChange={this.handleSearch} type="text" size="50" placeholder="Search your song's name, singer, or category" />
          </div>
          
        )
      }
    }

    renderSlider = () => {
        if(this.state.songs.length > 1){
            return (
                <>
                <div className="song-time">{Math.floor((this.state.duration - this.state.currentTime) / 60) + ":" + ((this.state.duration - this.state.currentTime) % 60 ? Math.floor(this.state.duration - this.state.currentTime) % 60 : '00')}</div>
                <Slider
              axis = "x"
              xmax={this.state.duration}
              x={this.state.currentTime}
              onChange={this.sliderChange}
                  styles={{
                    track: {
                      backgroundColor: "#e3e3e3",
                      height: "10px",
                    },
                    active: {
                      backgroundColor: "#1DB954",
                      height: "10px",
                    },
                    thumb: {
                      marginTop: "0",
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#1DB954",
                      borderRadius: 100,
                    },
                  }}
                />
               <audio
                  ref = {this.audioReference}
                  src = {this.state.songs[this.state.songIndex].url}
                  onLoadedData = {this.loadData}
                  onTimeUpdate={()=> this.setState({currentTime : this.audioReference.current.currentTime})}
                  onEnded={this.nextSong}
                />
                <button class={this.state.isRandom ? "random-btn-active" : "random-btn"} onClick={this.randomMode}>RANDOM</button>
                </>
            )
        }
    }

    renderAddPlaylist = () => {
      if(this.state.isAdding){
        return (
          <>
          <div className="add-playlist-container" >         
          </div>
          <div className="add-playlist-middle" >
                <div className="add-playlist-header">
                    Add To Playlist
                    <i class="fa fa-times" onClick={this.closeAdding} aria-hidden="true"></i>    
                </div>
                <div className="add-to-playlist-option">
                  {this.state.playlists && this.state.playlists.map((item , index) => {
                                if(item.user_id == this.props.id){
                                  return (
                                    <>
                                      <div className="song-item" >
                                          <div className="song-des">
                                              <p className="song-name">{item.name}</p>
                                              <p className="song-artist" >{item.user}</p>
                                          </div>
                                          <div className="add-btn" onClick={() => this.addToPlaylist(index)} >                             
                                            <i class="fa fa-plus" aria-hidden="true"></i>                
                                        </div> 
                                      </div>
                                     
                                    </>
                                  )
                                }  
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
          {this.renderAddPlaylist()}
          <Logout/>
          <button class="logout-btn" ><Link to="/user">User</Link></button>
            <div className="player-container">
                    <div className="song-list">
                    <div className="playlist-header">
                          {this.renderSongHeader()}   
                              
                    </div>
                    {this.renderSearchBtn()}   
                        {this.state.songs && this.state.songs.map((item , index) => {
                            return (
                                <div className={this.state.songIndex == index ?  "song-item song-current" : "song-item"} onClick={() => this.changeSong(index)}>
                                    <div className="song-des">
                                        <p className="song-name">
                                          {item.name}
                                          <a>
                                            {this.state.songIndex == index ?  <PlayIcon/> : ""}
                                          </a>
                                        </p>
                                        <p className="song-artist" >{item.singer}</p>
                                    </div>
                                    <div className="add-btn" onClick={() => this.deleteOrAdd(item.id)} >                             
                                      <i class={this.state.onPlaylist ? "fa fa-minus" : "fa fa-plus"} aria-hidden="true"></i>                
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="App">
                        {this.renderPlayer()}
                        {this.renderSlider()}
                    </div> 
                    <div className="song-list">
                        <div className="playlist-header">
                          <div onClick={this.changeToAll} className={!this.state.personal ? "" : "playlist-option"}>
                                All Playlists
                          </div>
                          <div onClick={this.changeToMine} className={this.state.personal ? "" : "playlist-option"}>
                                My Playlists
                          </div>
                        </div>
                        <div className="add-playlist" onClick={this.addNewPlaylist} >                             
                                      <i class="fa fa-plus" aria-hidden="true"></i>                
                        </div>
                        {this.state.playlists && this.state.playlists.map((item , index) => {
                              return (
                                  <div className="song-item" onClick={() => this.fetchPlaylistSong(item.id)}>
                                      <div className="song-des">
                                          <p className="song-name">{item.name}
                                          <a>
                                            {this.state.currentPlaylist == index + 1?  <PlayIcon/> : ""}
                                          </a></p>
                                          <p className="song-artist" >{item.user}</p>
                                      </div>
                                      <div className={this.state.personal ? "add-btn" : "hidden-btn"} onClick={() => this.deletePlaylistBtn(item.id)} >                             
                                       <i class="fa fa-minus" aria-hidden="true"></i>                
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
        id : state.id
    }
}

function mapDispatchToProps(dispatch){
    return {
        dispatchLoggedIn : (email, password, token , id) => dispatch(loggedIn(email, password, token , id)),
        dispatchLogOut : () => dispatch(logOut())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Player)