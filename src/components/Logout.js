import React, { Component } from 'react'
import {connect} from "react-redux"
import {logOut} from "../actions/playerAction"
import {withRouter} from "react-router-dom"

export class Logout extends Component {


    logOutBtn = () => {
        this.props.dispatchLogOut()
        const { history } = this.props;
        history.push("/")
       
    }

    render() {
        return (
            <div>
                <button class="logout-btn" onClick={this.logOutBtn} >Log Out</button>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        
    }
}

function mapDispatchToProps(dispatch){
    return {
        dispatchLogOut : () => dispatch(logOut())
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Logout))
