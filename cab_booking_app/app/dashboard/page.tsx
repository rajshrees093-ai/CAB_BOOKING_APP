"use client";

import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="flex justify-between items-center bg-white p-4 shadow">
        <h1 className="text-xl font-bold">Cab Booking Dashboard</h1>
        <UserButton />
      </div>

      {/* Dashboard Content */}
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome to your dashboard
        </h2>

        <p className="text-gray-600">
          Here you will manage your profile and book rides.
        </p>
      </div>

    </div>
  );
}