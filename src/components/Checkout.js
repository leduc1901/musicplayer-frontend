import axios from 'axios';
import {CardElement , injectStripe} from 'react-stripe-elements';
import {connect} from "react-redux"
import React, { Component } from 'react'

export class Checkout extends Component {
    state = {
        complete : false
    }

    componentDidMount(){
        this.getVerify()
    }

    getVerify = async () => {
        try {
            const avatar = await axios.get(`/users/${this.props.id}` , {headers : {'Authorization': this.props.token}})
            this.setState({verify : avatar.data.verify})
        } catch (error) {
            
        }
    }

    submit = async () => {
        try {
            let {token} = await this.props.stripe.createToken({id: this.props.id})
            const response = await axios.post("/charges" , {token:token.id , id:this.props.id})
            this.setState({
                complete : true
            })
        } catch (error) {
            alert("Wrong Infomation")
        }
    }

    render() {
        if(this.state.complete || this.state.verify === "verified") return <h1>You are a Gold Member !</h1>
        return (
            <div className="checkout">
                <p>Would you like to complete the purchase</p>
                <CardElement/>
                <button className="purchase-btn" onClick={this.submit}>Purchase</button>
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


export default connect(mapStateToProps)(injectStripe(Checkout))
