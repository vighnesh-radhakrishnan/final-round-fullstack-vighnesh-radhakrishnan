import { useState } from "react";
import VendorTable from "@/components/vendors/VendorTable";
import NewVendorModal from "@/components/vendors/NewVendorModal";
import { EmptyTabPage } from "@/components/vendors/EmptyTabPage";
import { Button } from "@/components/ui/button";

type TabType =
  | "overview"
  | "needs-review"
  | "renewals"
  | "duplicates"
  | "switch-cards";

export default function VendorsPage() {
  const [isNewVendorOpen, setIsNewVendorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const tabs = [
    { id: "overview" as TabType, label: "Overview", badge: null },
    { id: "needs-review" as TabType, label: "Needs review", badge: 0 },
    { id: "renewals" as TabType, label: "Renewals", badge: null },
    { id: "duplicates" as TabType, label: "Duplicates", badge: 2 },
    { id: "switch-cards" as TabType, label: "Switch cards", badge: null },
  ];

  const handleVendorCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <VendorTable key={refreshTrigger} />;

      case "needs-review":
        return (
          <EmptyTabPage
            title="No vendors need review"
            description="Vendors requiring your attention will appear here for quick action."
            iconType="review"
          />
        );

      case "renewals":
        return (
          <EmptyTabPage
            title="No upcoming renewals"
            description="Track and manage vendor contract renewals to stay ahead of deadlines."
            iconType="renewals"
          />
        );

      case "duplicates":
        return (
          <EmptyTabPage
            title="Merge duplicate vendors"
            description="We found 2 potential duplicate vendors. Review and merge them to keep your vendor list clean."
            iconType="duplicates"
          />
        );

      case "switch-cards":
        return (
          <EmptyTabPage
            title="Move spend onto Ramp"
            description="Get assistance identifying and creating virtual cards for what you're currently spending on"
            iconType="cards"
          />
        );

      default:
        return <VendorTable key={refreshTrigger} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FCFBFA]">
      {/* Blur overlay when modal is open */}
      {isNewVendorOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
      )}

      {/* Main content */}
      <div className={isNewVendorOpen ? "blur-sm" : ""}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-normal">Vendors</h1>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsNewVendorOpen(true)}
                className="bg-[#E4F222] hover:bg-[#E4F222] hover:underline text-black font-medium"
              >
                New vendor
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-gray-200 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {tab.badge !== null && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="h-[calc(100vh-180px)]">{renderTabContent()}</div>
      </div>

      {/* New Vendor Sheet */}
      <NewVendorModal
        open={isNewVendorOpen}
        onOpenChange={setIsNewVendorOpen}
        onVendorCreated={handleVendorCreated}
      />
    </div>
  );
}
