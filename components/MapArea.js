import React, { useState } from "react";
import Mapper from "./Mapper";
import Autocompletor from "./Autocompletor";



function MapArea({ coordinates, setCoordinates }) {
  return (
    <>
    <Autocompletor></Autocompletor>
    <Mapper></Mapper>
    </>
  );
}

export default MapArea;
