import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState({})
    const API_HOST = process.env.REACT_APP_API_HOST;
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        localStorage.removeItem('authToken');
        navigate('/login')
    }, [])

    useEffect(() => {
        localStorage.getItem('authToken') ? (async () => {

            const request = await fetch(`${API_HOST}/api/auth/getuser`, {
                method: "POST",
                headers: {
                    "auth-token": localStorage.getItem('authToken'),
                    "Content-Type": "application/json"
                }
            })

            if (request.ok) {
                const user = await request.json();
                if (user) return setUser(user)
            }

            handleLogout()
        })() : navigate("/login")
    }, [])

    if (!localStorage.getItem('authToken')) return

    return <AuthContext.Provider value={{ user, handleLogout }}>{children}</AuthContext.Provider>
}

export default AuthContextProvider

export const useAuth = () => useContext(AuthContext)