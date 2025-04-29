import React from "react";
import { Phone, Info, Shield, FileText, AlertCircle, Book } from "lucide-react";

const TyphoonPreparedness = () => {
  return (
    <div className="typhoon-container">
      <header className="typhoon-header">
        <h1>Typhoon Impact on the Philippines</h1>
        <p className="subtitle">
          The Philippines is prone to tropical cyclones due to its geographical
          location which generally produces heavy rains and flooding of large
          areas and also strong winds which may destroy crops, properties and
          even lives related to safety and properties.
        </p>
        <p className="subtitle">
          Thus, it is of utmost importance to have sufficient knowledge on such
          typhoon precautions for beneficial purposes.
        </p>
      </header>

      <section className="typhoon-section blue-section">
        <h2>Pre-Impact Phase Preparedness Plan</h2>
      </section>

      <div className="typhoon-content">
        <div className="typhoon-column">
          <div className="info-card">
            <div className="info-header">
              <Info size={24} className="info-icon" />
              <h3>Stay Informed</h3>
            </div>
            <ul>
              <li>Monitor weather news/media, NDRRMC, and local DRRM office</li>
              <li>Subscribe to SMS and email alerts for weather updates</li>
              <li>Official Links:</li>
              <li className="official-link">PAGASA Facebook</li>
              <li className="official-link">NDRRMC Facebook</li>
              <li className="contact">PAGASA HOTLINE: 8284-0800</li>
            </ul>
          </div>

          <div className="info-card">
            <div className="info-header">
              <Shield size={24} className="info-icon" />
              <h3>Emergency Kit</h3>
            </div>
            <ul>
              <li>Drinking water (good for at least 3 days)</li>
              <li>Ready-to-eat food (good for at least 3 days)</li>
              <li>Flashlight and extra batteries</li>
              <li>Power bank</li>
              <li>Radio, AM/FM - battery operated</li>
              <li>First aid kit</li>
              <li>Essential medicine</li>
              <li>Cash and important documents</li>
              <li>Copies of important documents like IDs, insurance, etc.</li>
              <li>Emergency card</li>
            </ul>
          </div>
        </div>

        <div className="typhoon-column">
          <div className="info-card">
            <div className="info-header">
              <Book size={24} className="info-icon" />
              <h3>Secure Your Home</h3>
            </div>
            <ul>
              <li>Double appliances are turned off for flood-prone areas</li>
              <li>
                Clear gutters and drainage to let out storm/typhoon runoffs
              </li>
              <li>Clear gutters and drains to prevent flooding</li>
            </ul>
          </div>

          <div className="info-card">
            <div className="info-header">
              <AlertCircle size={24} className="info-icon" />
              <h3>Prepare for Evacuation</h3>
            </div>
            <ul>
              <li>Know your nearest evacuation center</li>
              <li>
                Coordinate with Barangay Officials for needed transportation
              </li>
              <li>Pack your Go Bag</li>
              <li>Tell a meeting point for family members</li>
              <li>If you have livestock, evacuate them to high ground</li>
              <li>Plug out all electrical and power appliances</li>
            </ul>
          </div>

          <div className="info-card">
            <div className="info-header">
              <FileText size={24} className="info-icon" />
              <h3>Final Preparations</h3>
            </div>
            <ul>
              <li>Fully charge phones, radios and rechargeable batteries</li>
              <li>
                Make a final check for all preparations and safety concerns
              </li>
              <li>Turn off unused appliances to prevent damage</li>
              <li>Save emergency contacts easily accessible</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="typhoon-section red-section">
        <h2>Emergency Contacts</h2>
        <p className="contact-note">
          Keep these important contact numbers handy during emergencies.
        </p>
      </section>

      <div className="emergency-contacts">
        <div className="contact-card">
          <div className="contact-header">
            <div className="contact-icon-wrapper blue-bg">
              <Info size={24} className="contact-icon" />
            </div>
            <h3>DOST-PAGASA</h3>
            <p>National weather and tropical cyclone warnings</p>
          </div>
          <div className="contact-number">
            <Phone size={18} />
            <span>8284-0800</span>
          </div>
          <div className="social-links">
            <a href="#" className="social-link">
              Official Website
            </a>
            <a href="#" className="social-link">
              Facebook Page
            </a>
          </div>
        </div>

        <div className="contact-card">
          <div className="contact-header">
            <div className="contact-icon-wrapper red-bg">
              <AlertCircle size={24} className="contact-icon" />
            </div>
            <h3>NDRRMC</h3>
            <p>National Disaster Risk Reduction and Management</p>
          </div>
          <div className="contact-number">
            <Phone size={18} />
            <span>911</span>
          </div>
          <div className="social-links">
            <a href="#" className="social-link">
              Official Website
            </a>
            <a href="#" className="social-link">
              Facebook Page
            </a>
          </div>
        </div>

        <div className="contact-card">
          <div className="contact-header">
            <div className="contact-icon-wrapper green-bg">
              <Phone size={24} className="contact-icon" />
            </div>
            <h3>PNP</h3>
            <p>Philippine National Police</p>
          </div>
          <div className="contact-number">
            <Phone size={18} />
            <span>117</span>
          </div>
          <div className="social-links">
            <a href="#" className="social-link">
              Official Website
            </a>
            <a href="#" className="social-link">
              Facebook Page
            </a>
          </div>
        </div>
      </div>

      <div className="emergency-contacts">
        <div className="contact-card">
          <div className="contact-header">
            <div className="contact-icon-wrapper blue-bg">
              <Info size={24} className="contact-icon" />
            </div>
            <h3>BFP</h3>
            <p>Bureau of Fire Protection</p>
          </div>
          <div className="contact-number">
            <Phone size={18} />
            <span>160</span>
          </div>
          <div className="social-links">
            <a href="#" className="social-link">
              Official Website
            </a>
            <a href="#" className="social-link">
              Facebook Page
            </a>
          </div>
        </div>

        <div className="contact-card">
          <div className="contact-header">
            <div className="contact-icon-wrapper red-bg">
              <AlertCircle size={24} className="contact-icon" />
            </div>
            <h3>Red Cross Philippines</h3>
            <p>Emergency assistance and relief operations</p>
          </div>
          <div className="contact-number">
            <Phone size={18} />
            <span>143</span>
          </div>
          <div className="social-links">
            <a href="#" className="social-link">
              Official Website
            </a>
            <a href="#" className="social-link">
              Facebook Page
            </a>
          </div>
        </div>
      </div>

      <footer className="typhoon-footer">
        <p className="important-note">
          <strong>Important:</strong> In case of imminent danger to
          life-threatening emergencies, always call 911. Keep these numbers
          saved in your phone and written down in an easily accessible place.
        </p>
      </footer>
    </div>
  );
};

export default TyphoonPreparedness;
