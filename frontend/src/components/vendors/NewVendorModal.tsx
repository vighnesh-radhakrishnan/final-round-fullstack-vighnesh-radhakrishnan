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
import { vendorApi } from "@/services/api";
import { VendorStatus } from "@/types/vendor";
import type { CreateVendorRequest } from "@/types/vendor";
import {
  FormSection,
  BasicInfoFields,
  ContactFields,
  SelectField,
  InfoBanner,
} from "./VendorFormFields";

interface NewVendorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVendorCreated: () => void;
}

// New Vendor Creation Panel
export default function NewVendorModal({
  open,
  onOpenChange,
  onVendorCreated,
}: NewVendorModalProps) {
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
        {/* Header */}
        <div className="p-6 pb-0 bg-white">
          <SheetHeader>
            <SheetTitle className="text-2xl font-normal">New vendor</SheetTitle>
            <SheetDescription className="text-base">
              Who would you like to add?
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Form */}
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
            <InfoBanner
              title="Creating a new vendor"
              message="We will create a new vendor for you"
            />

            {/* Basic Info Section */}
            <FormSection title="Basic info">
              <BasicInfoFields
                formData={formData}
                onChange={handleInputChange}
                disabled={loading}
              />
            </FormSection>

            {/* Vendor Contact Section */}
            <FormSection title="Vendor contact">
              <ContactFields disabled={loading} />
            </FormSection>

            {/* Payment Details Section */}
            <FormSection title="Payment details">
              <SelectField
                label="Add payment details (required)"
                value={paymentOption}
                onChange={setPaymentOption}
                options={[
                  { value: "request", label: "Request from the vendor" },
                  { value: "skip", label: "Skip for now" },
                ]}
                disabled={loading}
              />
            </FormSection>

            {/* Tax Details Section */}
            <FormSection title="Tax details">
              <SelectField
                label="Add tax details (required)"
                value={taxOption}
                onChange={setTaxOption}
                options={[
                  { value: "request", label: "Request from the vendor" },
                  { value: "skip", label: "Skip for now" },
                ]}
                disabled={loading}
              />
            </FormSection>

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
