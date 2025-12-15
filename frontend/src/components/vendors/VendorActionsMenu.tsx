import { useState } from "react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditVendorModal } from "./EditVendorModal";
import { STATUS_OPTIONS } from "@/constants/vendorConstants";
import { vendorApi } from "@/services/api";

interface VendorActionsMenuProps {
  vendorId?: number;
  vendorName?: string;
  currentStatus?: string;
  currentOwner?: string;
  currentDepartment?: string;
  onUpdate?: () => void;
  showMenu?: boolean;
}

export function VendorActionsMenu({
  vendorId,
  vendorName = "Test",
  currentStatus = "active",
  currentOwner = "",
  currentDepartment = "",
  onUpdate,
  showMenu = true,
}: VendorActionsMenuProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editType, setEditType] = useState<"status" | "owner" | "department">(
    "status"
  );

  const handleOpenEditModal = (type: "status" | "owner" | "department") => {
    setEditType(type);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (value: string) => {
    if (!vendorId) {
      console.log("Demo mode: Would update", editType, "to", value);
      return;
    }

    try {
      const updateData: Record<string, string> = {};
      updateData[editType] = value;

      await vendorApi.updateVendor(vendorId, updateData);
      onUpdate?.();
    } catch (error) {
      console.error("Error updating vendor:", error);
      throw error;
    }
  };

  const getModalConfig = () => {
    switch (editType) {
      case "status":
        return {
          title: `Edit status for ${vendorName}`,
          fieldName: "Status (required)",
          fieldType: "select" as const,
          currentValue: currentStatus,
          options: STATUS_OPTIONS,
          placeholder: "Select status",
        };
      case "owner":
        return {
          title: `Edit owner for ${vendorName}`,
          fieldName: "Owner",
          fieldType: "input" as const,
          currentValue: currentOwner || "",
          placeholder: "Enter owner name",
        };
      case "department":
        return {
          title: `Edit department for ${vendorName}`,
          fieldName: "Department",
          fieldType: "input" as const,
          currentValue: currentDepartment || "",
          placeholder: "Enter department name",
        };
    }
  };

  const modalConfig = getModalConfig();

  if (!showMenu) {
    return (
      <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
        <MoreVertical className="h-4 w-4 text-gray-600" />
      </button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white">
          <DropdownMenuItem
            onClick={() => handleOpenEditModal("status")}
            className="cursor-pointer"
          >
            Edit status
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleOpenEditModal("owner")}
            className="cursor-pointer"
          >
            Edit owner
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleOpenEditModal("department")}
            className="cursor-pointer"
          >
            Edit department
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditVendorModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title={modalConfig.title}
        fieldName={modalConfig.fieldName}
        fieldType={modalConfig.fieldType}
        currentValue={modalConfig.currentValue}
        options={modalConfig.options}
        placeholder={modalConfig.placeholder}
        onSave={handleSaveEdit}
      />
    </>
  );
}
