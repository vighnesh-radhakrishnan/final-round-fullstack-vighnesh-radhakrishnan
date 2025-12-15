import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

type VendorActionsMenuProps = {
  vendorId?: number;
  onEditStatus?: (id: number) => void;
  onEditOwners?: (id: number) => void;
  onEditDepartment?: (id: number) => void;
};

// Kebab Menu Select Component
export function VendorActionsMenu({}: VendorActionsMenuProps = {}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-gray-100 text-gray-500">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg p-2"
      >
        <DropdownMenuItem className="cursor-pointer text-sm text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100">
          Edit status
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer text-sm text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100">
          Edit owners
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer text-sm text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100">
          Edit department
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
