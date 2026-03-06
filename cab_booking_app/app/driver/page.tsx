"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";

export default function DriverDashboard() {

  const [rides,setRides] = useState([]);

  async function getRides(){

    const res = await fetch("/api/rides/available");
    const data = await res.json();

    setRides(data);

  }

  useEffect(()=>{
    getRides();
  },[]);


  async function acceptRide(rideId:string){

    await fetch("/api/rides/accept",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({rideId})
    });

    alert("Ride Accepted 🚕");

    getRides();

  }


  return (

    <div className="min-h-screen bg-gray-100">

      <div className="flex justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-bold">Driver Dashboard</h1>
        <UserButton/>
      </div>

      <div className="max-w-3xl mx-auto mt-8">

        <h2 className="text-lg font-semibold mb-4">
          Available Ride Requests
        </h2>

        {rides.map((ride:any)=>(
          
          <div key={ride.id} className="bg-white p-4 mb-4 shadow rounded">

            <p><b>Pickup:</b> {ride.pickup_location}</p>
            <p><b>Drop:</b> {ride.drop_location}</p>
            <p><b>Status:</b> {ride.status}</p>

            <button
              onClick={()=>acceptRide(ride.id)}
              className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
            >
              Accept Ride
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}