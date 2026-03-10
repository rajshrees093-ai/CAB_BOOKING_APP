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
      <div className="p-10 text-center text-lg">
        Loading ride history...
      </div>
    );
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Ride History
      </h1>

      {rides.length === 0 && (
        <p>No rides found</p>
      )}

      <div className="space-y-4">

        {rides.map((ride) => (
          <div
            key={ride.id}
            className="border rounded-lg p-5 shadow-sm bg-white"
          >

            <div className="flex justify-between mb-2">
              <p className="font-semibold">
                {ride.pickup_location} → {ride.drop_location}
              </p>

              <p className="text-green-600 font-bold">
                ₹{ride.fare}
              </p>
            </div>

            <div className="text-sm text-gray-600">
              Status: {ride.status}
            </div>

            <div className="text-sm text-gray-500">
              Date: {new Date(ride.created_at).toLocaleString()}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}