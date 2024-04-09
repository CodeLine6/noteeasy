import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AlertContext from '../context/Alert/AlertContext';
import userReducer from '../reducers/LoginSignup';
import Form from '../components/Form';
import GoogleSignIn from '../components/UI/GoogleSignIn';


const signUp = async ({ name, password, email }) => {
  const API_HOST = process.env.REACT_APP_API_HOST;
  const response = await fetch(`${API_HOST}/api/auth/createuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
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

const Signup = () => {
  const setAlerts = useContext(AlertContext);
  let navigate = useNavigate();

  const [{ name, password, email, cpassword, submitting, success }, dispatch] = useReducer(userReducer, {
    name: "", password: "", email: "", cpassword: "", submitting: false, success: false
  })


  const handleSubmit = async (e) => {

    e.preventDefault();
    dispatch({ type: "submit" })

    try {
      const response = await signUp({ name, password, email })
      dispatch({ type: "success", payload: { response } })
    }
    catch (e) {
      dispatch({ type: "error", setAlert: setAlerts, error: e.message });
    }

  }

  useEffect(() => {
    if (success) {
      setAlerts({ type: "success", message: "Account Created" })
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
      label: 'Name',
      name: 'name',
      placeholder: 'John Doe',
      handleChange: (e) => dispatch({ type: "input", name: "name", value: e.target.value })
    },
    {
      label: 'Email address',
      inputType: 'email',
      name: 'email',
      value: email,
      placeholder: 'johndoe@example.com',
      handleChange: (e) => dispatch({ type: "input", name: "email", value: e.target.value })
    },
    {
      label: 'Password',
      inputType: 'password',
      name: 'password',
      placeholder: '*********',
      handleChange: (e) => dispatch({ type: "input", name: "password", value: e.target.value })
    },
    {
      label: 'Confirm Password',
      inputType: 'password',
      name: 'cpassword',
      placeholder: '*********',
      classes: 'mb-3',
      handleChange: (e) => dispatch({ type: "input", name: "cpassword", value: e.target.value })
    },

  ]

  return (
    <div className='flex justify-center items-center w-full h-screen bg-gray-500'>
      <div id="form-wrapper" className="bg-white rounded-lg w-[400px] p-6">
        <Form title="Sign Up" subtitle="Enter your information to create an account"  {...{ handleSubmit, fields }} isSubmitDisabled={submitting} ctaText="Sign Up" />
        <GoogleSignIn />
        <p className="text-center mt-3 font-medium">Already have an account? <ins><Link to="/login">Login</Link></ins></p>
      </div>
    </div>

  )
}

export default Signup