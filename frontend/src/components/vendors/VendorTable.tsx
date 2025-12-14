import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileText, Download } from "lucide-react";
import type { Vendor } from "@/types/vendor";
import { vendorApi } from "@/services/api";

export default function VendorTable() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorApi.getVendors();
      setVendors(response.vendors);
      setError(null);
    } catch (err) {
      setError("Failed to load vendors");
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading vendors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <Checkbox />
            </TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Owners</TableHead>
            <TableHead className="text-right">365-day spend</TableHead>
            <TableHead className="text-right">30-day spend</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Contract</TableHead>
            <TableHead>Vendor owner location</TableHead>
            <TableHead>Creation date</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={12}
                className="text-center text-gray-500 py-8"
              >
                No vendors found
              </TableCell>
            </TableRow>
          ) : (
            vendors.map((vendor) => (
              <TableRow key={vendor.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox />
                </TableCell>
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
                <TableCell className="text-right font-medium">
                  {formatCurrency(vendor.total_spend)}
                </TableCell>
                <TableCell className="text-right text-gray-600">
                  {formatCurrency(vendor.thirty_day_spend)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {vendor.category || "—"}
                </TableCell>
                <TableCell>
                  {vendor.department || (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FileText className="h-4 w-4" />
                  </button>
                </TableCell>
                <TableCell>
                  {vendor.location || <span className="text-gray-400">—</span>}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(vendor.creation_date)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(vendor.status)}
                    <span className="text-sm text-gray-600">
                      {getPaymentMethodDisplay(vendor.payment_method)}
                    </span>
                  </div>
                </TableCell>
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
  );
}
