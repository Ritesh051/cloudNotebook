import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from 'react-google-login';
import './Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const clientID = 'clientId';
    let navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: credentials.email, password: credentials.password })
            });

            const json = await response.json();

            if (json.success) {
                localStorage.setItem('token', json.authToken);
                navigate("/");
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred during login.");
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // Google Login functions
    const onSuccess = (response) => {
        console.log("Google login success:", response);
    };

    const onFailure = (response) => {
        console.error("Google login failed:", response);
        alert("Google login failed. Please try again.");
    };

    // Use hook to handle Google login
    const { signIn } = useGoogleLogin({
        clientId: clientID,
        onSuccess: onSuccess,
        onFailure: onFailure,
        cookiePolicy: 'single_host_origin',
        isSignedIn: true,
    });

    return (
        <div className='container loginForm'>
            <h2>Sign in</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 my-4">
                    <label htmlFor="email" className="form-label label is-required">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={credentials.email}
                        onChange={onChange}
                        id="email"
                        placeholder='Email'
                        required
                    />
                </div>
                <div className="mb-3 my-4">
                    <label htmlFor="password" className="form-label label is-required">Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            name="password"
                            value={credentials.password}
                            onChange={onChange}
                            id="password"
                            placeholder='Password'
                            required
                        />
                        <i
                            className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                            onClick={togglePasswordVisibility}
                            style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                        ></i>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary my-3" id='submitBtn'>Sign In</button>

                <div className="divider">
                    <span>OR</span>
                </div>
            </form>

            {/* Custom Google login button */}
            <div className="google-login-button" onClick={signIn}>
                <i className="fa-brands fa-google"></i>
            </div>
            <div className="auth-options">
                <a href="/forgot-password" className="auth-link">Forgot Password?</a>
                <div className="separator"></div>
                <a href="/signup" className="auth-link">Sign Up</a>
            </div>

        </div>
    );
};

export default Login;
