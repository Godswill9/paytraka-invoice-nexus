import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRevenueSummary, getInvoiceStatusSummary, getTopCustomers } from "@/services/reportsService";
import type { RevenueSummary, InvoiceStatusSummary, TopCustomer } from "@/services/reportsService";
import { formatCurrency } from "@/utils/currency";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function Reports() {
  const [revenueSummary, setRevenueSummary] = useState<RevenueSummary | null>(null);
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatusSummary | null>(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revenue, status, customers] = await Promise.all([
          getRevenueSummary(),
          getInvoiceStatusSummary(),
          getTopCustomers(),
        ]);
        setRevenueSummary(revenue);
        setInvoiceStatus(status);
        setTopCustomers(customers);
      } catch (error) {
        console.error("Error fetching reports data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Detailed analytics and insights</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs sm:text-sm">Total Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(revenueSummary?.totalRevenue || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs sm:text-sm">Paid</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-success">{formatCurrency(revenueSummary?.paidRevenue || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs sm:text-sm">Unpaid</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-warning">{formatCurrency(revenueSummary?.unpaidRevenue || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs sm:text-sm">Overdue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-destructive">{formatCurrency(revenueSummary?.overdueRevenue || 0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Revenue Trend</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Monthly revenue over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueSummary?.monthlyRevenue || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Invoice Status Breakdown</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Count by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-xl sm:text-2xl font-bold">{invoiceStatus?.total || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Paid</span>
                <span className="text-base sm:text-lg font-semibold text-success">{invoiceStatus?.paid || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Sent</span>
                <span className="text-base sm:text-lg font-semibold">{invoiceStatus?.sent || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Overdue</span>
                <span className="text-base sm:text-lg font-semibold text-destructive">{invoiceStatus?.overdue || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Draft</span>
                <span className="text-base sm:text-lg font-semibold text-muted-foreground">{invoiceStatus?.draft || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Top 3 Customers</CardTitle>
            <CardDescription className="text-xs sm:text-sm">By total revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topCustomers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="customerName" type="category" stroke="hsl(var(--muted-foreground))" width={100} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="totalRevenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
