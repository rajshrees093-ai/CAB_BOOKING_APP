"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {

  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");

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

    </div>
  );
}