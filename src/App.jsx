import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import routes_main from "./routes/routes_main";
import sub_routes_main from "./routes/sub_routes_main";

import { useState, useEffect } from "react";
import ScrollToTop from "./routes/ScrollTop";
import { HelmetProvider } from "react-helmet-async";

import TropicalCyclones from "./pages/AboutCyclone/TropicalCyclones";
import { Toaster } from "react-hot-toast";
import HeroSection from "./pages/Home/Components/HeroSection/HeroSection";
import TrackingSection_main from "./pages/Tracking/TrackingSection_main"

function App() {
  const [routes_, setRoutes_] = useState(routes_main());
  const [sub_routes_, setSub_routes_] = useState(sub_routes_main());
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  useEffect(() => {
    const checkVersion = async () => {
      console.log("checkVersion Executed");
      try {
        const response = await fetch("/version.json", { cache: "no-store" });
        const { version: latestVersion } = await response.json();

        const currentVersion = localStorage.getItem("appVersion");
        if (currentVersion !== latestVersion) {
          if ("caches" in window) {
            try {
              const cacheNames = await caches.keys();
              await Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
              );
              console.log("Caches cleared!");
            } catch (error) {
              console.error("Error clearing cache:", error);
            }
          }
          localStorage.setItem("appVersion", latestVersion);
          window.location.reload(); // Cleaned: no (true)
          console.log("Version Update");
        }
      } catch (error) {
        console.log("Error fetching version:", error);
      }
    };

    checkVersion();
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" reverseOrder={false} />
        <MainRoutes routes_={routes_} sub_routes_={sub_routes_} />
      </BrowserRouter>
    </HelmetProvider>
  );
}

function MainRoutes({ routes_, sub_routes_ }) {
  const location = useLocation();
  const isAssetRequest = location.pathname.startsWith("/images/");

  return (
    <Routes>
      {/* Main app routes */}
      {routes_.map((item, index) => (
        <Route key={index} path={item.path} element={item.element} />
      ))}

      {/* Sub routes */}
      {sub_routes_.map((item, index) => (
        <Route key={index} path={item.path} element={item.element} />
      ))}

      {/* Tropical Cyclones page */}
      <Route path="/tropical-cyclones" element={<TropicalCyclones />} />

      {/* Add these two lines here */}
      <Route path="/hero" element={<HeroSection />} />
      <Route path="/tracking" element={<TrackingSection_main />} />

      {/* Default route */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Catch-all */}
      {!isAssetRequest && <Route path="*" element={<Navigate to="/" />} />}
    </Routes>
  );
}


export default App;
