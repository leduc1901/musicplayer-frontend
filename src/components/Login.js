import React, { Component } from 'react'
import axios from "axios"
import { connect } from "react-redux"
import { loggedIn } from "../actions/playerAction"
import {withRouter} from "react-router-dom"
export class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            email : "", 
            password : "",
            regName : "",
            regEmail : "",
            regPassword : "",
            regPassword2 : "",
            login : 1,
        }
    }

    componentDidMount(){
        if(this.props.loggedIn){
            this.props.history.push("/player")
        }
    }

    async testLogin(){
            try {
                const logged = await axios.post(`/auth/login` , {email : this.state.email, password : this.state.password})
                this.props.dispatchLoggedIn(this.state.email , this.state.password , logged.data.token , logged.data.id)
                console.log(logged.data.token)
                this.props.history.push("/player")
            } catch (error) {
                console.log(error)
            }
      
    }

    async testSignUp(){
        try {
            const logged = await axios.post(`/users` , {user: {name : this.state.regName, email : this.state.regEmail , password : this.state.regPassword , password_confirmation : this.state.regPassword2}} )
            console.log(logged)
            this.setState({
                login : 1
            })
        } catch (error) {
            console.log(error)
        }
  
}

    signUpChange = () => {
        this.setState({
            login : 0
        })
    }

    logInChange = () => {
        this.setState({
            login : 1
        })
    }

    handleEmailLogin = (input) => {
        this.setState({
            email : input.target.value
        })
    }

    handlePasswordLogin = (input) => {
        this.setState({
            password : input.target.value
        })
    }

    handleEmailSignUp = (input) => {
        this.setState({
            regEmail : input.target.value
        })
    }

    handleNameSignUp = (input) => {
        this.setState({
            regName : input.target.value
        })
    }

    handlePasswordSignUp = (input) => {
        this.setState({
            regPassword : input.target.value
        })
    }

    handlePasswordConfirmation = (input) => {
        this.setState({
            regPassword2 : input.target.value
        })
    }

    renderLogin = () => {
        return (
            <div class="login100-form validate-form">
                        <span class="login100-form-title p-b-26">
                            Welcome
                        </span>
                        
    
                        <div class="wrap-input100 validate-input" data-validate = "Valid email is: a@b.c">
                            <input class="input100" type="text" name="email" onChange={(e) => this.handleEmailLogin(e)} />
                            <span class="focus-input100" data-placeholder="Email"></span>
                        </div>
    
                        <div class="wrap-input100 validate-input" data-validate="Enter password">
                            <span class="btn-show-pass">
                                <i class="zmdi zmdi-eye"></i>
                            </span>
                            <input class="input100" type="password" name="pass" onChange={(e) => this.handlePasswordLogin(e)}/>
                            <span class="focus-input100" data-placeholder="Password"></span>
                        </div>
    
                        <div class="container-login100-form-btn">
                            <div class="wrap-login100-form-btn">
                                <div class="login100-form-bgbtn"></div>
                                <button class="login100-form-btn" onClick={this.testLogin.bind(this)} >
                                    Login
                                </button>
                            </div>
                        </div>
    
                        <div class="text-center p-t-115">
                            <span class="txt1">
                                Don’t have an account?
                            </span>
    
                            <a class="txt2" href="#" onClick={this.signUpChange}>
                                Sign Up
                            </a>
                        </div>
                    </div>
        )
    }

    renderForm = () => {
        if(this.state.login == 0){
            return(
                 this.renderSignUp()
            )
            
        }else{
           return(
               this.renderLogin() 
           )
        }
    }

    renderSignUp = () => {
        return (
            <div class="login100-form validate-form">
            <span class="login100-form-title p-b-26">
                Sign Up
            </span>
            
            <div class="wrap-input100 validate-input">
                <input class="input100" type="text" name="name" onChange={(e) => this.handleNameSignUp(e)} />
                <span class="focus-input100" data-placeholder="Name"></span>
            </div>

            <div class="wrap-input100 validate-input" data-validate = "Valid email is: a@b.c">
                <input class="input100" type="text" name="email" onChange={(e) => this.handleEmailSignUp(e)} />
                <span class="focus-input100" data-placeholder="Email"></span>
            </div>

            <div class="wrap-input100 validate-input" data-validate="Enter password">
                <span class="btn-show-pass">
                    <i class="zmdi zmdi-eye"></i>
                </span>
                <input class="input100" type="password" name="pass" onChange={(e) => this.handlePasswordSignUp(e)}/>
                <span class="focus-input100" data-placeholder="Password"></span>
            </div>

            <div class="wrap-input100 validate-input" data-validate="Enter password">
                <span class="btn-show-pass">
                    <i class="zmdi zmdi-eye"></i>
                </span>
                <input class="input100" type="password" name="pass" onChange={(e) => this.handlePasswordConfirmation(e)}/>
                <span class="focus-input100" data-placeholder="Password Confirmation"></span>
            </div>

            <div class="container-login100-form-btn">
                <div class="wrap-login100-form-btn">
                    <div class="login100-form-bgbtn"></div>
                    <button class="login100-form-btn" onClick={this.testSignUp.bind(this)} >
                        Sign Up
                    </button>
                </div>
            </div>

            <div class="text-center p-t-115">
                <span class="txt1">
                    Do have an account?
                </span>

                <a class="txt2" href="#" onClick={this.logInChange}>
                    Login
                </a>
            </div>
        </div>
        )
    }

    render() {
        return (
            <div class="limiter">
            <div class="container-login100">
                <div class="wrap-login100">
                    {this.renderForm()}
                </div>
            </div>
        </div>
        
        )
    }
}

function mapStateToProps(state){
    return {
        email : state.email,
        password : state.password,
        token : state.token,
        loggedIn : state.loggedIn
    }
}

function mapDispatchToProps(dispatch){
    return {
        dispatchLoggedIn : (email, password, token , id) => dispatch(loggedIn(email, password, token , id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
