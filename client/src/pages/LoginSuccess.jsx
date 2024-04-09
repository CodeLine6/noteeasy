// LoginSuccessPage.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccess = () => {
    let navigate = useNavigate();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            // Store the token securely, e.g., in local storage
            localStorage.setItem('authToken', token);
            // Redirect the user to another page or perform any necessary actions
            // For example, you might redirect the user to the dashboard:
            navigate('/');
        }
    }, []);

    return (
        <div>
            <h2>Login Successful</h2>
            <p>Redirecting...</p>
        </div>
    );
};

export default LoginSuccess;
