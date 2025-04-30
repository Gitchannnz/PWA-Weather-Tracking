import React from "react";
import CakeAndPastries_main from "../pages/AboutCyclone/TropicalCyclones";
import Home_main from "../pages/Home/Home_main";
import TrackingSection_main from "../pages/Tracking/TrackingSection_main";
import EvacuationMap_main from "../pages/Evacuation/EvacuationMap_main";
;


const routes_main = () => {
  return [
    {
      path: "/Home",
      element: <Home_main />,
      title: "Home",
    },
    {
      path: "/Cyclone Info",
      element: <CakeAndPastries_main />,
      title: "Cyclone Info",
    },
    {
      path: "/Tracking",
      element: <TrackingSection_main />,
      title: "Tracking",
    },
    {
      path: "/Evacuation",
      element: <EvacuationMap_main/>,
      title: "Evacuation",
    },
  ];
};

export default routes_main;
