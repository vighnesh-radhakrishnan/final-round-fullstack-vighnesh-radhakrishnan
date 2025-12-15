import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

type VendorActionsMenuProps = {
  vendorId: number;
  onEditStatus?: (id: number) => void;
  onEditOwners?: (id: number) => void;
  onEditDepartment?: (id: number) => void;
};

export function VendorActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-gray-100 text-gray-500">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="cursor-pointer">
          Edit status
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          Edit owners
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          Edit department
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
