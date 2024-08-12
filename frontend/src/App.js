import './App.css';
import Navbar from './Components/Navbar';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Profile from "./Components/Profile";
import Contact from "./Components/Contact";
import Home from './Components/Home';
import Notpage from "./Components/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';

function App() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLogged(loggedIn);
  }, []);

  const handleLogin = (status) => {
    setIsLogged(status);
    localStorage.setItem("isLoggedIn", status);
  };

  return (
    <BrowserRouter>
      <Navbar log={isLogged} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile log={handleLogin} />} />
        <Route path="/contact" element={<Contact />} />
        {!isLogged && <Route path="/signup" element={<Signup />} />}
        {!isLogged && <Route path="/login" element={<Login log={handleLogin} />} />}
        <Route path="*" element={<Notpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
