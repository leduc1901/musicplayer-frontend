import * as ActionType from "../actions/actionTypes"

const defaultState = {
    email : "",
    password : "",
    token : "",
    id : 0,
    loggedIn : false,
    role : ""
}

export default function playerReducer(state = defaultState, action){
    switch(action.type){
        case ActionType.LOGGEG_IN:
            return Object.assign({} , state , {
                email : action.email,
                password : action.password,
                token : action.token,
                id : action.id,
                loggedIn: true,
                role : action.role
            })
        case ActionType.LOG_OUT:
            return Object.assign({}, state , {
                email : "",
                password : "",
                token : "",
                id : 0,
                loggedIn : false,
                role : ""
            })
        default:
            return state
    }
}