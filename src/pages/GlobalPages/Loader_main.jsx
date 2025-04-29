import React from "react";
import { Spinner } from "react-bootstrap";
import logo from "../../assets/Header Image.png";

function Loader_main({ label }) {
  return (
    // <div style={{marginTop:"80px",marginBottom:"200px"}} className="row">
    //   <div className="d-flex justify-content-center">
    //     <img style={{ minwidth: "10%",width:"20%",maxWidth:"40%" }} src={logo} />
    //   </div>
    //   <div className="d-flex justify-content-center">
    //     <h4> LOADING {label} ...</h4>
    //   </div>
    //   <div className="d-flex justify-content-center">
    //     <Spinner variant="success" animation="grow" />
    //   </div>
    // </div>

    // <div className="d-flex align-items-center">
    //   {/* <div className="skeleton skeleton-avatar me-3"></div> */}
    //   <div className="flex-grow-1">
    //     {/* <div className="skeleton skeleton-text w-50 mb-2"></div> */}
    //     {/* <div className="skeleton skeleton-text w-75"></div> */}
    //   </div>
    // </div>

    <div className="container mb-4 mt-4">
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 mb-2">
          <div className="skeleton skeleton-image mt-3 "></div>
        </div>
        {/* <div className="col-lg-4 col-md-12 col-sm-12">
          <div
            style={{
              // borderStyle: "solid",
              // borderLeftWidth: 1,
              borderRightWidth: 0,
              borderBottom: 0,
              borderTop: 0,
            }}
            className=" ps-4"
          >
            <div className="skeleton skeleton-image-slide mt-2 "></div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Loader_main;
