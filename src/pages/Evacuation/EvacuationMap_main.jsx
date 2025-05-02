import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { collection, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/firebaseutil_main";
import NavBar from "../../navigations/NavBar/Navigation_main";
import Footer from "../../navigations/Footer/Footer_main";
import TyphoonPreparedness from "../AboutCyclone/Preparedness/TyphoonPreparedness";
import { Badge, Spinner } from "react-bootstrap";

const createCustomIcon = (number, isActive = false) => {
  return L.divIcon({
    className: `custom-marker ${isActive ? "active" : ""}`,
    html: `<div class="marker-container">
           <div class="marker-circle">${number}</div>
           <div class="marker-pointer"></div>
         </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const EvacuationMap = () => {
  const mapCenter = [8.3678, 124.8649]; // Default center for Manolo Fortich
  const zoomLevel = 12;

  const [mapInstance, setMapInstance] = useState(null);
  const [activeCenter, setActiveCenter] = useState(null);
  const [evacuationCenters, setEvacuationCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const centersRef = collection(FIREBASE_DB, "EvacuationCenters");

    const unsubscribe = onSnapshot(
      centersRef,
      (snapshot) => {
        try {
          const centersData = snapshot.docs.map((doc, index) => {
            const data = doc.data();
            return {
              id: doc.id,
              number: index + 1,
              name: data.name,
              location: data.address,
              coordinates: data.geoLocation 
                ? [data.geoLocation.lat, data.geoLocation.lng] 
                : [0, 0],
              capacity: data.capacity || 0,
              currentOccupancy: data.currentOccupancy || 0,
              facilities: data.facilities || [],
              capacityStatus: data.capacityStatus || "unknown",
              contactNumber: data.contactNumber || "",
              description: data.description || ""
            };
          });
          setEvacuationCenters(centersData);
          setLoading(false);
        } catch (err) {
          setError("Failed to process evacuation center data");
          setLoading(false);
          console.error("Data processing error:", err);
        }
      },
      (error) => {
        setError("Failed to load evacuation centers. Please try again later.");
        setLoading(false);
        console.error("Firestore error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleMarkerClick = (center) => {
    setActiveCenter(center === activeCenter ? null : center);
    if (mapInstance && center) {
      mapInstance.flyTo(center.coordinates, 14, {
        duration: 1.5,
      });
    }
  };

  const getCapacityStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'full': return 'danger';
      case 'limited': return 'warning';
      case 'available': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <>
      <div className="evacuation-map-container">
        <NavBar />
        <div className="map-header">
          <h1>
            <span className="alert-icon">⚠️</span>
            Manolo Fortich Evacuation Centers
          </h1>
          <p>Click on markers to view evacuation center details</p>
          {loading && <Spinner animation="border" size="sm" className="me-2" />}
          {error && (
            <Alert variant="danger" className="mt-2">
              {error}
            </Alert>
          )}
        </div>

        <MapContainer
          center={mapCenter}
          zoom={zoomLevel}
          zoomControl={false}
          className="leaflet-container"
          whenCreated={setMapInstance}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />

          {evacuationCenters.map((center) => (
            <Marker
              key={center.id}
              position={center.coordinates}
              icon={createCustomIcon(center.number, center.id === activeCenter?.id)}
              eventHandlers={{
                click: () => handleMarkerClick(center),
              }}
            >
              <Popup className="evacuation-popup">
                <div className="popup-content">
                  <h3>{center.name}</h3>
                  <div className="info-row">
                    <span className="icon">📍</span>
                    <span>{center.location || "Location not specified"}</span>
                  </div>
                  <div className="info-row">
                    <span className="icon">👥</span>
                    <span>
                      Occupancy: {center.currentOccupancy}/{center.capacity}
                      <Badge 
                        bg={getCapacityStatusVariant(center.capacityStatus)} 
                        className="ms-2"
                      >
                        {center.capacityStatus.toUpperCase()}
                      </Badge>
                    </span>
                  </div>
                  {center.contactNumber && (
                    <div className="info-row">
                      <span className="icon">📞</span>
                      <a href={`tel:${center.contactNumber}`}>{center.contactNumber}</a>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="icon">ℹ️</span>
                    <div className="facilities-list">
                      <span className="label">Facilities:</span>
                      {center.facilities.length > 0 ? (
                        <ul>
                          {center.facilities.map((facility, i) => (
                            <li key={i}>{facility}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No facilities listed</p>
                      )}
                    </div>
                  </div>
                  {center.description && (
                    <div className="info-row">
                      <span className="icon">📝</span>
                      <p>{center.description}</p>
                    </div>
                  )}
                  <button 
                    className="directions-button"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${center.coordinates[0]},${center.coordinates[1]}`
                      );
                    }}
                  >
                    Get Directions
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <TyphoonPreparedness />
      </div>
      <Footer />

      <style jsx>{`
        .evacuation-map-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        
        .map-header {
          text-align: center;
          padding: 20px;
          background-color: #f8f9fa;
        }
        
        .map-header h1 {
          margin-bottom: 10px;
        }
        
        .leaflet-container {
          height: 60vh;
          width: 100%;
          z-index: 1;
        }
        
        .evacuation-popup {
          min-width: 250px;
        }
        
        .popup-content {
          padding: 10px;
        }
        
        .popup-content h3 {
          margin-top: 0;
          color: #0d6efd;
        }
        
        .info-row {
          display: flex;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        
        .icon {
          margin-right: 8px;
          font-size: 16px;
        }
        
        .facilities-list {
          flex: 1;
        }
        
        .facilities-list ul {
          padding-left: 20px;
          margin: 5px 0;
        }
        
        .directions-button {
          width: 100%;
          padding: 8px;
          margin-top: 10px;
          background-color: #0d6efd;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .directions-button:hover {
          background-color: #0b5ed7;
        }
        
        .custom-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .marker-container {
          position: relative;
          text-align: center;
        }
        
        .marker-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #0d6efd;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        
        .marker-pointer {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 10px solid #0d6efd;
          margin-top: -2px;
        }
        
        .custom-marker.active .marker-circle {
          background-color: #dc3545;
        }
        
        .custom-marker.active .marker-pointer {
          border-top-color: #dc3545;
        }
      `}</style>
    </>
  );
};

export default EvacuationMap;