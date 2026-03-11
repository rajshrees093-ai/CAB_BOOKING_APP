"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ReceiptPage() {

  const params = useParams();
  const router = useRouter();

  const rideId = params.rideId;

  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("/api/rides/history")
      .then(res => res.json())
      .then(data => {

        const foundRide = data.rides.find((r: any) => r.id === rideId);

        setRide(foundRide);
        setLoading(false);

      });

  }, [rideId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading receipt...
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="text-center mt-20 text-red-500">
        Receipt not found
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">

      <div className="bg-white shadow-lg rounded-xl border p-6">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Ride Receipt
        </h1>

        <div className="space-y-3 text-gray-700">

          <div className="flex justify-between">
            <span>Ride ID</span>
            <span>{ride.id}</span>
          </div>

          <div className="flex justify-between">
            <span>Pickup</span>
            <span>{ride.pickup_location}</span>
          </div>

          <div className="flex justify-between">
            <span>Drop</span>
            <span>{ride.drop_location}</span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span className="font-medium">{ride.status}</span>
          </div>

          <div className="flex justify-between">
            <span>Date</span>
            <span>{new Date(ride.created_at).toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-lg font-bold text-green-600 pt-4 border-t">
            <span>Total Fare</span>
            <span>₹{ride.fare}</span>
          </div>

        </div>

        <div className="flex justify-between mt-8">

          <button
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-lg"
          >
            Back
          </button>

          <button
            onClick={() => window.open(`/api/rides/receipt/${ride.id}`)}
            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Download PDF
          </button>

        </div>

      </div>

    </div>
  );
}