import React from "react";
import under_logo from "../assets/UnderConstruction.gif";
function UnderConstruction_main() {
  return (
    <div style={{ height: "50vh" }} className="container mt-4 pt-4 pb-4  mb-4">
      <div className="d-flex justify-content-center">
        <img style={{ width: 250 }} src={under_logo}></img>
       
      </div>
      <p className="display-2 text-center">
          The page is under development.
        </p>
    </div>
  );
}

export default UnderConstruction_main;
