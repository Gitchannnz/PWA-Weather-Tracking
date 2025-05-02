import React from "react";
import { useNavigate } from "react-router-dom";

const StayInformedSection = () => {
  const navigate = useNavigate();

  const handleTrackCyclones = () => {
    navigate("/tracking");
  };

  const handleLearnMore = () => {
    navigate("/tropical-cyclones");
  };

  return (
    <div className="cta-container">
      <h2 className="cta-title">Stay Informed, Stay Safe</h2>
      <p className="cta-description">
        Monitor active tropical cyclones, view historical data, and learn about
        cyclone preparedness.
      </p>
      <div className="cta-buttons">
        <button
          className="cta-button primary-button"
          onClick={handleTrackCyclones}
        >
          Track Cyclones
        </button>
        <button
          className="cta-button secondary-button"
          onClick={handleLearnMore}
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default StayInformedSection;
