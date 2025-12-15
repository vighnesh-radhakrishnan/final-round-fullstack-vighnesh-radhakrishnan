import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Grid3x3, Download } from "lucide-react";
import VendorTable from "./VendorTable";
import NewVendorModal from "./NewVendorModal";

export default function VendorsPage() {
  const [isNewVendorOpen, setIsNewVendorOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVendorCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="px-6 py-6 flex items-center justify-between">
          <h1 className="text-4xl font-normal text-gray-900">Vendors</h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsNewVendorOpen(true)}
              className="bg-[#E4F222] hover:bg-[#E4F222] hover:underline text-black font-medium rounded-md px-4 h-10"
            >
              New vendor
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6">
          <nav className="flex gap-6">
            <button className="py-4 border-b-2 border-black font-normal text-sm text-gray-900">
              Overview
            </button>
            <button className="py-4 text-gray-500 hover:text-gray-900 font-normal text-sm flex items-center gap-2">
              Needs review
              <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-0.5">
                0
              </span>
            </button>
            <button className="py-4 text-gray-500 hover:text-gray-900 font-normal text-sm">
              Renewals
            </button>
            <button className="py-4 text-gray-500 hover:text-gray-900 font-normal text-sm flex items-center gap-2">
              Duplicates
              <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-0.5">
                2
              </span>
            </button>
            <button className="py-4 text-gray-500 hover:text-gray-900 font-normal text-sm">
              Switch cards
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-6">
        <VendorTable key={refreshKey} />
      </main>

      {/* New Vendor Sheet */}
      <NewVendorModal
        open={isNewVendorOpen}
        onOpenChange={setIsNewVendorOpen}
        onVendorCreated={handleVendorCreated}
      />
    </div>
  );
}
