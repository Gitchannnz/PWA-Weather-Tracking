
import React, { useState, useEffect } from "react";
import { Phone, Info, Shield, FileText, AlertCircle } from "lucide-react";
import { FIRESTORE_DB } from "../../../firebase/firebaseutil_main";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore";

const TyphoonPreparedness = () => {
  const [typhoonAlerts, setTyphoonAlerts] = useState([]);
  const [evacuationCenters, setEvacuationCenters] = useState([]);
  const [emergencyProcedures, setEmergencyProcedures] = useState([]);
  const [selectedSignal, setSelectedSignal] = useState("1");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);




  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example Firestore query
        const contactsQuery = query(
          collection(FIRESTORE_DB, "emergencyContacts"),
          orderBy("createdAt", "desc")
        );
        const contactsSnapshot = await getDocs(contactsQuery);
        const contactsData = contactsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmergencyContacts(contactsData);
      } catch (error) {
        console.error("Error fetching emergency contacts:", error);
      }
    };
  
    fetchData(); // Call the async function
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Alerts
        const alertsQuery = query(
          collection(FIRESTORE_DB, "typhoonAlerts"),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const alertsSnapshot = await getDocs(alertsQuery);
        const alertsData = alertsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTyphoonAlerts(alertsData);
        if (alertsData.length > 0) {
          setLastUpdated(alertsData[0].timestamp.toDate());
        }

        // Evacuation Centers
        const centersQuery = query(
          collection(FIRESTORE_DB, "EvacuationCenters"),
          orderBy("name")
        );
        const centersSnapshot = await getDocs(centersQuery);
        const centersData = centersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvacuationCenters(centersData);
      } catch (error) {
        console.error("Error fetching typhoon/center data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        setLoading(true);
        const proceduresQuery = query(
          collection(FIRESTORE_DB, "emergencyProcedures"),
          where("disasterType", "==", "Typhoon"),
          where("typhoonSignal", "==", selectedSignal),
          where("userLocation", "==", "Coastal Area")
        );
        const proceduresSnapshot = await getDocs(proceduresQuery);
        const proceduresData = proceduresSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmergencyProcedures(proceduresData);
      } catch (error) {
        console.error("Error fetching emergency procedures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, [selectedSignal]);

  const renderChecklist = () => {
    if (!emergencyProcedures.length || !emergencyProcedures[0].checklist) {
      return <p>No checklist available</p>;
    }
    return (
      <ul className="checklist">
        {emergencyProcedures[0].checklist.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  const renderProcedures = () => {
    if (!emergencyProcedures.length || !emergencyProcedures[0].procedures) {
      return <p>No procedures available</p>;
    }
    return (
      <ol className="procedures">
        {emergencyProcedures[0].procedures.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    );
  };

  return (
    <div className="typhoon-container">
      <header className="typhoon-header">
        <h1>Typhoon Impact on the Philippines</h1>
        <p className="subtitle">
          The Philippines is prone to tropical cyclones due to its geographical
          location...
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

            <label htmlFor="signal-select">
              <strong>Select Typhoon Signal Level:</strong>{" "}
            </label>
            <select
              id="signal-select"
              value={selectedSignal}
              onChange={(e) => setSelectedSignal(e.target.value)}
              className="signal-select"
            >
              {[1, 2, 3, 4, 5].map((signal) => (
                <option key={signal} value={signal.toString()}>
                  Signal {signal}
                </option>
              ))}
            </select>

            <p className="procedure-context">
              <strong>For:</strong> Typhoon Signal {selectedSignal} in Coastal Area
            </p>
          </section>

          <div className="typhoon-content">
            <div className="typhoon-column">
              <div className="info-card">
                <div className="info-header">
                  <Shield size={24} className="info-icon" />
                  <h3>Emergency Kit Checklist</h3>
                </div>
                {renderChecklist()}
              </div>
            </div>

            <div className="typhoon-column">
              <div className="info-card">
                <div className="info-header">
                  <FileText size={24} className="info-icon" />
                  <h3>Recommended Procedures</h3>
                </div>
                {renderProcedures()}
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
                    <p className="center-capacity">
                      Capacity: {center.currentOccupancy || 0}/{center.capacity}{" "}
                      people
                      <span className={`status-badge ${center.capacityStatus}`}>
                        {center.capacityStatus?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </p>
                    {center.contactNumber && (
                      <p className="center-contact">
                        Contact: {center.contactNumber}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="typhoon-section red-section">
            <h2>Emergency Contacts</h2>
            <p className="contact-note">
              Keep these important contact numbers handy during emergencies.
            </p>
          </section>

          <div className="emergency-contacts">
  {emergencyContacts.map((contact) => (
    <div key={contact.id} className="contact-card" style={{color: "#d63333", textDecoration: "underline",}}>
      <h3>{contact.name}</h3>
      <p><strong>Type:</strong> {contact.type}</p>
      <p><strong>Description:</strong> {contact.description}</p>
      <p><strong>Location:</strong> {contact.location}</p>
      <p><strong>Phone:</strong> <a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
      {contact.link && (
        <p>
          <strong>Link:</strong>{" "}
          <a href={contact.link} target="_blank" rel="noopener noreferrer">
            {contact.link}
          </a>
        </p>
      )}
    </div>
  ))}
</div>

        </>
      )}

      <footer className="typhoon-footer">
        <p className="important-note">
          <strong>Important:</strong> In case of imminent danger to
          life-threatening emergencies, always call 911.
        </p>
      </footer>
    </div>
  );
};

export default TyphoonPreparedness;
