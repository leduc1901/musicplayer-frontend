import React, { Component } from 'react'
import {  Link } from "react-router-dom"
import {connect} from "react-redux"


export class Sidebar extends Component {

    renderAdmin = () => {
        if(this.props.role == "admin"){
            return (
                <>
                    <div><Link to="/all-users">All Users</Link></div>
                    <div><Link to="/all-songs">All Songs</Link></div>
                    <div><Link to="/all-singers">All Singers</Link></div>
                    <div><Link to="/categories">Categories</Link></div>
                </>
            )
        }
    }

    render() {
        return (
            <div className="admin-sidebar">
                <button class="logout-btn"><Link to="/player">Back</Link> </button>
                <div><Link to="/user">My Profile</Link></div>
                {this.renderAdmin()}
                
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        
        role : state.role
    }
  }
  
  function mapDispatchToProps(dispatch){
    return {
        
    }
  }
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)