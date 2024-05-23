import { Routes, Route, useNavigate, useLocation, } from "react-router-dom";
import Navbar from './Navbar';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AlertState from '../context/Alert/AlertState';
import { useEffect } from "react";
import ReactGA from 'react-ga4';
import Invite from "./Invite";
import Background from "./Background";
import Forgetpassword from "../pages/Forgetpassword";
import Resetpassword from "../pages/Resetpassword";
import LoginSuccess from "../pages/LoginSuccess";
import SearchProvider from "../context/SearchContext";
import { Toaster } from "sonner";
ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);

const Authcheck = ({ Comp }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            return navigate('/')
        }
    }, [])

    return !localStorage.getItem('authToken') && <Comp />
}

const Routehandler = () => {

    const location = useLocation();
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search })
    }, [location]);

    return (
        <AlertState>
            <Routes>
                <Route path="/" element={<>
                    <Background />
                    <div className="z-10 relative h-screen flex flex-col">
                        <SearchProvider>
                            <Navbar />
                            <Toaster theme={"light"} />
                            <Home />
                        </SearchProvider>
                    </div>
                </>} />
                <Route path="login" element={<Authcheck Comp={Login} />} />
                <Route path="signup" element={<Authcheck Comp={Signup} />} />
                <Route path="invite" element={<Invite />} />
                <Route path="forget-password" element={<Forgetpassword />} />
                <Route path="reset-password/:token" element={<Resetpassword />} />
                <Route path="login-success" element={<LoginSuccess />} />
            </Routes>
        </AlertState>

    )
}

export default Routehandler;