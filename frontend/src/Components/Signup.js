import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';
import Spinner from './Spinner';

export default function Signup() {
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "", email: "", password: "", cpassword: ""
    });

    const handleUser = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setUser({ ...user, [name]: value });
    }

    const registerUser = async (e) => {
        e.preventDefault();
        let { name, email, password, cpassword } = user;
    
        // Check if passwords match before sending the request
        if (password !== cpassword) {
            window.alert("Passwords do not match");
            return;
        }
    
        setLoader(true);
    
        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials:"include",
                body: JSON.stringify({
                    name, email, password, cpassword
                })
            });
    
            console.log("Full Response object:", response);
    
            const res = await response.json();
            if (response.status === 201) {
                console.log("User registered successfully:Login now");
                navigate("/login");
            }
            else if(response.status === 422 || response.status === 400){
                window.alert("Fill the form correctly");
            }else{
                window.alert("Error registering user")
            }
        } catch (error) {
            window.alert(res.error);
        } finally {
            setLoader(false);
        }
    }
    
    

    return (
        <div className="a-container">
            {loader&&<Spinner/>}
            <div className="form">
                <div className="main-header">
                    <h1>SignUp Form</h1>
                </div>
                <form method='POST'>
                    <div className="input-field">
                        <label htmlFor="fname"><i className="material-icons">person</i></label>
                        <input type="text" name='name' value={user.name} onChange={handleUser} className="fname" placeholder="Enter Your Name" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="email"><i className="material-icons">email</i></label>
                        <input type="email" name='email' value={user.email} onChange={handleUser} className="email" placeholder="Enter Your Email" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="password"><i className="material-icons">password</i></label>
                        <input type="password" name='password' value={user.password} onChange={handleUser} className="password" placeholder="Enter Password" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="cpassword"><i className="material-icons">password</i></label>
                        <input type="password" name='cpassword' value={user.cpassword} onChange={handleUser} className="password" placeholder="Confirm Password" />
                    </div>
                    <div className="form-btn">
                        <button type="submit" onClick={registerUser}>Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
