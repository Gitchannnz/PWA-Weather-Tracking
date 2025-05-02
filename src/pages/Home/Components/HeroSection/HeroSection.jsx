import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderImage from "../../../../assets/Header Image.png";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleViewCyclonesClick = () => {
    navigate("/tracking"); 
  };

  return (
    <div
      className="hero-container"
      style={{
        backgroundImage: `url(${HeaderImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "48vh",
      }}
    >
      <div className="hero-content">
        <h1 className="hero-title">Tropical Cyclone Tracker</h1>
        <p className="hero-subtitle">
          Monitor and track tropical cyclones in the Philippines and surrounding
          areas
        </p>

        <div className="hero-button-container">
          <button
            className="view-cyclones-button"
            onClick={handleViewCyclonesClick}
          >
            <svg
              className="eye-icon"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>View Past Cyclones</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
