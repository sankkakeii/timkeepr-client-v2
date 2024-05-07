import React, { useEffect, useState } from "react";


const googleMapURL = `https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing,places&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`;

const MapApp = ({ func }) => {
    const [content, setContent] = useState("Getting position...");
    const [insideFence, setInsideFence] = useState(false);
    const [previousPolygon, setPreviousPolygon] = useState(null);
    const [fence, setFence] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);
    const [fenceCoords, setFenceCoords] = useState(null);
    const [center, setCenter] = useState(null);
    const [address, setAddress] = useState('');

    useEffect(() => {
        const watchID = navigator.geolocation.watchPosition(
            getLocation,
            console.error,
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 27000 }
        );
        return () => navigator.geolocation.clearWatch(watchID);
    }, []);


    const getFenceCoords = (polygon) => {
        const polygonBounds = polygon.getPath();
        const polygonCoordsList = [];
        polygonBounds.forEach((xy) => {
            polygonCoordsList.push([xy.lng(), xy.lat()]);
        });

        const jsonArray = JSON.stringify(polygonCoordsList);
        const parsedCoords = JSON.parse(jsonArray);
        setFenceCoords(parsedCoords);
        func(parsedCoords);
    }

    const getLocation = (position) => {
        const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
        setCenter(newCenter);
        setContent(`Location found.`);
        setLastFetched(position.timestamp);
        checkGeoFence(newCenter);
    }

    const checkGeoFence = (newCenter) => {
        if (!fence) {
            setInsideFence(false);
            return;
        }

        const currentPosition = new google.maps.LatLng(newCenter.lat, newCenter.lng);
        const insideFence = google.maps.geometry.poly.containsLocation(currentPosition, fence);
        setInsideFence(insideFence);
    }

    const doneDrawing = (polygon) => {
        if (previousPolygon) previousPolygon.setMap(null);
        setPreviousPolygon(polygon);

        const newFence = new google.maps.Polygon({
            paths: polygon.getPaths(),
            fenceCoords: getFenceCoords(polygon),
        });
        setFence(newFence);
        checkGeoFence(center);
    }

    return (
        <div className="MapApp">
            {lastFetched && (
                <div className="w-full h-fit">
                    <p>
                        Last fetched:{" "}
                        <Moment interval={10000} fromNow>
                            {lastFetched}
                        </Moment>
                    </p>
                    <MyComponent
                        googleMapURL={googleMapURL}
                        loadingElement={<p>Loading maps...</p>}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        doneDrawing={doneDrawing}
                        center={center}
                    />
                </div>
            )}
            {!lastFetched && <p>Getting location...</p>}
        </div>
    );
};

export default MapApp;
