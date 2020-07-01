import * as ActionType from "./actionTypes"

export const loggedIn = (email , password , token , id , role) => {
    return {
        type : ActionType.LOGGEG_IN,
        email,
        password,
        id,
        token,
        role
    }
}

export const logOut = () => {
    return {
        type : ActionType.LOG_OUT
    }
}