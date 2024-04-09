import React, { useContext, useEffect, useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AlertContext from '../context/Alert/AlertContext';
import userReducer from '../reducers/LoginSignup'
import Form from '../components/Form';
import GoogleSignIn from '../components/UI/GoogleSignIn';

const signIn = async ({ email, password }) => {
    const API_HOST = process.env.REACT_APP_API_HOST;
    const response = await fetch(`${API_HOST}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        }),
    });

    const data = await response.json();
    if (response.status !== 200) {
        throw new Error(JSON.stringify(data.message));
    }

    return data;

}

const Login = () => {
    const setAlerts = useContext(AlertContext);
    let navigate = useNavigate();

    const [{ email, password, submitting, success }, dispatch] = useReducer(userReducer, {
        email: "", password: "", submitting: false, success: false
    })

    const handleSubmit = async (e) => {

        e.preventDefault();
        dispatch({ type: "submit" })

        try {
            const response = await signIn({ email, password })
            dispatch({ type: "success", payload: { response } })
        }

        catch (e) {
            dispatch({ type: "error", setAlert: setAlerts, error: e.message });
        }

    }

    useEffect(() => {
        if (success) {
            setAlerts({ type: "success", message: "Successfully Logged In" })
            navigate("/")
        }
    }, [success])

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('email')) {
            dispatch({ type: "input", name: "email", value: searchParams.get('email') })
        }
    }, [])

    const fields = [
        {
            label: 'Email address',
            inputType: 'email',
            name: 'email',
            placeholder: 'johndoe@example.com',
            value: email,
            handleChange: (e) => dispatch({ type: "input", name: "email", value: e.target.value })
        },
        {
            label: 'Password',
            inputType: 'password',
            name: 'password',
            placeholder: '*********',
            classes: 'mb-3',
            handleChange: (e) => dispatch({ type: "input", name: "password", value: e.target.value })
        }
    ]

    return (
        <div className='flex justify-center items-center w-full h-screen bg-gray-500'>
            <div id="form-wrapper" className="bg-white rounded-lg w-[400px] p-6">
                <Form title="Sign In" subtitle="Enter your credentials to access your account"  {...{ handleSubmit, fields }} isSubmitDisabled={submitting} ctaText="Log In" />
                <GoogleSignIn />
                <p className="text-center mt-3 font-medium">Forgot Password? <ins><Link to="/forget-password">Reset</Link></ins></p>
                <p className="text-center mt-3 font-medium">Don't have an account? <ins><Link to="/signup">Sign Up</Link></ins></p>
            </div>
        </div>
    )
}

export default Login