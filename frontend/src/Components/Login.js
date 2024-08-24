import React, { useState } from 'react';
import "./Main.css";
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';

export default function Login({ log }) {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState({
    email: "", password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginValue({ ...loginValue, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginValue;
    setLoader(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      const data = await response.json();
      
      if (response.status === 200) {
        log(true);
        navigate("/");
      } else {
        window.alert(data.msg || "Error logging in...");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="a-container">
      {loader && <Spinner />}
      <div className="form b-container">
        <div className="main-header">
          <h1>Login Form</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-field">
            <label><i className="material-icons">person</i></label>
            <input type="text" name='email' value={loginValue.email} onChange={handleChange} required placeholder='Enter email' />
          </div>
          <div className="input-field">
            <label><i className="material-icons">password</i></label>
            <input type="password" name='password' value={loginValue.password} onChange={handleChange} required placeholder='Password' />
          </div>
          <div className="form-btn">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
