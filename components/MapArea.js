import React, { useState } from "react";
import Mapper from "./Mapper";
import Autocompletion from "./Autocompletion";



function MapArea({ coordinates, setCoordinates }) {
  return (
    <>
    {/* <Autocompletion></Autocompletion> */}
    <Mapper></Mapper>
    </>
  );
}

export default MapArea;
