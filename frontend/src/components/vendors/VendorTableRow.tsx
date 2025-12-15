import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, PenSquare, CheckCircle2 } from "lucide-react";
import type { Vendor } from "@/types/vendor";
import { VendorActionsMenu } from "./VendorActionsMenu";
import {
  formatCurrency,
  formatDate,
  getPaymentMethodDisplay,
  getInitials,
} from "@/utils/vendorFormatters";

interface VendorTableRowProps {
  vendor: Vendor;
  isSelected: boolean;
  onSelectRow: (vendorId: number) => void;
}

// Table Rows Component
export function VendorTableRow({
  vendor,
  isSelected,
  onSelectRow,
}: VendorTableRowProps) {
  const [isOwnerHovered, setIsOwnerHovered] = useState(false);

  const cellClass = (extraClasses = "") =>
    `border-r border-gray-200 cursor-pointer ${extraClasses}`;

  const stickyClass = (position: string, extraClasses = "") =>
    `sticky ${position} z-20 cursor-pointer ${
      isSelected
        ? "bg-green-50 group-hover:bg-green-50"
        : "bg-white group-hover:bg-gray-50"
    } ${extraClasses}`;

  return (
    <TableRow
      className={`border-b border-gray-100 group ${
        isSelected ? "bg-green-50 hover:bg-green-50" : "hover:bg-gray-50"
      }`}
    >
      {/* Checkbox */}
      <TableCell
        className={stickyClass(
          "left-0",
          "border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] pl-6"
        )}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelectRow(vendor.id)}
        />
      </TableCell>

      {/* Vendor */}
      <TableCell
        className={stickyClass(
          "left-[80px]",
          "border-r-2 border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
        )}
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

      {/* Owner */}
      <TableCell
        className={cellClass("relative pl-10")}
        onMouseEnter={() => setIsOwnerHovered(true)}
        onMouseLeave={() => setIsOwnerHovered(false)}
      >
        {vendor.owner ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1 pr-8">
              <div className="w-6 h-6 rounded-full bg-pink-200 flex items-center justify-center text-xs font-medium flex-shrink-0">
                {getInitials(vendor.owner)}
              </div>
              <span className="text-sm truncate">{vendor.owner}</span>
            </div>
            {/* Absolute positioned edit button - no shifting */}
            {isOwnerHovered && (
              <button
                className="absolute right-2 text-gray-900 hover:text-gray-700"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                <PenSquare className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </TableCell>

      {/* Spend columns */}
      <TableCell className={cellClass("text-right font-medium")}>
        {formatCurrency(vendor.total_spend)}
      </TableCell>
      <TableCell className={cellClass("text-right text-gray-600")}>
        {formatCurrency(vendor.thirty_day_spend)}
      </TableCell>

      {/* Description */}
      <TableCell className={cellClass()}>
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
      <TableCell className={cellClass()}>
        {vendor.department || <span className="text-gray-400">—</span>}
      </TableCell>

      {/* Contract */}
      <TableCell className={cellClass()}>
        <button className="text-gray-400 hover:text-gray-600">
          <Upload className="h-4 w-4" />
        </button>
      </TableCell>

      {/* Location */}
      <TableCell className={cellClass()}>
        {vendor.location || <span className="text-gray-400">—</span>}
      </TableCell>

      {/* Creation date */}
      <TableCell className={cellClass("text-sm text-gray-600")}>
        {formatDate(vendor.creation_date)}
      </TableCell>

      {/* Payment type */}
      <TableCell className={cellClass("text-sm text-gray-600")}>
        {getPaymentMethodDisplay(vendor.payment_method)}
      </TableCell>

      {/* Status */}
      <TableCell className={cellClass()}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span className="text-sm capitalize">{vendor.status}</span>
          <button className="text-gray-900 hover:text-gray-700 flex-shrink-0">
            <PenSquare className="h-4 w-4" />
          </button>
        </div>
      </TableCell>

      {/* Default contact */}
      <TableCell className={cellClass()}>
        <span className="text-gray-400">—</span>
      </TableCell>

      {/* Tax details */}
      <TableCell className={cellClass()}>
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
      <TableCell className={cellClass()}>
        <span className="text-gray-400">—</span>
      </TableCell>

      {/* 1099 2025 */}
      <TableCell className={cellClass()}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-600">
            {vendor.vendor_1099_2025 || "—"}
          </span>
          <button className="text-gray-900 hover:text-gray-700 flex-shrink-0">
            <PenSquare className="h-4 w-4" />
          </button>
        </div>
      </TableCell>

      {/* 1099 2024 */}
      <TableCell className={cellClass()}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-600">
            {vendor.vendor_1099_2024 || "—"}
          </span>
          <button className="text-gray-900 hover:text-gray-700 flex-shrink-0">
            <PenSquare className="h-4 w-4" />
          </button>
        </div>
      </TableCell>

      {/* Remaining 10 empty columns */}
      {[...Array(10)].map((_, i) => (
        <TableCell key={i} className={cellClass()}>
          <span className="text-gray-400">—</span>
        </TableCell>
      ))}

      {/* Kebab menu */}
      <TableCell
        className={stickyClass(
          "right-0",
          "border-l-2 border-gray-300 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] pr-6"
        )}
      >
        <VendorActionsMenu
          vendorId={vendor.id}
          vendorName={vendor.name}
          currentStatus={vendor.status}
          currentOwner={vendor.owner || ""}
          currentDepartment={vendor.department || ""}
          onUpdate={() => window.location.reload()} // better use proper state management
        />
      </TableCell>
    </TableRow>
  );
}
