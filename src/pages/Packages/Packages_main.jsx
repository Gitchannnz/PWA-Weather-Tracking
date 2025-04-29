import React from "react";
import Navigation_main from "../../navigations/NavBar/Navigation_main";
import Footer_main from "../../navigations/Footer/Footer_main";
import PackagesSection_main from "./PackagesSection/PackagesSection_main";


const Packages_main = () => {
  return (
    <>
      <Navigation_main />

      {/* Hero Section */}
      <div
        style={{
          backgroundColor: "#b24b00",
          padding: "40px 20px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1
          style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "2rem" }}
        >
          Our Products
        </h1>
        <p
          style={{
            fontStyle: "italic",
            fontSize: "0.9rem",
            color: "white",
            opacity: 0.85,
          }}
        >
          “‘Discover our delicious selection of handcrafted cakes and pastries’”
        </p>
      </div>
      <PackagesSection_main/>


      <Footer_main />
    </>
  );
};

export default Packages_main;
