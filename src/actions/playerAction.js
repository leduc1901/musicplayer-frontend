import * as ActionType from "./actionTypes"

export const loggedIn = (email , password , token , id) => {
    return {
        type : ActionType.LOGGEG_IN,
        email,
        password,
        id,
        token
    }
}

export const logOut = () => {
    return {
        type : ActionType.LOG_OUT
    }
}