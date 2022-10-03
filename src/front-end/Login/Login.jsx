import React, { useEffect, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from "react-router-dom";
import pharmacy from '../components/assets/pharmacy.jpg';
import medime_icon from '../components/assets/medime_icon.png';
import { auth, logInWithEmailAndPassword, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const navigate = useNavigate();
    useEffect(() => {
        if (loading) {
            // maybe trigger a loading screen
            return;
        }
        if (user) navigate("/dashboard");
    }, [user, loading]);
    return (
        <div className="main-login">
            <div className="login-contain">
                <div id="logo">
                    <a href="/"><img src={medime_icon} style={{ width: '130px', height: '90px', objectFit: 'fill' }} /></a>
                </div>
                <div className="left-side">


                    <div className='title'>Welcome Back!</div>

                    <h2>Please sign in to use the system.</h2>

                    <form onSubmit={handleSubmit}>
                        <label for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address" />

                        <label for="password">Password</label>
                        <input type="password"
                            id="pass"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password" />

                        <button
                            type="submit"
                            id="button_login"
                            onClick={() => {logInWithEmailAndPassword(email, password); }}
                        >
                            Sign in
                        </button>
                    </form>
                </div>

                <div className="right-side">
                    <img src={pharmacy} style={{ width: "95%", height: "100%", objectFit: 'fill' }} />
                </div>
            </div>
        </div>
    )
}

export default Login
