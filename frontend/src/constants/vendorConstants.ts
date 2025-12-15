import { VendorStatus } from "@/types/vendor";

export const STATUS_OPTIONS = [
  {
    value: VendorStatus.ACTIVE,
    label: "Active",
    description: "Vendors that can be paid on Ramp",
  },
  {
    value: VendorStatus.INACTIVE,
    label: "Inactive",
    description: "Users will be warned when trying to pay inactive vendors",
  },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: "card", label: "Card" },
  { value: "ach", label: "ACH" },
  { value: "wire", label: "Wire" },
  { value: "check", label: "Check" },
];
