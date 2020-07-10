import {connect} from "react-redux"
import React, { Component } from 'react'
import {loggedIn , logOut} from "../actions/playerAction"

import axios from 'axios';

export class Comment extends Component {
    constructor(props){
        super(props)
        this.state = {
          content : "",
          comments : [],
          reply : "",
        }
      }
    
    handleSearch = (input) => {
        this.setState({
            content : input.target.value
        })
        
      }
  
    deleteComment = (index) => {
        console.log("Zz")
        if(window.confirm("Are you sure ?")){
          this.deleteCommentAsync(index)
        }
      }

    
    renderComment = () => {
        if(this.props.comments.length >= 1){
            return (
                this.props.comments && this.props.comments.map((item) => {
                    return (
                        <div className="song-item user-item">
                            <img src={item.image !== "" ? item.image : "/images/default-profile.png"}/>
                            <div className="song-des" > 
                                <p className="song-name">
                                    {item.content}
                                    
                                </p>
                                <p className="song-artist" >{item.name}</p>
                            </div>
                            <div className={this.props.role === 'admin' ? "add-btn" : "hidden-btn"}  >
                                        
                                <div onClick={() => this.deleteComment(item.id)}>
                                          <i class="fa fa-minus" aria-hidden="true"></i> 
                                </div>                             
                                                      
                            </div>
                        </div>
                    )
                })
            )
   
        }else{
            return (
                <div className="nothingville">
                    No Comments !
                </div>
            )
        }
    }

    deleteCommentAsync = async (id) => {
        try {
            let del = await axios.delete(`comments/${id}` ,   {headers : {'Authorization': this.props.token}}).then(res => {
                this.props.getComment()
                alert("Delete Successful")
            })
        } catch (error) {
            
        }
    }

    postComment = async () =>{
        try {
            let post = await axios.post('comments' , {song_id : this.props.currentSong , user_id : this.props.id , content : this.state.content} ,   {headers : {'Authorization': this.props.token}}).then(res =>{
                this.props.getComment()
                this.setState({content : ""})
                document.getElementById("comment-input").value = ""
            })
            
        } catch (error) {
            alert("Not enough characters")
        }
    }

    

    render() {
        return (
            <>
            <div className="comment-section">
                <div className="search-btn">
                    <button className="comment-btn">All</button><input onChange={this.handleSearch} id="comment-input" type="text" size="50" placeholder="Have a comment !" />
                    <button onClick={this.postComment} className="comment-btn">Post</button>
                </div>
                <div className="comment-load">
                    {this.renderComment()}
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


export default connect(mapStateToProps, mapDispatchToProps)(Comment)
