import React, { Component , createRef} from 'react'
import {connect} from "react-redux"
import axios from "axios"
import {loggedIn , logOut} from "../actions/playerAction"
import {withRouter} from "react-router"
import Slider from "react-input-slider"
import PrevIcon from "../Icons/PrevIcon";
import NextIcon from "../Icons/NextIcon";
import PauseIcon from "../Icons/PauseIcon"; 
import PlayIcon from "../Icons/PlayIcon"

export class Player extends Component {
    constructor(props){
        super(props)
        this.state = {
            users : [],
            songs : [],
            currentTime : 0,
            duration : 0,
            isPlaying : false,
            songIndex : 0,
            playlists : [],
            personal : false,
            onPlaylist : false
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
            isPlaying : false ,
            songIndex : index
        })
    }

    backToAll = () => {
      this.setState({onPlaylist : false})
      this.fetchSongs()
    }

    componentDidMount(){
        if(!this.props.loggedIn){
            this.props.history.push("/")
        }
        this.fetchSongs()
        this.fetchAllPlaylists()
    }
    logOutBtn = () => {
        this.props.dispatchLogOut()
        this.props.history.push("/")
       
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
      try {
        const songs = await axios.get(`playlists/${index}`, {headers : {'Authorization': this.props.token}})
        this.setState({songs : songs.data[0].songs , onPlaylist : true})
        console.log(this.state.songs)
      } catch (error) {
        const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
        this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id)
        const songs = await axios.get(`playlists/${index}`, {headers : {'Authorization': this.props.token}})
        this.setState({songs : songs.data})
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

    nextBtn = () => {
      if(this.state.songIndex < this.state.songs.length - 1){
        let index = this.state.songIndex + 1
        this.setState({
          songIndex :  index
        })
      }
    }

    renderPlayer = () => {
        if(this.state.songs.length >= 1){
          return (
                    <>
                    <img className="thumbnail" src={"./images/" + this.state.songs[this.state.songIndex].image} alt="thumbnail" />
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

    renderSlider = () => {
        if(this.state.songs.length > 1){
            return (
                <>
                <Slider
              axis = "x"
              xmax={this.state.duration}
              x={this.state.currentTime}
              onChange={this.sliderChange}
                  styles={{
                    track: {
                      backgroundColor: "#e3e3e3",
                      height: "2px",
                    },
                    active: {
                      backgroundColor: "#333",
                      height: "2px",
                    },
                    thumb: {
                      marginTop: "-5px",
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#333",
                      borderRadius: 100,
                    },
                  }}
                />
               <audio
                  ref = {this.audioReference}
                  src = {"./audio/" + this.state.songs[this.state.songIndex].url}
                  onLoadedData = {this.loadData}
                  onTimeUpdate={()=> this.setState({currentTime : this.audioReference.current.currentTime})}
                  onEnded={() => this.setState({isPlay : false})}
                />
                </>
            )
        }
    }


    render() {
        return (
          <>
          <button class="logout-btn" onClick={this.logOutBtn} >Log Out</button>
            <div className="player-container">
                    <div className="song-list">
                    <div className="playlist-header">
                          {this.renderSongHeader()}          
                    </div>
                        {this.state.songs && this.state.songs.map((item , index) => {
                            return (
                                <div className="song-item" onClick={() => this.changeSong(index)}>
                                    <div className="song-des">
                                        <p className="song-name">
                                          {item.name}
                                          <a>
                                            {this.state.songIndex == index ?  <PlayIcon/> : ""}
                                          </a>
                                        </p>
                                        <p className="song-artist" >{item.singer}</p>
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
                        {this.state.playlists && this.state.playlists.map((item , index) => {
                              return (
                                  <div className="song-item" onClick={() => this.fetchPlaylistSong(index)}>
                                      <div className="song-des">
                                          <p className="song-name">{item.name}</p>
                                          <p className="song-artist" >{item.user}</p>
                                      </div>
                                  </div>
                              )
                          })}
                    </div>
                    
            </div>
            </>
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