import React from "react";
import CakeAndPastries_main from "../pages/AboutCyclone/TropicalCyclones";
import Home_main from "../pages/Home/Home_main";
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
      element: <CakeAndPastries_main/>,
      title: "Cyclone Info",
    },
    {
      path: "/Tracking",
      element: <Home_main/>,
      title: "Tracking",
    },
  ];
};

export default routes_main;
