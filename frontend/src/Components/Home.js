import React, { useState, useEffect } from "react";

export default function Home() {
  const [homeData, setHomeData] = useState("");
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false);

  const callHomePage = async () => {
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
      setHomeData(data.name);
      setShow(true)
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    callHomePage();
  }, []);

  const handlePortfolioClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container home">
      <h1>{!show ? "Welcome" : `Welcome ${homeData}`}</h1>
      <p>
        We are Mern Developer! We're excited to have you here. Explore our
        features and enjoy your stay.
      </p>
      <button className="cta-button" onClick={handlePortfolioClick}>Portfolio</button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="back-button" onClick={handleCloseModal}>
              &larr; Back
            </button>
            <p className="para">
              What you are looking at is my finest product by now. If you want
              to see more projects from me, let me know if you want to create
              something from me.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
