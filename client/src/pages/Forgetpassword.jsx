import React, { useContext, useReducer } from 'react'
import Form from '../components/Form';
import AlertContext from '../context/Alert/AlertContext';
import { Link } from 'react-router-dom';

export const resetPasswordReducer = (state, action) => {

    if (action.type === "input") {
        return {
            ...state,
            [action.name]: action.value
        }
    }

    else if (action.type === "submit") {
        return {
            ...state,
            submitting: true
        }
    }

    else if (action.type === "success") {
        typeof action.payload === "object" ? action.payload.map(e => (
            action.setAlert({ type: 'success', message: e.message })
        )) : action.setAlert({ type: 'success', message: action.payload })
        return {
            ...state,
            submitting: false,
        }
    }

    else if (action.type === "error") {
        typeof action.error === "object" ? action.error.map(e => (
            action.setAlert({ type: 'error', message: e.message })
        )) : action.setAlert({ type: 'error', message: action.error })
        return {
            ...state,
            submitting: false,
        }
    }
    else return state
}

const forgetPassword = async (email) => {
    const API_HOST = process.env.REACT_APP_API_HOST;
    const response = await fetch(`${API_HOST}/api/auth/forget-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email
        }),
    });

    const data = await response.json();
    if (response.status !== 200) {
        throw new Error(JSON.stringify(data.message));
    }

    return data;
}


const Forgetpassword = () => {
    const setAlerts = useContext(AlertContext);
    const [{ email, submitting }, dispatch] = useReducer(resetPasswordReducer, {
        email: "", submitting: false
    })

    const fields = [{
        label: 'Enter your email address',
        inputType: 'email',
        name: 'email',
        placeholder: 'johndoe@example.com',
        value: email,
        classes: 'mb-3',
        handleChange: (e) => dispatch({ type: "input", name: "email", value: e.target.value })
    }]

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: "submit" })

        try {
            const response = await forgetPassword(email)
            dispatch({ type: "success", setAlert: setAlerts, payload: response.message });
        }
        catch (e) {
            dispatch({ type: "error", setAlert: setAlerts, error: JSON.parse(e.message) });
        }
    }

    return (
        <div className='flex justify-center items-center w-full h-screen bg-gray-500'>
            <div id="form-wrapper" className="bg-white rounded-lg w-[400px] p-6">
                <Form title="Forget Password" {...{ handleSubmit, fields }} isSubmitDisabled={submitting} ctaText={"Reset Password"} />
                <p className="text-center mt-3 font-medium"><ins><Link to="/login">Login</Link></ins> / <ins><Link to="/signup">Sign Up</Link></ins></p>
            </div>
        </div>
    )
}

export default Forgetpassword