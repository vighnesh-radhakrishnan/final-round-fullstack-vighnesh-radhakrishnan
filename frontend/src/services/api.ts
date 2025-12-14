import type {
  Vendor,
  VendorsResponse,
  CreateVendorRequest,
} from "@/types/vendor";

const API_BASE_URL = "http://localhost:8000";

export const vendorApi = {
  // Get all vendors with optional search and sort
  async getVendors(params?: {
    search?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    skip?: number;
    limit?: number;
  }): Promise<VendorsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append("search", params.search);
    if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params?.sort_order) queryParams.append("sort_order", params.sort_order);
    if (params?.skip !== undefined)
      queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined)
      queryParams.append("limit", params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/vendors?${queryParams}`);
    if (!response.ok) throw new Error("Failed to fetch vendors");
    return response.json();
  },

  // Get single vendor
  async getVendor(id: number): Promise<Vendor> {
    const response = await fetch(`${API_BASE_URL}/vendors/${id}`);
    if (!response.ok) throw new Error("Failed to fetch vendor");
    return response.json();
  },

  // Create vendor
  async createVendor(vendor: CreateVendorRequest): Promise<Vendor> {
    const response = await fetch(`${API_BASE_URL}/vendors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vendor),
    });
    if (!response.ok) throw new Error("Failed to create vendor");
    return response.json();
  },

  // Update vendor
  async updateVendor(
    id: number,
    updates: Partial<CreateVendorRequest>
  ): Promise<Vendor> {
    const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update vendor");
    return response.json();
  },

  // Delete vendor
  async deleteVendor(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete vendor");
  },

  // Get statistics
  async getStatistics() {
    const response = await fetch(`${API_BASE_URL}/api/stats/summary`);
    if (!response.ok) throw new Error("Failed to fetch statistics");
    return response.json();
  },
};
