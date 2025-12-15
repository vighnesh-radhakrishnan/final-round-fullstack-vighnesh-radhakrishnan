import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface EditVendorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fieldName: string;
  fieldType: "input" | "select";
  currentValue: string;
  options?: Array<{ value: string; label: string; description?: string }>;
  placeholder?: string;
  onSave: (value: string) => Promise<void>;
}

export function EditVendorModal({
  open,
  onOpenChange,
  title,
  fieldName,
  fieldType,
  currentValue,
  options,
  placeholder = "",
  onSave,
}: EditVendorModalProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValue(currentValue || "");
    }
  }, [open, currentValue]);

  const handleSave = async () => {
    if (!value || value === currentValue) {
      onOpenChange(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave(value);
      onOpenChange(false);
    } catch (err) {
      setError("Failed to update. Please try again.");
      console.error("Error updating field:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setValue(""); // Clear completely
      setError(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-normal text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Updating this field will override existing values.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {fieldType === "input" ? (
            <div className="space-y-2">
              <Label
                htmlFor="edit-field"
                className="text-sm font-normal text-gray-700"
              >
                {fieldName}
              </Label>
              <Input
                id="edit-field"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={loading}
                className="h-12 bg-white border-gray-300"
                placeholder={placeholder}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-normal text-gray-700">
                {fieldName}
              </Label>
              <Select
                value={value || undefined}
                onValueChange={setValue}
                disabled={loading}
              >
                <SelectTrigger className="h-12 bg-white border-gray-300">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {options?.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="cursor-pointer py-3"
                    >
                      <div className="flex flex-col items-start">
                        <div className="font-medium text-gray-900">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
            className="text-gray-900 underline hover:text-gray-900 hover:bg-transparent px-0"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading || !value || value === currentValue}
            className="bg-[#E4F222] hover:bg-[#E4F222] hover:underline text-black font-medium px-8"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
