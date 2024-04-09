import React from 'react'

const GoogleSignIn = () => {
    const handleClick = () => {
        window.location = `${process.env.REACT_APP_API_HOST}/api/auth/google`
    }
    return (
        <button onClick={handleClick} className="mt-2 w-full py-2 border flex justify-center gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
            <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
            <span>Login with Google</span>
        </button>
    )
}

export default GoogleSignIn