import React, { useState, useEffect } from "react";
import { Phone, Info, Shield, FileText, AlertCircle, Book } from "lucide-react";
import { FIRESTORE_DB } from "../../../firebase/firebaseutil_main";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const TyphoonPreparedness = () => {
  const [typhoonAlerts, setTyphoonAlerts] = useState([]);
  const [evacuationCenters, setEvacuationCenters] = useState([]);
  const [preparednessSections, setPreparednessSections] = useState({
    stayInformed: [],
    emergencyKit: [],
    secureHome: [],
    prepareEvacuation: [],
    finalPreparations: [],
  });
  const [emergencyProcedures, setEmergencyProcedures] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]); // NEW STATE
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchTyphoonData = async () => {
      try {
        // Fetch latest typhoon alerts
        const alertsQuery = query(
          collection(FIRESTORE_DB, "typhoonAlerts"),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const alertsSnapshot = await getDocs(alertsQuery);
        const alertsData = [];
        alertsSnapshot.forEach((doc) => {
          alertsData.push({ id: doc.id, ...doc.data() });
        });
        setTyphoonAlerts(alertsData);

        // Fetch evacuation centers
        const centersQuery = query(
          collection(FIRESTORE_DB, "evacuationCenters"),
          orderBy("region")
        );
        const centersSnapshot = await getDocs(centersQuery);
        const centersData = [];
        centersSnapshot.forEach((doc) => {
          centersData.push({ id: doc.id, ...doc.data() });
        });
        setEvacuationCenters(centersData);

        // Fetch preparedness information sections
        const sections = [
          { name: "stayInformed", collection: "preparednessStayInformed" },
          { name: "emergencyKit", collection: "preparednessEmergencyKit" },
          { name: "secureHome", collection: "preparednessSecureHome" },
          { name: "prepareEvacuation", collection: "preparednessEvacuation" },
          { name: "finalPreparations", collection: "preparednessFinalPrep" },
        ];

        const prepData = { ...preparednessSections };

        for (const section of sections) {
          const sectionQuery = query(
            collection(FIRESTORE_DB, section.collection)
          );
          const sectionSnapshot = await getDocs(sectionQuery);
          const sectionData = [];
          sectionSnapshot.forEach((doc) => {
            sectionData.push({ id: doc.id, ...doc.data() });
          });
          prepData[section.name] = sectionData;
        }
        setPreparednessSections(prepData);

        // Fetch emergency procedures
        const proceduresQuery = query(
          collection(FIRESTORE_DB, "emergencyProcedures")
        );
        const proceduresSnapshot = await getDocs(proceduresQuery);
        const proceduresData = [];
        proceduresSnapshot.forEach((doc) => {
          proceduresData.push({ id: doc.id, ...doc.data() });
        });
        setEmergencyProcedures(proceduresData);

        // Fetch emergency contacts
        const contactsQuery = query(
          collection(FIRESTORE_DB, "emergencyContacts")
        );
        const contactsSnapshot = await getDocs(contactsQuery);
        const contactsData = [];
        contactsSnapshot.forEach((doc) => {
          contactsData.push({ id: doc.id, ...doc.data() });
        });
        setEmergencyContacts(contactsData);

        // Set last updated timestamp
        if (alertsData.length > 0) {
          setLastUpdated(alertsData[0].timestamp.toDate());
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchTyphoonData();
    // eslint-disable-next-line
  }, []);

  // Helper function to render preparedness items from Firebase
  const renderPreparednessItems = (items) => {
    if (!items || items.length === 0) return null;
    return (
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    );
  };

  // Helper function to render array or string fields
  const renderListOrString = (field) => {
    if (!field) return null;
    if (Array.isArray(field)) {
      return (
        <ul>
          {field.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }
    return <p>{field}</p>;
  };

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
        {lastUpdated && (
          <p className="update-timestamp">
            Last Updated: {lastUpdated.toLocaleDateString()}{" "}
            {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </header>

      {loading ? (
        <div className="loading-container">
          <p>Loading typhoon preparedness information...</p>
        </div>
      ) : (
        <>
          {typhoonAlerts.length > 0 && (
            <section className="typhoon-section yellow-section">
              <h2>Current Weather Alerts</h2>
              <div className="alerts-container">
                {typhoonAlerts.map((alert) => (
                  <div key={alert.id} className="alert-card">
                    <h3>{alert.title}</h3>
                    <p>{alert.description}</p>
                    <p className="alert-timestamp">
                      Issued: {alert.timestamp.toDate().toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

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
                {renderPreparednessItems(preparednessSections.stayInformed)}
              </div>

              <div className="info-card">
                <div className="info-header">
                  <Shield size={24} className="info-icon" />
                  <h3>Emergency Kit</h3>
                </div>
                {renderPreparednessItems(preparednessSections.emergencyKit)}
              </div>
            </div>

            <div className="typhoon-column">
              <div className="info-card">
                <div className="info-header">
                  <Book size={24} className="info-icon" />
                  <h3>Secure Your Home</h3>
                </div>
                {renderPreparednessItems(preparednessSections.secureHome)}
              </div>

              <div className="info-card">
                <div className="info-header">
                  <AlertCircle size={24} className="info-icon" />
                  <h3>Prepare for Evacuation</h3>
                </div>
                {renderPreparednessItems(
                  preparednessSections.prepareEvacuation
                )}
              </div>

              <div className="info-card">
                <div className="info-header">
                  <FileText size={24} className="info-icon" />
                  <h3>Final Preparations</h3>
                </div>
                {renderPreparednessItems(
                  preparednessSections.finalPreparations
                )}
              </div>
            </div>
          </div>

          {evacuationCenters.length > 0 && (
            <section className="typhoon-section green-section">
              <h2>Evacuation Centers</h2>
              <div className="evacuation-centers">
                {evacuationCenters.map((center) => (
                  <div key={center.id} className="evacuation-card">
                    <h3>{center.name}</h3>
                    <p className="center-location">{center.address}</p>
                    <p className="center-region">Region: {center.region}</p>
                    <p className="center-capacity">
                      Capacity: {center.capacity} people
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EMERGENCY PROCEDURES SECTION */}
          {emergencyProcedures.length > 0 && (
            <section className="typhoon-section orange-section">
              <h2>Emergency Procedures</h2>
              <div className="emergency-procedures-list">
                {emergencyProcedures.map((proc) => (
                  <div key={proc.id} className="procedure-card">
                    <h3>
                      {proc.disasterType} (Signal {proc.typhoonSignal})
                    </h3>
                    <p>
                      <strong>Location:</strong> {proc.userLocation}
                    </p>
                    <p>
                      <strong>Procedures:</strong>
                    </p>
                    {renderListOrString(proc.procedures)}
                    <p>
                      <strong>Checklist:</strong>
                    </p>
                    {renderListOrString(proc.checklist)}
                    <p className="procedure-updated">
                      Last Updated:{" "}
                      {proc.lastUpdated && proc.lastUpdated.toDate
                        ? proc.lastUpdated.toDate().toLocaleString()
                        : String(proc.lastUpdated)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EMERGENCY CONTACTS SECTION */}
          <section className="typhoon-section red-section">
            <h2>Emergency Contacts</h2>
            <p className="contact-note">
              Keep these important contact numbers handy during emergencies.
            </p>
            <div className="emergency-contacts">
              {emergencyContacts.length > 0 ? (
                emergencyContacts.map((contact) => (
                  <div key={contact.id} className="contact-card">
                    <div className="contact-header">
                      <div
                        className={`contact-icon-wrapper ${
                          contact.iconColor || "blue-bg"
                        }`}
                      >
                        {/* Use icon based on iconColor or contact.type if desired */}
                        <Info size={24} className="contact-icon" />
                      </div>
                      <h3>{contact.name}</h3>
                      <p>{contact.description}</p>
                    </div>
                    <div className="contact-number">
                      <Phone size={18} />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="social-links">
                      {contact.website && (
                        <a
                          href={contact.website}
                          className="social-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Official Website
                        </a>
                      )}
                      {contact.facebook && (
                        <a
                          href={contact.facebook}
                          className="social-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Facebook Page
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No emergency contacts available at the moment.</p>
              )}
            </div>
          </section>
        </>
      )}

      <footer className="typhoon-footer">
        <p className="important-note">
          <strong>Important:</strong> In case of imminent danger to life or
          life-threatening emergencies, always call 911. Keep these numbers
          saved in your phone and written down in an easily accessible place.
        </p>
      </footer>
    </div>
  );
};

export default TyphoonPreparedness;
