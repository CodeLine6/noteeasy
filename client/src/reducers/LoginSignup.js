const userReducer = (state, action) => {
    if (action.type === "input") {
        return {
            ...state,
            [action.name]: action.value
        }
    }

    else if (action.type === "submit") {
        return {
            ...state,
            err: null,
            submitting: true
        }
    }

    else if (action.type === "success") {
        localStorage.setItem("authToken", action.payload.response.authtoken)
        return {
            ...state,
            success: true
        }
    }

    else if (action.type === "error") {
        (typeof JSON.parse(action.error) === "object") ? (JSON.parse(action.error)).map(e => (
            action.setAlert({ type: 'error', message: e.msg })
        )) : action.setAlert({ type: 'error', message: action.error })
        return {
            ...state,
            submitting: false,
        }
    }
    else return state
}

export default userReducer;