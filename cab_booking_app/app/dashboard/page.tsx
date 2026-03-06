"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function Dashboard() {

  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");

  const [pickup,setPickup] = useState("");
  const [drop,setDrop] = useState("");
  const [rideType,setRideType] = useState("economy");

  const [pickupMarker,setPickupMarker] = useState<any>(null);
  const [dropMarker,setDropMarker] = useState<any>(null);

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 25.5941,
    lng: 85.1376,
  };

  useEffect(()=>{

    async function getProfile(){

      const res = await fetch("/api/users/profile");
      const data = await res.json();

      setName(data?.name || "");
      setPhone(data?.phone || "");

    }

    getProfile();

  },[]);


  async function updateProfile(){

    await fetch("/api/users/update",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name,phone})
    });

    alert("Profile updated successfully 🚕");

  }


  async function requestRide(){

    await fetch("/api/rides/create",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        pickup,
        drop,
        ride_type:rideType
      })
    });

    alert("Ride requested successfully 🚖");

  }


  function handleMapClick(event:any){

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    if(!pickupMarker){

      setPickupMarker({lat,lng});
      setPickup(`Lat:${lat}, Lng:${lng}`);

    }else{

      setDropMarker({lat,lng});
      setDrop(`Lat:${lat}, Lng:${lng}`);

    }

  }


  return (

    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="flex justify-between items-center bg-white p-4 shadow">
        <h1 className="text-xl font-bold">Cab Booking Dashboard</h1>
        <UserButton />
      </div>


      {/* Profile Card */}
      <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow">

        <h2 className="text-xl font-semibold mb-4">
          Update Profile
        </h2>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-4 rounded"
          placeholder="Phone"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
        />

        <button
          onClick={updateProfile}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Save Profile
        </button>

      </div>



      {/* Ride Request Section */}
      <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow">

        <h2 className="text-xl font-semibold mb-4">
          Book a Ride
        </h2>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Pickup location"
          value={pickup}
          onChange={(e)=>setPickup(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Drop location"
          value={drop}
          onChange={(e)=>setDrop(e.target.value)}
        />

        <select
          className="border p-2 w-full mb-4 rounded"
          value={rideType}
          onChange={(e)=>setRideType(e.target.value)}
        >
          <option value="economy">Economy</option>
          <option value="premium">Premium</option>
          <option value="suv">SUV</option>
        </select>

        <button
          onClick={requestRide}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Request Ride
        </button>

      </div>



      {/* Google Map */}
      <div className="max-w-4xl mx-auto mt-10 mb-10 bg-white p-6 rounded-lg shadow">

        <h2 className="text-xl font-semibold mb-4">
          Select Pickup & Drop Location
        </h2>

        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            onClick={handleMapClick}
          >

            {pickupMarker && <Marker position={pickupMarker} />}

            {dropMarker && <Marker position={dropMarker} />}

          </GoogleMap>

        </LoadScript>

      </div>


    </div>
  );
}