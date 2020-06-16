import React, { Component } from 'react'
import {connect} from "react-redux"
import axios from "axios"
export class User extends Component {
    constructor(props){
        super(props)
        this.state = {
            users : []
        }
    }

    componentDidMount(){
        
        this.fetchUser()
    }

    async fetchUser(){
        try {
            const users = await axios.get(`/users` , {headers : {'Authorization': this.props.token}})
            this.setState({users : users.data})
            console.log(this.state.users)
            
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return (
            <div>
                {this.state.users.map((i) => {
                    return (
                        <>
                        <p>{i.id}</p>
                        <p>{i.name}</p>
                        <p>{i.email}</p>
                        </>
                    )
                })}
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        email : state.email,
        token : state.token,
        password : state.password
    }
}


export default connect(mapStateToProps)(User)