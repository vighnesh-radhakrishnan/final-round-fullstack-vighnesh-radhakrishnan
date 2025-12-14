import { useState } from "react";

export default function VendorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <p className="text-gray-600">Vendor table will go here...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
