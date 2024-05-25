import React, { useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { LIBRARIES } from "../utils/utils";

function Autocompletion() {
  const [autocomplete, setAutocomplete] = useState(null);
  const [place, setPlace] = useState();
  const librariez = LIBRARIES;
  
  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    setPlace({
      address: autocomplete.getPlace().formatted_address,
      lat: autocomplete.getPlace().geometry.location.lat(),
      lng: autocomplete.getPlace().geometry.location.lng(),
    });
  };

  return (
    <div className="flex flex-col items-center m-4">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
        libraries={librariez}
      >
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <div className="w-fit shadow-lg">
            <input
              type="text"
              placeholder="Search Google Map..."
              className="p-2 w-full text-lg bg-white text-gray-700 placeholder-gray-700 focus:bg-white focus:outline-none"
            />
          </div>
        </Autocomplete>
      </LoadScript>
      <h1 className="mt-4 text-lg">{JSON.stringify(place)}</h1>
    </div>
  );
}

export default Autocompletion;
