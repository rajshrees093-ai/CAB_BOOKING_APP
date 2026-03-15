"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";

export default function DriverDashboard() {

  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function getRides() {

    try {

      const res = await fetch("/api/rides/available", {
        cache: "no-store"
      });

      const data = await res.json();

      // handle both response types
      setRides(data.rides || data || []);

      setLoading(false);

    } catch (error) {

      console.error("Error fetching rides:", error);
      setLoading(false);

    }

  }

  useEffect(() => {
    getRides();
  }, []);

  async function acceptRide(rideId: string) {

    try {

      await fetch("/api/rides/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ rideId })
      });

      alert("Ride Accepted 🚕");

      getRides();

    } catch (error) {

      console.error("Accept ride error:", error);

    }

  }

  return (

    <div className="min-h-screen bg-gray-100">

      {/* Top Bar */}

      <div className="flex justify-between items-center p-4 bg-white shadow">

        <h1 className="text-xl font-bold">
          Driver Dashboard
        </h1>

        <UserButton />

      </div>

      {/* Main Content */}

      <div className="max-w-3xl mx-auto mt-8 px-4">

        <h2 className="text-lg font-semibold mb-4">
          Available Ride Requests
        </h2>

        {loading && (
          <p className="text-gray-500">Loading rides...</p>
        )}

        {!loading && rides.length === 0 && (
          <p className="text-gray-500">
            No ride requests available
          </p>
        )}

        {rides.map((ride: any) => (

          <div
            key={ride.id}
            className="bg-white p-5 mb-4 shadow-md rounded-lg border"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="font-semibold">
                  {ride.pickup_location} → {ride.drop_location}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Status: {ride.status}
                </p>

              </div>

              <button
                onClick={() => acceptRide(ride.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Accept Ride
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}