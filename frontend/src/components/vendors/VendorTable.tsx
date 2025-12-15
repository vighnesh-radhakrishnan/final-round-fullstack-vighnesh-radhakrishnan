import { useState, useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Search,
  X,
  Grid3x3,
  Download,
  AlignJustify,
  ArrowRight,
} from "lucide-react";
import type { Vendor } from "@/types/vendor";
import { vendorApi } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import { VendorTableHeader } from "./VendorTableHeader";
import { VendorTableRow } from "./VendorTableRow";
import { VendorActionsMenu } from "./VendorActionsMenu";
import { Pagination } from "./Pagination";

// Main Table Component
export default function VendorTable() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const tableScrollRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchVendors();
  }, [debouncedSearchTerm, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    const tableScroll = tableScrollRef.current;
    const scrollbar = scrollbarRef.current;
    if (!tableScroll || !scrollbar) return;

    const handleTableScroll = () =>
      (scrollbar.scrollLeft = tableScroll.scrollLeft);
    const handleScrollbarScroll = () =>
      (tableScroll.scrollLeft = scrollbar.scrollLeft);

    tableScroll.addEventListener("scroll", handleTableScroll);
    scrollbar.addEventListener("scroll", handleScrollbarScroll);

    return () => {
      tableScroll.removeEventListener("scroll", handleTableScroll);
      scrollbar.removeEventListener("scroll", handleScrollbarScroll);
    };
  }, [vendors]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorApi.getVendors({
        search: debouncedSearchTerm || undefined,
        sort_by: sortBy || undefined,
        sort_order: sortOrder,
        page: currentPage,
        limit: itemsPerPage,
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

  const handleRowSelect = (vendorId: number) => {
    const newSelected = new Set(selectedRows);
    newSelected.has(vendorId)
      ? newSelected.delete(vendorId)
      : newSelected.add(vendorId);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.size === vendors.length
        ? new Set()
        : new Set(vendors.map((v) => v.id))
    );
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to load vendors
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          There was a problem connecting to the server.
        </p>
        <button
          onClick={fetchVendors}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FCFBFA]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#FCFBFA]">
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
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {[
            { icon: AlignJustify, label: "Group by" },
            { icon: Grid3x3, label: "Customize columns" },
            { icon: Download, label: "Export" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="relative group">
              <button className="p-1.5 hover:bg-gray-100 rounded-full border border-gray-400">
                <Icon className="h-3.5 w-3.5 text-gray-600" />
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white border border-gray-300 text-gray-900 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 flex flex-col bg-white border-t border-gray-200">
        <div
          ref={tableScrollRef}
          className="flex-1 overflow-x-auto overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 280px)" }}
        >
          <Table>
            <VendorTableHeader
              sortBy={sortBy}
              sortOrder={sortOrder}
              selectedCount={selectedRows.size}
              totalCount={vendors.length}
              onSort={handleSort}
              onSelectAll={handleSelectAll}
            />

            <TableBody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <TableRow key={i} className="border-b border-gray-100">
                    <TableCell className="sticky left-0 z-20 bg-white border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] pl-6">
                      <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell className="sticky left-[80px] z-20 bg-white border-r-2 border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
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
                    <TableCell className="sticky right-0 z-20 bg-white border-l-2 border-gray-300 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] pr-6" />
                  </TableRow>
                ))
              ) : vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={28} className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-300 mb-4 mx-auto" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No vendors found
                    </h3>
                    <p className="text-sm text-gray-500">
                      {searchTerm
                        ? `No results for "${searchTerm}"`
                        : "No vendors available."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                vendors.map((vendor) => (
                  <VendorTableRow
                    key={vendor.id}
                    vendor={vendor}
                    isSelected={selectedRows.has(vendor.id)}
                    onSelectRow={handleRowSelect}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Scrollbar */}
        <div
          ref={scrollbarRef}
          className="overflow-x-auto overflow-y-hidden bg-[#FCFBFA]"
          style={{ height: "11px", overscrollBehaviorX: "none" }}
        >
          <div
            style={{
              width: tableScrollRef.current?.scrollWidth || "100%",
              height: "1px",
            }}
          />
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            setSelectedRows(new Set());
          }}
        />
      </div>

      {/* Selection Bar */}
      {selectedRows.size > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 border-t border-gray-300 py-3 px-6 z-50"
          style={{ backgroundColor: "rgb(210, 206, 203)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedRows(new Set())}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-gray-900 underline">
                {selectedRows.size} vendor{selectedRows.size > 1 ? "s" : ""}{" "}
                selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <VendorActionsMenu showMenu={false} />
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-900">
                Request information
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
