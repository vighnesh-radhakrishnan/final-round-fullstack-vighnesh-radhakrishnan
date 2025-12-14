import { useState } from "react";
import { Button } from "@/components/ui/button";
import VendorTable from "./VendorTable";
import NewVendorModal from "./NewVendorModal";

export default function VendorsPage() {
  const [isNewVendorOpen, setIsNewVendorOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVendorCreated = () => {
    // Trigger refresh of vendor table
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
          <Button
            onClick={() => setIsNewVendorOpen(true)}
            className="bg-[#E4F222] hover:bg-[#E4F222] hover:underline text-black font-medium rounded-none"
          >
            New vendor
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex gap-8">
            <button className="py-3 border-b-2 border-gray-900 font-medium text-sm">
              Overview
            </button>
            <button className="py-3 text-gray-500 hover:text-gray-900 font-medium text-sm">
              Needs review
            </button>
            <button className="py-3 text-gray-500 hover:text-gray-900 font-medium text-sm">
              Renewals
            </button>
            <button className="py-3 text-gray-500 hover:text-gray-900 font-medium text-sm">
              Duplicates
            </button>
            <button className="py-3 text-gray-500 hover:text-gray-900 font-medium text-sm">
              Switch cards
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <VendorTable key={refreshKey} />
      </main>

      {/* New Vendor Dialog */}
      <NewVendorModal
        open={isNewVendorOpen}
        onOpenChange={setIsNewVendorOpen}
        onVendorCreated={handleVendorCreated}
      />
    </div>
  );
}
