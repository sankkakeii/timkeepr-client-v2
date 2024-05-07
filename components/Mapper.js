import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import axios from "axios";
import { LIBRARIES } from "../utils/utils";
import Cookies from 'js-cookie';

function Mapper() {
  const [center, setCenter] = useState(null);
  const [radius, setRadius] = useState(50);
  const [timeValue, setTimeValue] = useState('00:00');
  const [newOrganizationLocation, setNewOrganizationLocation] = useState([]);

  useEffect(() => {
    let watcher = null;

    if (navigator && navigator.geolocation) {
      watcher = navigator.geolocation.watchPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setNewOrganizationLocation([position.coords.latitude, position.coords.longitude]);
      });
    }

    // Clean up function
    return () => {
      if (watcher) {
        navigator.geolocation.clearWatch(watcher);
      }
    };
  }, []);


  const sendDataToApi = async () => {
    const url = "api/client/add-location";
    console.log(newOrganizationLocation)
    const data = {
      organizationLocation: newOrganizationLocation,
      // clockInTime: timeValue + ':00',
      clockInTime: timeValue,
      radius: radius,
      companyId: ''
    };

    // Get the token from the cookie
    const token = Cookies.get('token');

    console.log(token)
    console.log(data)

    try {
      // Pass the token in the Authorization header
      await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        console.log(error);
      }
    }
  };


  const handleRadiusChange = (event) => {
    setRadius(Number(event.target.value));
  };

  const handleTimeChange = (value) => {
    setTimeValue(value);
  };

  if (!center) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
        libraries={LIBRARIES}
      >
        <div className="slider-container flex flex-col items-center space-y-2">
          <input
            type="range"
            min="10"
            max="1000"
            value={radius}
            onChange={handleRadiusChange}
            className="slider w-full h-1 bg-gray-200 rounded-full outline-none transition-colors duration-200 ease-in-out hover:bg-blue-400 active:bg-blue-500 focus:bg-blue-500"
          />

          <div className="text-sm">Radius: {radius} meters</div>

          <TimePicker
            onChange={handleTimeChange}
            value={timeValue}
          />
          <button onClick={sendDataToApi} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
        </div>
        <GoogleMap mapContainerStyle={{ width: "400px", height: "220px" }} center={center} zoom={18} className="rounded">
          <Marker position={center} />
          <Circle
            center={center}
            options={{
              strokeColor: "#00FF00",
              strokeOpacity: 0.8,
              strokeWeight: 1.5,
              fillColor: " #00FF00",
              fillOpacity: 0.35,
              clickable: true,
              draggable: true,
              editable: false,
              visible: true,
              zIndex: 1,
              radius: radius
            }}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Mapper;
