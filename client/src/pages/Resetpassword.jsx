import React, { useContext, useReducer } from 'react'
import Form from '../components/Form'
import AlertContext from '../context/Alert/AlertContext';
import { resetPasswordReducer } from './Forgetpassword';
import { Link, useNavigate, useParams } from 'react-router-dom';

const resetPassword = async (newPassword, token) => {
    const API_HOST = process.env.REACT_APP_API_HOST;

    const response = await fetch(`${API_HOST}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            newPassword
        }),
    });

    const data = await response.json();
    if (response.status !== 200) {
        throw new Error(JSON.stringify(data.message));
    }

    return data;
}

const Resetpassword = () => {

    const setAlerts = useContext(AlertContext);
    let { token } = useParams();
    let navigate = useNavigate();
    const [{ newPassword, submitting }, dispatch] = useReducer(resetPasswordReducer, {
        newPassword: "", submitting: false
    })

    const fields = [{
        label: 'Enter new password',
        inputType: 'password',
        name: 'newPassword',
        placeholder: '******',
        value: newPassword,
        classes: 'mb-3',
        handleChange: (e) => dispatch({ type: "input", name: "newPassword", value: e.target.value })
    }]

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: "submit" })

        try {
            const response = await resetPassword(newPassword, token)
            dispatch({ type: "success", setAlert: setAlerts, payload: response.message });
            setTimeout(() => navigate('/login'), 100)
        }
        catch (e) {
            dispatch({ type: "error", setAlert: setAlerts, error: JSON.parse(e.message) });
        }
    }
    return (
        <div className='flex justify-center items-center w-full h-screen bg-gray-500'>
            <div id="form-wrapper" className="bg-white rounded-lg w-[400px] p-6">
                <Form title="Reset Password" {...{ handleSubmit, fields }} isSubmitDisabled={submitting} ctaText={"Reset Password"} />
                <p className="text-center mt-3 font-medium"><ins><Link to="/login">Login</Link></ins> / <ins><Link to="/signup">Sign Up</Link></ins></p>
            </div>
        </div>
    )
}

export default Resetpassword