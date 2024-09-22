import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = credentials
        try {
            const response = await fetch("http://localhost:5000/api/auth/createuser", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });
            const json = await response.json();
            console.log(json);
            //save the auth token and redirect 
            localStorage.setItem('token', json.authtoken)
            navigate("/")
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    return (
        <div className=" container">
        <div className="container">
            <img src="https://cloud.appwrite.io/console/_app/immutable/assets/login-dark-mode.CXyYQeDN.png" alt="Signup visual" />
        </div>
            <form  className="container" onSubmit={handleSubmit}>
                <div className="form-group  mb-3 ">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="name" className="form-control" name="name" id="name" onChange={onChange} aria-describedby="emailHelp" required />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" name="email" id="email" onChange={onChange} aria-describedby="emailHelp" required />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" id="password" onChange={onChange} required />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" name="cpassword" id="cpassword" onChange={onChange} required />
                </div>
                <button type="submit" className="btn btn-primary">SignUp</button>
            </form>
        </div>
    );
}

export default Signup;
