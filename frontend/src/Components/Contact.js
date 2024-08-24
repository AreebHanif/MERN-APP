import React, { useState, useEffect } from 'react';
import "./contact.css";

export default function Contact() {
  const [contactData, setContactData] = useState({ name: "", email: "", message: "" });

  const callContactPage = async () => {
    try {
      const res = await fetch("/getcontact", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error(errorData.error);
        return;
      }

      const data = await res.json();
      setContactData({ ...contactData, name: data.name, email: data.email });
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    callContactPage();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData({ ...contactData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = contactData;

    try {
      const res = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      const data = await res.json();
      if (!data) {
      } else {
        alert("Message sent");
        setContactData({ ...contactData, message: "" });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <div className="main-container">
        <div className="main-contact">
          <div className="contact-header">
            <h1>Get in touch</h1>
          </div>
          <div className="fill-names">
            <span>{contactData.name || "Your Name"}</span>
            <span>{contactData.email || "example@email.com"}</span>
          </div>
          <form method="POST" onSubmit={handleFormSubmit}>
            <label className="label">Enter Your Message</label>
            <div className="text-area">
              <textarea
                rows="10"
                cols="60"
                placeholder="Type here"
                name="message"
                value={contactData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="form-btn">
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
