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
            songIndex : 0
        }
    }

    changeSong = (index) => {
        this.setState({
            isPlaying : false ,
            songIndex : index
        })
    }

    componentDidMount(){
        if(!this.props.loggedIn){
            this.props.history.push("/")
        }
        this.fetchSongs()
    }

    audioReference = createRef()

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

    async fetchSongs(){
        try {
            const songs = await axios.get(`/songs` , {headers : {'Authorization': this.props.token}})
            this.setState({songs : songs.data})
            console.log(this.state.songs)
            
        } catch (error) {
            const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
            this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token)
            const songs = await axios.get(`/songs` , {headers : {'Authorization': this.props.token}})
            this.setState({songs : songs.data})
          
        }
    }

    renderPlayer = () => {
        if(this.state.songs.length >= 1){
            console.log(1)
          return (
                    <>
                    <img className="thumbnail" src={"./images/" + this.state.songs[this.state.songIndex].image} alt="thumbnail" />
                    <h2 className="title" >{this.state.songs[this.state.songIndex].name}</h2>
                    <p className="singer" >{this.state.songs[this.state.songIndex].singer}</p>
                    <div className="button-group" >
                        <div className="prev-btn " >
                            <PrevIcon/>
                        </div>
                        <div className="play-pause-btn" onClick={this.pausePlayClick}>
                            {this.state.isPlaying ? <PauseIcon/> : <PlayIcon/>}
                        </div>
                        <div className="next-btn">
                            <NextIcon/>
                        </div>
                     </div>
                    </>
          )
        }
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
            <div className="player-container">
                    
                    <div className="song-list">
                        {this.state.songs && this.state.songs.map((item , index) => {
                            return (
                                <div className="song-item" onClick={() => this.changeSong(index)}>
                                    <div className="song-des">
                                        <p className="song-name">{item.name}</p>
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
                    <button class="logout-btn" onClick={this.logOutBtn} >Log Out</button>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        email : state.email,
        token : state.token,
        password : state.password,
        loggedIn : state.loggedIn
    }
}

function mapDispatchToProps(dispatch){
    return {
        dispatchLoggedIn : (email, password, token) => dispatch(loggedIn(email, password, token)),
        dispatchLogOut : () => dispatch(logOut())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Player)