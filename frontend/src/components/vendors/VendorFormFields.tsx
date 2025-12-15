import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateVendorRequest } from "@/types/vendor";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}
// New Vendor Form Component
export function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      {children}
    </div>
  );
}

interface BasicInfoFieldsProps {
  formData: CreateVendorRequest;
  onChange: (field: keyof CreateVendorRequest, value: string) => void;
  disabled?: boolean;
}

export function BasicInfoFields({
  formData,
  onChange,
  disabled,
}: BasicInfoFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-normal">
          Country *
        </Label>
        <Input
          id="location"
          placeholder="United States of America"
          value={formData.location}
          onChange={(e) => onChange("location", e.target.value)}
          disabled={disabled}
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
          onChange={(e) => onChange("owner", e.target.value)}
          disabled={disabled}
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
          onChange={(e) => onChange("department", e.target.value)}
          disabled={disabled}
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
          onChange={(e) => onChange("category", e.target.value)}
          disabled={disabled}
          className="h-11"
        />
      </div>
    </>
  );
}

interface ContactFieldsProps {
  disabled?: boolean;
}

export function ContactFields({ disabled }: ContactFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name" className="text-sm font-normal">
            First name
          </Label>
          <Input
            id="first-name"
            placeholder="First name"
            disabled={disabled}
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
            disabled={disabled}
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
          disabled={disabled}
          className="h-11"
        />
      </div>
    </>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  disabled,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-normal">{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-11">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface InfoBannerProps {
  title: string;
  message: string;
}

export function InfoBanner({ title, message }: InfoBannerProps) {
  return (
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
          <p className="font-medium text-sm text-green-900">{title}</p>
          <p className="text-sm text-green-800">{message}</p>
        </div>
      </div>
    </div>
  );
}
