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
import {
  MoreHorizontal,
  Search,
  X,
  ArrowUp,
  ArrowDown,
  Grid3x3,
  Download,
  AlignJustify,
  Upload,
  PenSquare,
  CheckCircle2,
} from "lucide-react";
import type { Vendor } from "@/types/vendor";
import { vendorApi } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import { VendorActionsMenu } from "./VendorActionsMenu";

export default function VendorTable() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [hoveredOwnerId, setHoveredOwnerId] = useState<number | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchVendors();
  }, [debouncedSearchTerm, sortBy, sortOrder]);

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

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleRowSelect = (vendorId: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(vendorId)) {
      newSelected.delete(vendorId);
    } else {
      newSelected.add(vendorId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === vendors.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(vendors.map((v) => v.id)));
    }
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
      <div className="bg-white rounded-lg border border-gray-200">
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
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search or filter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 rounded-full pl-9 pr-9 text-sm border-gray-300 w-64"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Action Icons with proper tooltips */}
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className="p-1.5 hover:bg-gray-100 rounded-full border border-gray-400">
              <AlignJustify className="h-3.5 w-3.5 text-gray-600" />
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white border border-gray-300 text-gray-900 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              Group by
            </div>
          </div>

          <div className="relative group">
            <button className="p-1.5 hover:bg-gray-100 rounded-full border border-gray-400">
              <Grid3x3 className="h-3.5 w-3.5 text-gray-600" />
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white border border-gray-300 text-gray-900 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              Customize columns
            </div>
          </div>

          <div className="relative group">
            <button className="p-1.5 hover:bg-gray-100 rounded-full border border-gray-400">
              <Download className="h-3.5 w-3.5 text-gray-600" />
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white border border-gray-300 text-gray-900 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              Export
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                {/* Sticky Checkbox Column */}
                <TableHead className="sticky left-0 z-20 bg-white border-r border-gray-200 w-[60px] pr-10">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={
                        vendors.length > 0 &&
                        selectedRows.size === vendors.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </div>
                </TableHead>

                {/* Sticky Vendor Column with RIGHT border */}
                <TableHead className="sticky left-[60px] z-20 bg-white text-gray-600 text-xs font-medium border-r-2 border-gray-300 min-w-[250px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded w-full cursor-pointer"
                  >
                    Vendor
                    {sortBy === "name" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      ))}
                  </button>
                </TableHead>

                {/* Scrollable Columns */}
                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[180px] cursor-pointer pl-10">
                  Owners
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium text-right border-r border-gray-200 min-w-[150px]">
                  <button
                    onClick={() => handleSort("total_spend")}
                    className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded ml-auto cursor-pointer"
                  >
                    365-day spend
                    {sortBy === "total_spend" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      ))}
                  </button>
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium text-right border-r border-gray-200 min-w-[150px]">
                  <button
                    onClick={() => handleSort("thirty_day_spend")}
                    className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded ml-auto cursor-pointer"
                  >
                    30-day spend
                    {sortBy === "thirty_day_spend" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      ))}
                  </button>
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[180px] cursor-pointer">
                  Description
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[180px]">
                  <button
                    onClick={() => handleSort("department")}
                    className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded cursor-pointer"
                  >
                    Department
                    {sortBy === "department" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      ))}
                  </button>
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[120px] cursor-pointer">
                  Contract
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[180px] cursor-pointer">
                  Vendor owner location
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[150px]">
                  <button
                    onClick={() => handleSort("creation_date")}
                    className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded cursor-pointer"
                  >
                    Creation date
                    {sortBy === "creation_date" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      ))}
                  </button>
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[130px] cursor-pointer">
                  Payment type
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[180px]">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded cursor-pointer"
                  >
                    Vendor status
                    {sortBy === "status" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      ))}
                  </button>
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[150px] cursor-pointer">
                  Default contact
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[150px] cursor-pointer">
                  Tax details
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[150px] cursor-pointer">
                  Tax verification
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[150px] cursor-pointer">
                  1099 vendor (2025)
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[150px] cursor-pointer">
                  1099 vendor (2024)
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[150px] cursor-pointer">
                  Contract start
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[150px] cursor-pointer">
                  Contract end
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[180px] cursor-pointer">
                  Last date to terminate
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[150px] cursor-pointer">
                  Net payment terms
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[150px] cursor-pointer">
                  SOC Reports
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[120px] cursor-pointer">
                  COI
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[180px] cursor-pointer">
                  Company Website Link
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[200px] cursor-pointer">
                  Service based vendor?
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[180px] cursor-pointer">
                  COI Expiration Date
                </TableHead>

                <TableHead className="text-gray-600 text-xs font-medium border-r border-gray-200 min-w-[150px] cursor-pointer">
                  Rate Vendor 1-10
                </TableHead>

                {/* Sticky Kebab Menu Column with LEFT border */}
                <TableHead className="sticky right-0 z-20 bg-white w-[60px] border-l-2 border-gray-300 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <TableRow key={i} className="border-b border-gray-100">
                    <TableCell className="sticky left-0 z-10 bg-white border-r border-gray-200 pr-10">
                      <div className="flex justify-center">
                        <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell className="sticky left-[60px] z-10 bg-white border-r-2 border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      colSpan={25}
                      className="border-r border-gray-200"
                    >
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                    </TableCell>
                    <TableCell className="sticky right-0 z-10 bg-white border-l-2 border-gray-300 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]" />
                  </TableRow>
                ))
              ) : vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={28} className="text-center py-12">
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
                vendors.map((vendor) => {
                  const isSelected = selectedRows.has(vendor.id);

                  return (
                    <TableRow
                      key={vendor.id}
                      className={`border-b border-gray-100 group ${
                        isSelected
                          ? "bg-green-50 hover:bg-green-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Sticky Checkbox - WITH HOVER */}
                      <TableCell
                        className={`sticky left-0 z-10 border-r border-gray-200 cursor-pointer pr-10 ${
                          isSelected
                            ? "bg-green-50 group-hover:bg-green-50"
                            : "bg-white group-hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleRowSelect(vendor.id)}
                          />
                        </div>
                      </TableCell>

                      {/* Sticky Vendor - WITH HOVER */}
                      <TableCell
                        className={`sticky left-[60px] z-10 border-r-2 border-gray-300 cursor-pointer shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] ${
                          isSelected
                            ? "bg-green-50 group-hover:bg-green-50"
                            : "bg-white group-hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                            {vendor.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {vendor.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {vendor.category || "—"}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Owners with hover edit */}
                      <TableCell
                        className="border-r border-gray-200 relative cursor-pointer pl-10"
                        onMouseEnter={() => setHoveredOwnerId(vendor.id)}
                        onMouseLeave={() => setHoveredOwnerId(null)}
                      >
                        {vendor.owner ? (
                          <div className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <div className="w-6 h-6 rounded-full bg-pink-200 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                {vendor.owner
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </div>
                              <span className="text-sm truncate">
                                {vendor.owner}
                              </span>
                            </div>
                            {hoveredOwnerId === vendor.id && (
                              <button className="text-gray-900 hover:text-gray-700 flex-shrink-0">
                                <PenSquare className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>

                      {/* 365-day spend */}
                      <TableCell className="text-right font-medium border-r border-gray-200 cursor-pointer">
                        {formatCurrency(vendor.total_spend)}
                      </TableCell>

                      {/* 30-day spend */}
                      <TableCell className="text-right text-gray-600 border-r border-gray-200 cursor-pointer">
                        {formatCurrency(vendor.thirty_day_spend)}
                      </TableCell>

                      {/* Description with edit */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-gray-600 truncate">
                            {vendor.category || "—"}
                          </span>
                          <button className="text-gray-900 hover:text-gray-700 flex-shrink-0">
                            <PenSquare className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>

                      {/* Department */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        {vendor.department || (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>

                      {/* Contract with share icon */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Upload className="h-4 w-4" />
                        </button>
                      </TableCell>

                      {/* Vendor owner location */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        {vendor.location || (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>

                      {/* Creation date */}
                      <TableCell className="text-sm text-gray-600 border-r border-gray-200 cursor-pointer">
                        {formatDate(vendor.creation_date)}
                      </TableCell>

                      {/* Payment type */}
                      <TableCell className="text-sm text-gray-600 border-r border-gray-200 cursor-pointer">
                        {getPaymentMethodDisplay(vendor.payment_method)}
                      </TableCell>

                      {/* Vendor status with icon and edit */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm capitalize">
                            {vendor.status}
                          </span>
                          <button className="text-gray-900 hover:text-gray-700 flex-shrink-0">
                            <PenSquare className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>

                      {/* Default contact */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <span className="text-gray-400">—</span>
                      </TableCell>

                      {/* Tax details with edit */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-gray-600">
                            {vendor.tax_details_submitted || "—"}
                          </span>
                          <button className="text-gray-900 hover:text-gray-700 flex-shrink-0">
                            <PenSquare className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>

                      {/* Tax verification */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <span className="text-gray-400">—</span>
                      </TableCell>

                      {/* 1099 vendor (2025) with edit */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-gray-600">
                            {vendor.vendor_1099_2025 || "—"}
                          </span>
                          <button className="text-gray-900 hover:text-gray-700 flex-shrink-0">
                            <PenSquare className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>

                      {/* 1099 vendor (2024) with edit */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-gray-600">
                            {vendor.vendor_1099_2024 || "—"}
                          </span>
                          <button className="text-gray-900 hover:text-gray-700 flex-shrink-0">
                            <PenSquare className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>

                      {/* Contract start */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <span className="text-gray-400">—</span>
                      </TableCell>

                      {/* Contract end */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <span className="text-gray-400">—</span>
                      </TableCell>

                      {/* Last date to terminate */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <span className="text-gray-400">—</span>
                      </TableCell>

                      {/* Net payment terms */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <span className="text-gray-400">—</span>
                      </TableCell>

                      {/* SOC Reports */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <span className="text-gray-400">—</span>
                      </TableCell>

                      {/* COI */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <span className="text-gray-400">—</span>
                      </TableCell>

                      {/* Company Website Link */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <span className="text-gray-400">—</span>
                      </TableCell>

                      {/* Service based vendor? */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <span className="text-gray-400">—</span>
                      </TableCell>

                      {/* COI Expiration Date */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <span className="text-gray-400">—</span>
                      </TableCell>

                      {/* Rate Vendor 1-10 */}
                      <TableCell className="border-r border-gray-200 cursor-pointer">
                        <span className="text-gray-400">—</span>
                      </TableCell>

                      {/* Sticky Kebab Menu - WITH HOVER */}
                      <TableCell
                        className={`sticky right-0 z-10 cursor-pointer border-l-2 border-gray-300 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] ${
                          isSelected
                            ? "bg-green-50 group-hover:bg-green-50"
                            : "bg-white group-hover:bg-gray-50"
                        }`}
                      >
                        <button className="text-gray-400 hover:text-gray-600">
                          <VendorActionsMenu
                          // vendorId={vendor.id}
                          // onEditStatus={(id) =>
                          //   console.log("Edit status", id)
                          // }
                          // onEditOwners={(id) =>
                          //   console.log("Edit owners", id)
                          // }
                          // onEditDepartment={(id) =>
                          //   console.log("Edit department", id)
                          // }
                          />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Results count */}
      {totalCount > 0 && (
        <div className="text-sm text-gray-500 text-center">
          1–{Math.min(100, totalCount)} of {totalCount} matching vendors
        </div>
      )}
    </div>
  );
}
