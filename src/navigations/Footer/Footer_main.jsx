import React from "react";


const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="/home">Home</a>
              </li>
              <li>
                <a href="/cyclone-info">Cyclone Info</a>
              </li>
              <li>
                <a href="/tracking">Tracking</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Contact Information</h3>
            <ul className="footer-contact">
              <li>
                <svg
                  className="footer-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm1 0v14h14V3H3z"></path>
                  <path d="M6 6h8v2H6V6zm0 4h8v2H6v-2zm0 4h4v2H6v-2z"></path>
                </svg>
                <span>PAGASA Weather and Flood Forecasting Center</span>
              </li>
              <li>
                <svg
                  className="footer-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>
                  Science Garden Compound, Agham Road, Diliman, Quezon City
                </span>
              </li>
              <li>
                <svg
                  className="footer-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm1 0v14h14V3H3z"></path>
                  <path d="M4 5.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"></path>
                </svg>
                <span>info@cyclonetracker.gov.ph</span>
              </li>
              <li>
                <svg
                  className="footer-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm1 0v14h14V3H3z"></path>
                  <path d="M6 8a1 1 0 011-1h.5a1 1 0 011 1v4a1 1 0 01-1 1H7a1 1 0 01-1-1V8zm3 0a1 1 0 011-1h.5a1 1 0 011 1v4a1 1 0 01-1 1H10a1 1 0 01-1-1V8z"></path>
                </svg>
                <span>(02) 8927-1335</span>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Developed By</h3>
            <div className="developer-info">
              <p>Ronald O. Mancao</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
