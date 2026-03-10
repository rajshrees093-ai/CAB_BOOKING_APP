"use client";

import { useEffect, useState } from "react";

export default function RideHistoryPage() {

  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rides/history")
      .then((res) => res.json())
      .then((data) => {
        setRides(data.rides || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading Ride History...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        Ride History
      </h1>

      {rides.length === 0 && (
        <p>No rides found</p>
      )}

      <div className="space-y-5">

        {rides.map((ride) => (
          <div
            key={ride.id}
            className="bg-white shadow-md rounded-lg p-5 border"
          >

            <div className="flex justify-between items-center">

              <div>
                <p className="font-semibold text-lg">
                  {ride.pickup_location} → {ride.drop_location}
                </p>

                <p className="text-gray-500 text-sm">
                  {new Date(ride.created_at).toLocaleString()}
                </p>

                <p className="text-sm mt-1">
                  Status: <span className="font-medium">{ride.status}</span>
                </p>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  ₹{ride.fare}
                </p>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}