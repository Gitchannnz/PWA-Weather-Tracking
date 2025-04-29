import React from "react";
import CycloneImage from "../../../assets/Cyclone Map.png"

const AboutTropicalCyclones = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About Tropical Cyclones</h1>

      {/* Info box */}
      <div className="info-box">
        <div className="info-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="#3b82f6"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>
        <p className="info-text">
          Tropical cyclones are warm-core low pressure systems associated with a
          spiral inflow of mass at the bottom level and spiral outflow at the
          top level.
        </p>
      </div>

      {/* Main content paragraphs */}
      <div className="content-section">
        <p>
          Tropical cyclones always form over oceans where sea surface
          temperature and air temperatures are greater than 26°C. The air
          accumulates large amounts of sensible and latent heat as it spirals
          towards the center. It receives this heat from the sea and the
          exchange can occur rapidly, because of the large amount of spray
          thrown into the air by the wind.
        </p>

        <p>
          The energy of the tropical cyclone is thus derived from the massive
          liberation of the latent heat of condensation. Tropical cyclone is
          defined as a non-frontal, synoptic-scale cyclone developing over
          tropical and sub-tropical waters at any level and having a definitely
          organized circulation.
        </p>
      </div>

      {/* Map and info sections */}
      <div className="two-column-section">
        <div className="map-column">
          <img src={CycloneImage} alt="Cyclone Map" className="cyclone-map" />

          <div className="regional-names">
            <h3>Regional Names</h3>
            <p>
              In different parts of the world, tropical cyclones are called
              different names based on their location.
            </p>
            <ul className="region-list">
              <li>
                <span className="region">
                  North Atlantic, Eastern North Pacific and South Pacific Ocean:
                </span>
                <span className="cyclone-type">Hurricanes</span>
              </li>
              <li>
                <span className="region">
                  Bay of Bengal, Arabian Sea and Western South Indian Ocean:
                </span>
                <span className="cyclone-type">Cyclones</span>
              </li>
              <li>
                <span className="region">
                  Eastern part of the Southern Indian Ocean:
                </span>
                <span className="cyclone-type">Willy-willy</span>
              </li>
              <li>
                <span className="region">Western North Pacific Ocean:</span>
                <span className="cyclone-type">Typhoons</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="impact-column">
          <div className="impact-box">
            <div className="warning-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="#f59e0b"
              >
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <h3 className="impact-title">Impact on the Philippines</h3>
            <p className="impact-text">
              The Philippines is prone to tropical cyclones due to its
              geographical location which generally produce heavy rains and
              flooding of large areas and also strong winds which result in
              heavy casualties to human life and destructions to crops and
              properties.
            </p>
          </div>

          <div className="categories-section">
            <h3>Cyclone Categories</h3>
            <ul className="category-list">
              <li className="category">
                <span className="category-dot super-typhoon"></span>
                <span>Super Typhoon</span>
              </li>
              <li className="category">
                <span className="category-dot typhoon"></span>
                <span>Typhoon</span>
              </li>
              <li className="category">
                <span className="category-dot severe-storm"></span>
                <span>Severe Tropical Storm</span>
              </li>
              <li className="category">
                <span className="category-dot storm"></span>
                <span>Tropical Storm</span>
              </li>
              <li className="category">
                <span className="category-dot depression"></span>
                <span>Tropical Depression</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTropicalCyclones;
