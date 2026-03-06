"use client";

import { useState } from "react";

export default function RideRequest(){

  const [pickup,setPickup] = useState("");
  const [drop,setDrop] = useState("");
  const [rideType,setRideType] = useState("economy");

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

    alert("Ride requested 🚕");

  }

  return(

    <div className="bg-white p-6 rounded shadow max-w-lg">

      <h2 className="text-xl font-semibold mb-4">
        Book a Ride
      </h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Pickup location"
        value={pickup}
        onChange={(e)=>setPickup(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Drop location"
        value={drop}
        onChange={(e)=>setDrop(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-4"
        value={rideType}
        onChange={(e)=>setRideType(e.target.value)}
      >
        <option value="economy">Economy</option>
        <option value="premium">Premium</option>
        <option value="suv">SUV</option>
      </select>

      <button
        onClick={requestRide}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Request Ride
      </button>

    </div>

  )

}