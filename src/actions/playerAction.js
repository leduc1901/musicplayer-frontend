import * as ActionType from "./actionTypes"

export const loggedIn = (email , password , token) => {
    return {
        type : ActionType.LOGGEG_IN,
        email,
        password,
        token
    }
}