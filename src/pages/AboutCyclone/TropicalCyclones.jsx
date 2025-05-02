import React from "react";
import Navigation from "../../navigations/NavBar/Navigation_main";
import Footer from "../../navigations/Footer/Footer_main"; 
import CycloneImage from "../../assets/Cyclone.png"
import TyphoonPreparedness from "./Preparedness/EmergencyContact/TyphoonPreparedness";


const TropicalCyclones = () => {
  return (
    <>
      <Navigation />
      <div className="tropical-cyclones-container">
        <div className="about-section">
          <h2>About Tropical Cyclones</h2>

          <div className="info-card">
            <div className="question-section">
              <span className="icon question-icon">❓</span>
              <h3>What are Tropical Cyclones?</h3>
            </div>

            <p>
              Oceans and seas have great influence on the weather of continental
              masses. A large portion of the solar energy reaching the
              sea-surface is expended in the process of evaporation. These water
              vapors condense when they are carried up into the atmosphere,
              forming clouds from which all forms of precipitation result.
            </p>

            <p>
              Tropical cyclones are warm-core low pressure systems associated
              with a spiral inflow of mass at the bottom level and spiral
              outflow at the top level. They always form over oceans where sea
              surface temperature and air temperatures are greater than 26°C.
            </p>

            <p>
              The air accumulates large amounts of sensible and latent heat as
              it spirals towards the center. It receives this heat from the sea
              and the exchange can occur rapidly, because of the large amount of
              spray thrown into the air by the wind. The energy of the tropical
              cyclone is thus derived from the massive liberation of the latent
              heat of condensation.
            </p>

            <div className="definition-box">
              <p>
                Tropical cyclone is defined as a non-frontal, synoptic-scale
                cyclone developing over tropical and sub-tropical waters at any
                level and having a definitely organized circulation.
              </p>
            </div>

            <div className="cyclone-image">
              <img
                src={CycloneImage}
                alt="Satellite image of a tropical cyclone"
              />
            </div>
          </div>

          <div className="info-columns">
            <div className="info-column">
              <div className="column-header">
                <span className="icon region-icon">🌎</span>
                <h3>Regional Names</h3>
              </div>

              <p>
                In different parts of the world, these are referred to as
                hurricanes, typhoons or simply tropical cyclones depending on
                the region of formation.
              </p>

              <div className="region-list">
                <div className="region-item hurricanes">
                  <span className="region-label">Hurricanes</span>
                  <span className="region-area">
                    North Atlantic, Eastern North Pacific and South Pacific
                    Ocean
                  </span>
                </div>

                <div className="region-item cyclones">
                  <span className="region-label">Cyclones</span>
                  <span className="region-area">
                    Bay of Bengal, Arabian Sea and Western South Indian Ocean
                  </span>
                </div>

                <div className="region-item willy-willy">
                  <span className="region-label">Willy-willy</span>
                  <span className="region-area">
                    Eastern part of the Southern Indian Ocean
                  </span>
                </div>

                <div className="region-item typhoons">
                  <span className="region-label">Typhoons</span>
                  <span className="region-area">
                    Western North Pacific Ocean
                  </span>
                </div>
              </div>
            </div>

            <div className="info-column">
              <div className="column-header">
                <span className="icon formation-icon">📊</span>
                <h3>Formation Conditions</h3>
              </div>

              <p>
                Tropical cyclones can only form over oceans of the world except
                in the South Atlantic Ocean and the south eastern Pacific, where
                a tropical cyclone can never be formed due to the cooler sea
                surface temperature and higher vertical wind shears.
              </p>

              <p>
                They develop at latitudes usually greater than 5° from the
                equator. They reach their greatest intensity while located over
                warm tropical water. As soon as they move inland, they begin to
                weaken, but often not before they have caused great destruction.
              </p>
            </div>
          </div>
        </div>
      </div>
      <TyphoonPreparedness/>
      <Footer />
    </>
  );
};

export default TropicalCyclones;
