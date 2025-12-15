import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vendorApi } from "@/services/api";
import { VendorStatus } from "@/types/vendor";
import type { CreateVendorRequest } from "@/types/vendor";

interface NewVendorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVendorCreated: () => void;
}

export default function NewVendorSheet({
  open,
  onOpenChange,
  onVendorCreated,
}: NewVendorSheetProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentOption, setPaymentOption] = useState<string>("request");
  const [taxOption, setTaxOption] = useState<string>("request");

  const [formData, setFormData] = useState<CreateVendorRequest>({
    name: "",
    category: "",
    owner: "",
    payment_method: undefined,
    location: "",
    department: "",
    status: VendorStatus.ACTIVE,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Vendor name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await vendorApi.createVendor(formData);

      // Reset form
      setFormData({
        name: "",
        category: "",
        owner: "",
        payment_method: undefined,
        location: "",
        department: "",
        status: VendorStatus.ACTIVE,
      });
      setPaymentOption("request");
      setTaxOption("request");

      onOpenChange(false);
      onVendorCreated();
    } catch (err) {
      setError("Failed to create vendor. Please try again.");
      console.error("Error creating vendor:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateVendorRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0 flex flex-col bg-white">
        <div className="p-6 pb-0 bg-white">
          <SheetHeader>
            <SheetTitle className="text-2xl font-normal">New vendor</SheetTitle>
            <SheetDescription className="text-base">
              Who would you like to add?
            </SheetDescription>
          </SheetHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-white">
          <div className="flex-1 px-6 pb-6 space-y-6 overflow-y-auto bg-white">
            {/* Vendor Name */}
            <div className="space-y-2 mt-6">
              <Label htmlFor="name" className="text-sm font-normal">
                Vendor name *
              </Label>
              <Input
                id="name"
                placeholder="Search or create a new vendor"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={loading}
                className="h-11"
                required
              />
            </div>

            {/* Info Banner */}
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex gap-2">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <div>
                  <p className="font-medium text-sm text-green-900">
                    Creating a new vendor
                  </p>
                  <p className="text-sm text-green-800">
                    We will create a new vendor for you
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic info</h3>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-normal">
                  Country *
                </Label>
                <Input
                  id="location"
                  placeholder="United States of America"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  disabled={loading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner" className="text-sm font-normal">
                  Vendor owners *
                </Label>
                <Input
                  id="owner"
                  placeholder="Enter owner name"
                  value={formData.owner}
                  onChange={(e) => handleInputChange("owner", e.target.value)}
                  disabled={loading}
                  className="h-11"
                />
                <p className="text-sm text-gray-500">
                  Select the main points of contact for the vendor relationship
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-normal">
                  Vendor department
                </Label>
                <Input
                  id="department"
                  placeholder="e.g., Engineering, Marketing"
                  value={formData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  disabled={loading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-normal">
                  Category
                </Label>
                <Input
                  id="category"
                  placeholder="e.g., SaaS / Software, Technology"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  disabled={loading}
                  className="h-11"
                />
              </div>
            </div>

            {/* Vendor Contact Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Vendor contact</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-sm font-normal">
                    First name
                  </Label>
                  <Input
                    id="first-name"
                    placeholder="First name"
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-sm font-normal">
                    Last name
                  </Label>
                  <Input
                    id="last-name"
                    placeholder="Last name"
                    disabled={loading}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-normal">
                  Email (required)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  disabled={loading}
                  className="h-11"
                />
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment details</h3>

              <div className="space-y-2">
                <Label className="text-sm font-normal">
                  Add payment details (required)
                </Label>
                <Select value={paymentOption} onValueChange={setPaymentOption}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="request">
                      Request from the vendor
                    </SelectItem>
                    <SelectItem value="skip">Skip for now</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tax Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tax details</h3>

              <div className="space-y-2">
                <Label className="text-sm font-normal">
                  Add tax details (required)
                </Label>
                <Select value={taxOption} onValueChange={setTaxOption}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="request">
                      Request from the vendor
                    </SelectItem>
                    <SelectItem value="skip">Skip for now</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Actions - Sticky at bottom */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between gap-3 mt-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="h-11 text-[#B74018] hover:text-[#B74018] hover:bg-transparent hover:underline border border-[#B74018] rounded-none"
            >
              Discard changes
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#E4F222] hover:bg-[#E4F222] hover:underline text-black font-medium rounded-none h-11 px-8"
            >
              {loading ? "Creating..." : "Add Vendor"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
