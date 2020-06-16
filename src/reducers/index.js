import * as ActionType from "../actions/actionTypes"

const defaultState = {
    email : "",
    password : "",
    token : "",
}

export default function playerReducer(state = defaultState, action){
    switch(action.type){
        case ActionType.LOGGEG_IN:
            return Object.assign({} , state , {
                email : action.email,
                password : action.password,
                token : action.token
            })
        case ActionType.LOG_OUT:
            return Object.assign({}, state , {
                email : "",
                password : "",
                token : ""
            })
        default:
            return state
    }
}