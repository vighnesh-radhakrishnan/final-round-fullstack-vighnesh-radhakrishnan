import { ArrowUp, ArrowDown } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface VendorTableHeaderProps {
  sortBy: string | null;
  sortOrder: "asc" | "desc";
  selectedCount: number;
  totalCount: number;
  onSort: (column: string) => void;
  onSelectAll: () => void;
}
// Table Header Component
export function VendorTableHeader({
  sortBy,
  sortOrder,
  selectedCount,
  totalCount,
  onSort,
  onSelectAll,
}: VendorTableHeaderProps) {
  const SortButton = ({
    column,
    children,
    align = "left",
  }: {
    column: string;
    children: React.ReactNode;
    align?: "left" | "right";
  }) => (
    <button
      onClick={() => onSort(column)}
      className={`flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded cursor-pointer ${
        align === "right" ? "ml-auto" : "w-full"
      }`}
    >
      {children}
      {sortBy === column &&
        (sortOrder === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        ))}
    </button>
  );

  return (
    <TableHeader>
      <TableRow className="border-b border-gray-200">
        <TableHead className="sticky left-0 z-30 bg-white w-[80px] text-gray-500 text-xs font-medium border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] pl-6">
          <Checkbox
            checked={totalCount > 0 && selectedCount === totalCount}
            onCheckedChange={onSelectAll}
          />
        </TableHead>

        <TableHead className="sticky left-[80px] z-30 bg-white text-gray-600 text-xs font-medium min-w-[250px] border-r-2 border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
          <SortButton column="name">Vendor</SortButton>
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[180px] pl-10">
          Owners
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium text-right border-r border-gray-200 min-w-[150px]">
          <SortButton column="total_spend" align="right">
            365-day spend
          </SortButton>
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium text-right border-r border-gray-200 min-w-[150px]">
          <SortButton column="thirty_day_spend" align="right">
            30-day spend
          </SortButton>
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[180px]">
          Description
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[180px]">
          <SortButton column="department">Department</SortButton>
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[120px]">
          Contract
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[180px]">
          Vendor owner location
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[150px]">
          <SortButton column="creation_date">Creation date</SortButton>
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[130px]">
          Payment type
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[180px]">
          <SortButton column="status">Vendor status</SortButton>
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[150px]">
          Default contact
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[150px]">
          Tax details
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[150px]">
          Tax verification
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[150px]">
          1099 vendor (2025)
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[150px]">
          1099 vendor (2024)
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[150px]">
          Contract start
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[150px]">
          Contract end
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[180px]">
          Last date to terminate
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[150px]">
          Net payment terms
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[150px]">
          SOC Reports
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[120px]">
          COI
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[180px]">
          Company Website Link
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[200px]">
          Service based vendor?
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[180px]">
          COI Expiration Date
        </TableHead>

        <TableHead className="text-gray-500 text-xs font-medium border-r border-gray-200 min-w-[150px]">
          Rate Vendor 1-10
        </TableHead>

        <TableHead className="sticky right-0 z-30 bg-white w-[60px] border-l-2 border-gray-300 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] pr-6"></TableHead>
      </TableRow>
    </TableHeader>
  );
}
