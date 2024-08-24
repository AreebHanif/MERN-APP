import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./about.css";

export default function About({ log }) {
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const callAboutPage = async () => {
    try {
      const res = await fetch("http://localhost:5000/profile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUserData(data);
        setMessage(data.msg);
      } else {
        if (res.status === 400) {
          navigate("/login");
        }
        window.alert(data.msg);
      }
    } catch (error) {
      setMessage("An error occurred");
    }
  };

  useEffect(() => {
    callAboutPage();
  }, []);

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (res.status === 200) {
        window.alert(data.msg);
        log(false);
        localStorage.setItem("isLoggedIn", false);
        navigate("/login"); // Redirect to login after logout
      } else {
        window.alert(data.msg);
        setMessage(data.msg);
      }
    } catch (error) {
      console.log(error);
      setMessage("Logout failed");
    }
  };

  return (
    <form method="GET">
      <div className="user-info">
        <div className="user-data">
          <div className="main-header">
            <h1>Profile Data</h1>
          </div>
          {message && <p className="message">{message}</p>}
          <table className="table table-striped">
            <tbody>
              <tr>
                <th scope="row">UserID</th>
                <td>{userData._id || "Your ID"}</td>
              </tr>
              <tr>
                <th scope="row">Name</th>
                <td>{userData.name || "Your Name"}</td>
              </tr>
              <tr>
                <th scope="row">Email</th>
                <td>{userData.email || "Your Email"}</td>
              </tr>
            </tbody>
          </table>
          <div className="form-btn" id="form-btn">
            <button
              type="button"
              className="btn btn-danger shadow"
              onClick={logout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
