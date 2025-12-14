export enum VendorStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
}

export enum PaymentMethod {
  CARD = "card",
  ACH = "ach",
  CHECK = "check",
  WIRE = "wire",
}

// vendor interface
export interface Vendor {
  id: number;
  name: string;
  category: string | null;
  owner: string | null;
  total_spend: number;
  thirty_day_spend: number;
  ninety_day_spend: number;
  payment_method: PaymentMethod | null;
  location: string | null;
  department: string | null;
  status: VendorStatus;
  tax_details_submitted: string | null;
  vendor_1099_2024: string | null;
  vendor_1099_2025: string | null;
  creation_date: string;
  updated_at: string | null;
}

export interface VendorsResponse {
  vendors: Vendor[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateVendorRequest {
  name: string;
  category?: string;
  owner?: string;
  total_spend?: number;
  thirty_day_spend?: number;
  ninety_day_spend?: number;
  payment_method?: PaymentMethod;
  location?: string;
  department?: string;
  status?: VendorStatus;
}
