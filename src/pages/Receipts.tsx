import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { deleteReceipt, getReceipts } from "@/services/receiptsService";
import type { Receipt } from "@/services/receiptsService";
import { ReceiptViewDialog } from "@/components/ReceiptViewDialog";
import { ReceiptDialog } from "@/components/ReceiptDialog";
import { Plus, Search, Eye, Download, Trash, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { generateReceiptPDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";

export default function Receipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<Receipt | undefined>();
  const [_, setFilteredReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      const data = await getReceipts();
      setReceipts(data);
    } catch (error) {
      console.error("Error loading receipts:", error);
      toast.error("Failed to load receipts");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (receipt: Receipt) => {
    try {
      await generateReceiptPDF(receipt);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const handleDeleteReceipt = async (receiptId: string) => {
    try {
      await deleteReceipt(receiptId); // 🔹 mock service call
      setFilteredReceipts((prev) => prev.filter((r) => r.id !== receiptId));
      toast.success("Receipt deleted successfully");
    } catch (error) {
      console.error("Error deleting receipt:", error);
      toast.error("Failed to delete receipt");
    }
  };

  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Receipts
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track payment receipts
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Receipt
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Receipts</CardTitle>
          <CardDescription>Payment receipts for invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search receipts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Invoice #
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Customer
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Payment Date
                  </TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Payment Method
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.length > 0 ? (
                  filteredReceipts.map((receipt) => (
                    <TableRow
                      key={receipt.id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {receipt.receiptNumber}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {receipt.invoiceNumber}
                      </TableCell>

                      <TableCell className="hidden lg:table-cell truncate max-w-[180px]">
                        {receipt.customerName}
                      </TableCell>

                      <TableCell className="hidden sm:table-cell">
                        {receipt.paymentDate}
                      </TableCell>

                      <TableCell className="font-semibold">
                        {formatCurrency(receipt.amount)}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={
                            receipt.paymentMethod === "cash"
                              ? "default"
                              : receipt.paymentMethod === "bank_transfer"
                              ? "outline"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {receipt.paymentMethod.replace("_", " ")}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="View Receipt"
                            onClick={() => {
                              setViewingReceipt(receipt);
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button> */}

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hidden sm:flex"
                            title="Download PDF"
                            onClick={() => handleDownloadPDF(receipt)}
                          >
                            <Download className="h-4 w-4 text-green-600" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Delete Receipt"
                            onClick={() => handleDeleteReceipt(receipt.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-gray-500"
                    >
                      No receipts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <ReceiptDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={loadReceipts}
      />
      <ReceiptViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        receipt={viewingReceipt || null}
      />
    </div>
  );
}
