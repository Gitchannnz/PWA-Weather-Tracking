import React from "react";
import { useNavigate } from "react-router-dom";


const StayInformedSection = () => {
  return (
    <div className="cta-container">
      <h2 className="cta-title">Stay Informed, Stay Safe</h2>
      <p className="cta-description">
        Monitor active tropical cyclones, view historical data, and learn about
        cyclone preparedness.
      </p>
      <div className="cta-buttons">
        <button className="cta-button primary-button">Track Cyclones</button>
        <button className="cta-button secondary-button">Learn More</button>
      </div>
    </div>
  );
};

export default StayInformedSection;
