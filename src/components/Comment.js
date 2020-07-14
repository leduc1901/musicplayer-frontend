import {connect} from "react-redux"
import React, { Component } from 'react'
import {loggedIn , logOut} from "../actions/playerAction"
import { Spin } from 'antd';

import axios from 'axios';

export class Comment extends Component {
    constructor(props){
        super(props)
        this.state = {
          content : "",
          comments : [],
          replyID : null,
          isReply : false,
          replyName : "",
          watchReply : false,
          replyCount : 0,
          replyContent : "",
          replyImg : "",
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


    selectReply = (name , id, content , reply , img) => {
        this.setState({
            replyID : id,
            replyName : name,
            isReply : true,
            replyContent : content ,
            replyCount : reply,
            replyImg : img
        })
    }
    
    cancelReply = () => {
        this.setState({
            replyID : null,
            replyName : "",
            isReply : false,
            replyContent : "" ,
            replyCount : 0,
            replyImg : "",
            watchReply : false
        }, () => {this.props.getComment()})
    }

    watchReply = (id , name , content , reply , img) => {
        this.setState({
            replyContent : content ,
            replyCount : reply,
            replyImg : img,
            isReply : true
        })
        if(reply != 0){
            this.setState({
                replyName : name
            })
            this.getReply(id)
        }
    }

  
    renderComment = () => {
        if(this.props.comments.length >= 1 && this.state.watchReply === false){
            return (
                this.props.comments && this.props.comments.map((item) => {
                    return (
                        <div className="song-item user-item" >
                            <img src={item.image !== "" ? item.image : "/images/default-profile.png"}/>
                            <div className="song-des" > 
                                <p className="song-name" onClick={() => this.selectReply(item.name , item.id , item.content , item.reply , item.image)}>
                                    {item.content}
                                </p>
                                <div className="reply-count">
                                    <p className="song-artist comment-reply" >{item.name}</p>
                                    <a onClick={() => this.watchReply(item.id , item.name , item.content , item.reply , item.image)} className="song-artist comment-reply" >{`${item.reply} Trả Lời`}</a>
                                </div>
                                
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
   
        }else if(this.props.comments.length >= 1 && this.state.watchReply && this.state.comments.length >= 1){
            return (
                <div>
                    <div className="song-item user-item" >
                            <img src={this.state.replyImg !== "" ? this.state.replyImg : "/images/default-profile.png"}/>
                            <div className="song-des" > 
                                <p className="song-name">
                                    {this.state.replyContent}
                                </p>
                                <div className="reply-count">
                                    <p className="song-artist comment-reply" >{this.state.replyName}</p>
                                    <a className="song-artist comment-reply" >{`${this.state.replyCount} Trả Lời`}</a>
                                </div>
                                
                            </div>
                        </div>
                    {this.state.comments && this.state.comments.map((item) =>{
                                        return (
                                            <div className="song-item user-item reply-item" >
                                            <img src={item.image !== "" ? item.image : "/images/default-profile.png"}/>
                                            <div className="song-des" > 
                                                <p className="song-name">
                                                    {item.content}
                                                </p>
                                                <div className="reply-count">
                                                    <p className="song-artist comment-reply" >{item.name}</p>
                                                </div>
                                                
                                            </div>
                                            <div className={this.props.role === 'admin' ? "add-btn" : "hidden-btn"}  >
                                                        
                                                <div onClick={() => this.deleteComment(item.id)}>
                                                        <i class="fa fa-minus" aria-hidden="true"></i> 
                                                </div>                             
                                                                    
                                            </div>
                                        </div>
                                        )
                                    
                                    })}
                </div>
                
            )
            
        }else{
            return (
                <div className="nothingville">
                    No Comments !
                </div>
            )
        }
    }

  
    componentDidUpdate(previousProps){
        if(previousProps.comments != this.props.comments){
            this.setState({
                replyID : null,
                replyName : "",
                isReply : false,
                replyContent : "" ,
                replyCount : 0,
                replyImg : "",
                watchReply : false
            })
        }
        
    }

    deleteCommentAsync = async (id) => {
        try {
            let del = await axios.delete(`comments/${id}` ,   {headers : {'Authorization': this.props.token}}).then(res => {
                this.setState({
                    replyID : null,
                    replyName : "",
                    isReply : false,
                    replyContent : "" ,
                    replyCount : 0,
                    replyImg : "",
                    watchReply : false
                }, () => {this.props.getComment()})
                alert("Delete Successful")
            })
        } catch (error) {
            
        }
    }

    getReply = async (id) => { 
        try {
            let replies = await axios.get(`comments/${id}/getreply` ,  {headers : {'Authorization': this.props.token}}).then(res => {
                console.log(res)
                this.setState({comments : res.data , watchReply : true , replyID : id})
            })
            
        } catch (error) {
            
        }
    }

    postComment = async () =>{
            if(this.state.isReply){
                if(this.state.content.length >= 6){
                    const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
                    this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
                    let post = await axios.post(`comments/${this.state.replyID}/reply` , {song_id : this.props.currentSong , user_id : this.props.id , content : this.state.content , parent_id : this.state.replyID} ,   {headers : {'Authorization': this.props.token}}).then(res =>{
                        this.getReply(this.state.replyID)
                        this.setState({content : ""})
                        document.getElementById("comment-input").value = ""
                    })
                }else{
                    alert("not enough characters")
                }             
            }else{
                if(this.state.content.length >= 6){
                    const logged = await axios.post(`/auth/login` , {email : this.props.email, password : this.props.password})
                    this.props.dispatchLoggedIn(this.props.email , this.props.password , logged.data.token, logged.data.id , logged.data.role)
                    let post = await axios.post('comments' , {song_id : this.props.currentSong , user_id : this.props.id , content : this.state.content} ,   {headers : {'Authorization': this.props.token}}).then(res =>{
                        this.props.getComment()
                        this.setState({content : ""})
                        document.getElementById("comment-input").value = ""
                    })
                }else{
                    alert("not enough characters")
                }
            }    
    }

    render() {
        return (
            <>
            <div className="comment-section">
                <div className="search-btn comment-sec">
                    <button onClick={this.cancelReply} className="reply-btn">{this.state.replyName != "" ? this.state.replyName : "All"}</button><input onChange={this.handleSearch} id="comment-input" type="text" size="50" placeholder="Have a comment !" />
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
