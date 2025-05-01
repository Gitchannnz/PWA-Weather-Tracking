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
import NavBar from "../../navigations/NavBar/Navigation_main";
import Footer from "../../navigations/Footer/Footer_main";
import TyphoonPreparedness from "../AboutCyclone/Preparedness/TyphoonPreparedness";

import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/firebaseutil_main";

// Evacuation centers data
const defaultCenters = [
  {
    id: 1,
    name: "Manolo Fortich Central School",
    location: "Poblacion",
    coordinates: [8.3678, 124.8649],
    capacity: 350,
    facilities: ["Water Supply", "Toilet", "Kitchen", "Medical Aid"],
  },
  {
    id: 2,
    name: "Dalirig National High School",
    location: "Dalirig",
    coordinates: [8.4062, 124.7964],
    capacity: 280,
    facilities: ["Water Supply", "Toilet", "Sleeping Area"],
  },
  {
    id: 3,
    name: "Tankulan Covered Court",
    location: "Tankulan",
    coordinates: [8.3643, 124.8577],
    capacity: 200,
    facilities: ["Water Supply", "Toilet"],
  },
  {
    id: 4,
    name: "Sto. Niño Elementary School",
    location: "Sto. Niño",
    coordinates: [8.3728, 124.8749],
    capacity: 180,
    facilities: ["Water Supply", "Toilet", "Medical Aid"],
  },
  {
    id: 5,
    name: "Agusan Canyon Integrated School",
    location: "Agusan Canyon",
    coordinates: [8.3978, 124.8549],
    capacity: 220,
    facilities: ["Water Supply", "Toilet", "Kitchen"],
  },
  {
    id: 6,
    name: "Alae Elementary School",
    location: "Alae",
    coordinates: [8.4078, 124.8849],
    capacity: 240,
    facilities: ["Water Supply", "Toilet", "Kitchen", "Medical Aid"],
  },
  {
    id: 7,
    name: "Dahilayan Community Center",
    location: "Dahilayan",
    coordinates: [8.3578, 124.9049],
    capacity: 190,
    facilities: ["Water Supply", "Toilet", "Sleeping Area"],
  },
  {
    id: 8,
    name: "Sankanan Elementary School",
    location: "Sankanan",
    coordinates: [8.3558, 124.8249],
    capacity: 165,
    facilities: ["Water Supply", "Toilet"],
  },
  {
    id: 9,
    name: "Guilang-guilang Covered Court",
    location: "Guilang-guilang",
    coordinates: [8.3778, 124.8949],
    capacity: 210,
    facilities: ["Water Supply", "Toilet", "Medical Aid"],
  },
  {
    id: 10,
    name: "San Miguel Barangay Hall",
    location: "San Miguel",
    coordinates: [8.3878, 124.8349],
    capacity: 150,
    facilities: ["Water Supply", "Toilet"],
  },
  {
    id: 11,
    name: "Mambatangan Elementary School",
    location: "Mambatangan",
    coordinates: [8.4078, 124.8249],
    capacity: 175,
    facilities: ["Water Supply", "Toilet", "Kitchen"],
  },
  {
    id: 12,
    name: "Lingion Community Hall",
    location: "Lingion",
    coordinates: [8.4178, 124.8449],
    capacity: 130,
    facilities: ["Water Supply", "Toilet"],
  },
  {
    id: 13,
    name: "Maluko Elementary School",
    location: "Maluko",
    coordinates: [8.3778, 124.8149],
    capacity: 190,
    facilities: ["Water Supply", "Toilet", "Medical Aid"],
  },
  {
    id: 14,
    name: "Santiago Covered Court",
    location: "Santiago",
    coordinates: [8.3578, 124.8749],
    facilities: ["Water Supply", "Toilet"],
  },
  {
    id: 15,
    name: "Dicklum Elementary School",
    location: "Dicklum",
    coordinates: [8.4278, 124.8749],
    capacity: 160,
    facilities: ["Water Supply", "Toilet", "Kitchen"],
  },
  {
    id: 16,
    name: "Damilag Sports Complex",
    location: "Damilag",
    coordinates: [8.4078, 124.9049],
    capacity: 300,
    facilities: [
      "Water Supply",
      "Toilet",
      "Kitchen",
      "Medical Aid",
      "Sleeping Area",
    ],
  },
  {
    id: 17,
    name: "San Roque Parish Multipurpose Hall",
    location: "San Roque",
    coordinates: [8.3678, 124.8849],
    capacity: 220,
    facilities: ["Water Supply", "Toilet", "Medical Aid"],
  },
  {
    id: 18,
    name: "Mantibugao Community Center",
    location: "Mantibugao",
    coordinates: [8.3478, 124.8149],
    capacity: 170,
    facilities: ["Water Supply", "Toilet"],
  },
  {
    id: 19,
    name: "Tikala Elementary School",
    location: "Tikala",
    coordinates: [8.3878, 124.9149],
    capacity: 200,
    facilities: ["Water Supply", "Toilet", "Kitchen"],
  },
  {
    id: 20,
    name: "Kalugmanan Multi-Purpose Building",
    location: "Kalugmanan",
    coordinates: [8.4178, 124.8049],
    capacity: 250,
    facilities: ["Water Supply", "Toilet", "Kitchen", "Medical Aid"],
  },
];

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
  const mapCenter = [8.3678, 124.8649];
  const zoomLevel = 12;

  const [mapInstance, setMapInstance] = useState(null);
  const [activeCenter, setActiveCenter] = useState(null);
  const [evacuationCenters, setEvacuationCenters] = useState(defaultCenters); // Initialize with default centers
  const [loading, setLoading] = useState(true);

  // Real-time Firestore listener with initial seeding
  useEffect(() => {
    const centersRef = collection(FIREBASE_DB, "EvacuationCenters");

    // Check if Firestore collection exists and seed if empty
    const checkAndSeed = async () => {
      try {
        const snapshot = await getDocs(centersRef);

        // If empty, seed with default data
        if (snapshot.empty) {
          console.log("Seeding evacuation centers database...");
          const seedPromises = defaultCenters.map((center) =>
            setDoc(doc(centersRef, center.id.toString()), center)
          );
          await Promise.all(seedPromises);
          console.log("Database seeded successfully");
        } else {
          console.log("Evacuation centers already exist in database");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error checking/seeding database:", error);
        setLoading(false);
      }
    };

    checkAndSeed();

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      centersRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (data.length > 0) {
          setEvacuationCenters(data);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to evacuation centers:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const handleMarkerClick = (center) => {
    setActiveCenter(center === activeCenter ? null : center);
    if (mapInstance && center) {
      mapInstance.flyTo(center.coordinates, 14, {
        duration: 1.5,
      });
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
          {loading && <p>Loading evacuation centers...</p>}
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

          {evacuationCenters.map((center, index) => (
            <Marker
              key={center.id}
              position={center.coordinates}
              icon={createCustomIcon(index + 1, center.id === activeCenter?.id)}
              eventHandlers={{
                click: () => handleMarkerClick(center),
              }}
            >
              <Popup className="evacuation-popup">
                <div className="popup-content">
                  <h3>{center.name}</h3>
                  <div className="info-row">
                    <span className="icon">📍</span>
                    <span>{center.location}, Manolo Fortich</span>
                  </div>
                  {center.capacity && (
                    <div className="info-row">
                      <span className="icon">👥</span>
                      <span>Capacity: {center.capacity} people</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="icon">ℹ️</span>
                    <div className="facilities-list">
                      <span className="label">Facilities:</span>
                      <p>{center.facilities?.join(", ")}</p>
                    </div>
                  </div>
                  <button className="directions-button">Get Directions</button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <TyphoonPreparedness />
      </div>
      <Footer />
    </>
  );
};

export default EvacuationMap;
