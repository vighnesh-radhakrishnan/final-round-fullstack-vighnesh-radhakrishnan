import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  FileText,
  Search,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { Vendor } from "@/types/vendor";
import { vendorApi } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";

export default function VendorTable() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  // debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // sort states
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchVendors();
  }, [debouncedSearchTerm, sortBy, sortOrder]); // re-fetch when search is updated

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorApi.getVendors({
        search: debouncedSearchTerm || undefined,
        sort_by: sortBy || undefined,
        sort_order: sortOrder,
      });
      setVendors(response.vendors);
      setTotalCount(response.total);
      setError(null);
    } catch (err) {
      setError("Failed to load vendors");
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add sorting handler
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // New column, default to ascending
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      active: "default",
      pending: "secondary",
      inactive: "outline",
    };

    return (
      <Badge variant={variants[status] || "default"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getPaymentMethodDisplay = (method: string | null) => {
    if (!method) return "—";

    const methods: Record<string, string> = {
      card: "Card",
      ach: "ACH",
      check: "Check",
      wire: "Wire",
    };

    return methods[method] || method;
  };

  if (error) {
    return (
      <div className="border rounded-lg bg-white">
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to load vendors
          </h3>
          <p className="text-sm text-gray-500 mb-4 text-center max-w-sm">
            There was a problem connecting to the server. Please make sure the
            backend is running.
          </p>
          <button
            onClick={fetchVendors}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search or filter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results count */}
        {searchTerm && (
          <div className="text-sm text-gray-600">
            {loading
              ? "Searching..."
              : `${totalCount} result${totalCount !== 1 ? "s" : ""}`}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>

              {/* Sortable: Vendor */}
              <TableHead className="hover:bg-[rgb(252,251,250)] cursor-pointer transition-colors">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 font-medium w-full"
                >
                  Vendor
                  {sortBy === "name" &&
                    (sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    ))}
                </button>
              </TableHead>

              {/* Non-sortable: Owners */}
              <TableHead>Owners</TableHead>

              {/* Sortable: 365-day spend */}
              <TableHead className="text-right hover:bg-[rgb(252,251,250)] cursor-pointer transition-colors">
                <button
                  onClick={() => handleSort("total_spend")}
                  className="flex items-center gap-1 font-medium ml-auto w-full justify-end"
                >
                  365-day spend
                  {sortBy === "total_spend" &&
                    (sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    ))}
                </button>
              </TableHead>

              {/* Sortable: 30-day spend */}
              <TableHead className="text-right hover:bg-[rgb(252,251,250)] cursor-pointer transition-colors">
                <button
                  onClick={() => handleSort("thirty_day_spend")}
                  className="flex items-center gap-1 font-medium ml-auto w-full justify-end"
                >
                  30-day spend
                  {sortBy === "thirty_day_spend" &&
                    (sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    ))}
                </button>
              </TableHead>

              {/* Non-sortable: Description */}
              <TableHead>Description</TableHead>

              {/* Sortable: Department */}
              <TableHead className="hover:bg-[rgb(252,251,250)] cursor-pointer transition-colors">
                <button
                  onClick={() => handleSort("department")}
                  className="flex items-center gap-1 font-medium w-full"
                >
                  Department
                  {sortBy === "department" &&
                    (sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    ))}
                </button>
              </TableHead>

              {/* Non-sortable: Contract */}
              <TableHead>Contract</TableHead>

              {/* Non-sortable: Vendor owner location */}
              <TableHead>Vendor owner location</TableHead>

              {/* Sortable: Creation date */}
              <TableHead className="hover:bg-[rgb(252,251,250)] cursor-pointer transition-colors">
                <button
                  onClick={() => handleSort("creation_date")}
                  className="flex items-center gap-1 font-medium w-full"
                >
                  Creation date
                  {sortBy === "creation_date" &&
                    (sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    ))}
                </button>
              </TableHead>

              {/* Non-sortable: Payment type */}
              <TableHead>Payment type</TableHead>

              {/* Sortable: Vendor status */}
              <TableHead className="hover:bg-[rgb(252,251,250)] cursor-pointer transition-colors">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1 font-medium w-full"
                >
                  Vendor status
                  {sortBy === "status" &&
                    (sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    ))}
                </button>
              </TableHead>

              {/* Non-sortable columns (currently dont have this data) */}
              <TableHead>Default contact</TableHead>
              <TableHead>Tax details</TableHead>
              <TableHead>Tax verification</TableHead>
              <TableHead>1099 vendor (2025)</TableHead>
              <TableHead>1099 vendor (2024)</TableHead>

              {/* Sortable: Contract start */}
              <TableHead className="hover:bg-[rgb(252,251,250)] cursor-pointer transition-colors">
                <button
                  onClick={() => handleSort("contract_start")}
                  className="flex items-center gap-1 font-medium w-full"
                >
                  Contract start
                  {sortBy === "contract_start" &&
                    (sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    ))}
                </button>
              </TableHead>

              {/* Sortable: Contract end */}
              <TableHead className="hover:bg-[rgb(252,251,250)] cursor-pointer transition-colors">
                <button
                  onClick={() => handleSort("contract_end")}
                  className="flex items-center gap-1 font-medium w-full"
                >
                  Contract end
                  {sortBy === "contract_end" &&
                    (sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    ))}
                </button>
              </TableHead>

              {/* Non-sortable remaining columns */}
              <TableHead>Last date to terminate</TableHead>
              <TableHead>Net payment terms</TableHead>
              <TableHead>SOC Reports</TableHead>
              <TableHead>COI</TableHead>
              <TableHead>Company Website Link</TableHead>
              <TableHead>Service based vendor?</TableHead>
              <TableHead>COI Expiration Date</TableHead>
              <TableHead>Rate Vendor 1-10</TableHead>

              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={27} className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/6" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : vendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={27} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <Search className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No vendors found
                    </h3>
                    <p className="text-sm text-gray-500">
                      {searchTerm
                        ? `No results for "${searchTerm}". Try a different search term.`
                        : "No vendors available."}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={handleClearSearch}
                        className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              vendors.map((vendor) => (
                <TableRow key={vendor.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox />
                  </TableCell>

                  {/* Vendor */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                        {vendor.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-gray-500">
                          {vendor.category || "—"}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Owners */}
                  <TableCell>
                    {vendor.owner ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                          {vendor.owner.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm">{vendor.owner}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>

                  {/* 365-day spend */}
                  <TableCell className="text-right font-medium">
                    {formatCurrency(vendor.total_spend)}
                  </TableCell>

                  {/* 30-day spend */}
                  <TableCell className="text-right text-gray-600">
                    {formatCurrency(vendor.thirty_day_spend)}
                  </TableCell>

                  {/* Description */}
                  <TableCell className="text-sm text-gray-600">
                    {vendor.category || "—"}
                  </TableCell>

                  {/* Department */}
                  <TableCell>
                    {vendor.department || (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>

                  {/* Contract */}
                  <TableCell>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FileText className="h-4 w-4" />
                    </button>
                  </TableCell>

                  {/* Vendor owner location */}
                  <TableCell>
                    {vendor.location || (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>

                  {/* Creation date */}
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(vendor.creation_date)}
                  </TableCell>

                  {/* Payment type */}
                  <TableCell className="text-sm text-gray-600">
                    {getPaymentMethodDisplay(vendor.payment_method)}
                  </TableCell>

                  {/* Vendor status */}
                  <TableCell>{getStatusBadge(vendor.status)}</TableCell>

                  {/* Default contact */}
                  <TableCell>
                    <span className="text-gray-400">—</span>
                  </TableCell>

                  {/* Tax details */}
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {vendor.tax_details_submitted || "—"}
                    </span>
                  </TableCell>

                  {/* Tax verification */}
                  <TableCell>
                    <span className="text-gray-400">—</span>
                  </TableCell>

                  {/* 1099 vendor (2025) */}
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {vendor.vendor_1099_2025 || "—"}
                    </span>
                  </TableCell>

                  {/* 1099 vendor (2024) */}
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {vendor.vendor_1099_2024 || "—"}
                    </span>
                  </TableCell>

                  {/* Contract start */}
                  <TableCell>
                    <span className="text-gray-400">—</span>
                  </TableCell>

                  {/* Contract end */}
                  <TableCell>
                    <span className="text-gray-400">—</span>
                  </TableCell>

                  {/* Last date to terminate */}
                  <TableCell>
                    <span className="text-gray-400">—</span>
                  </TableCell>

                  {/* Net payment terms */}
                  <TableCell>
                    <span className="text-gray-400">—</span>
                  </TableCell>

                  {/* SOC Reports */}
                  <TableCell>
                    <span className="text-gray-400">—</span>
                  </TableCell>

                  {/* COI */}
                  <TableCell>
                    <span className="text-gray-400">—</span>
                  </TableCell>

                  {/* Company Website Link */}
                  <TableCell>
                    <span className="text-gray-400">—</span>
                  </TableCell>

                  {/* Service based vendor? */}
                  <TableCell>
                    <span className="text-gray-400">—</span>
                  </TableCell>

                  {/* COI Expiration Date */}
                  <TableCell>
                    <span className="text-gray-400">—</span>
                  </TableCell>

                  {/* Rate Vendor 1-10 */}
                  <TableCell>
                    <span className="text-gray-400">—</span>
                  </TableCell>

                  {/* Menu */}
                  <TableCell>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
