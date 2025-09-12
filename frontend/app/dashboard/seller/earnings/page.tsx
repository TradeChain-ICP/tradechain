// app/dashboard/seller/earnings/page.tsx
"use client"

import { useState } from "react"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useContentPadding } from "@/contexts/sidebar-context"

export default function EarningsPage() {
  const { toast } = useToast();
  const { contentPadding } = useContentPadding();
  const [timeframe, setTimeframe] = useState('30d');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawMethod) {
      toast({
        title: 'Missing Information',
        description: 'Please enter withdrawal amount and select a method.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: 'Withdrawal Initiated',
        description: `Withdrawal of $${withdrawAmount} has been initiated. Processing time: 1-3 business days.`,
      });
      setWithdrawAmount('');
      setWithdrawMethod('');
    } catch (error) {
      toast({
        title: 'Withdrawal Failed',
        description: 'Failed to process withdrawal.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings & Payouts</h1>
          <p className="text-muted-foreground">Track your revenue and manage withdrawals</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">$24,580</p>
                <p className="text-xs text-muted-foreground mt-1">Ready for withdrawal</p>
              </div>
              <Wallet className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Earnings</p>
                <p className="text-2xl font-bold text-amber-600">$8,420</p>
                <p className="text-xs text-muted-foreground mt-1">Processing orders</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">$127,450</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600">+18.2%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">$15,680</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600">+12.5%</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Your revenue performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="pending"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest earnings and payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactionHistory.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === 'earning'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {transaction.type === 'earning' ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium truncate">{transaction.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {transaction.date} • {transaction.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div
                        className={`font-medium ${
                          transaction.type === 'earning' ? 'text-green-600' : 'text-blue-600'
                        }`}
                      >
                        {transaction.type === 'earning' ? '+' : '-'}${transaction.amount}
                      </div>
                      <Badge variant={getTransactionStatusVariant(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Earnings Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Breakdown</CardTitle>
              <CardDescription>Revenue sources and fee breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earningsBreakdown.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium">{item.category}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-bold">${item.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Withdrawal */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Withdrawal</CardTitle>
              <CardDescription>Withdraw your available earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Available Balance</span>
                  <span className="font-bold text-green-900">$24,580</span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Wallet className="h-4 w-4 mr-2" />
                    Withdraw Funds
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Withdraw Earnings</DialogTitle>
                    <DialogDescription>
                      Choose your withdrawal method and amount. Processing time varies by method.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Withdrawal Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Available: $24,580</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="method">Withdrawal Method</Label>
                      <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Bank Transfer (1-3 days)</SelectItem>
                          <SelectItem value="icp">ICP Wallet (Instant)</SelectItem>
                          <SelectItem value="paypal">PayPal (1-2 days)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                      <p className="text-sm text-blue-700">
                        <strong>Note:</strong> Withdrawals are processed within 1-3 business days
                        depending on the method selected.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleWithdraw} disabled={isLoading}>
                      {isLoading ? 'Processing...' : 'Confirm Withdrawal'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Minimum withdrawal: $50</p>
                <p>• No withdrawal fees</p>
                <p>• Instant ICP transfers</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payout preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 bg-muted rounded-full flex-shrink-0">
                      {method.type === 'bank' ? (
                        <CreditCard className="h-4 w-4" />
                      ) : (
                        <Wallet className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium">{method.name}</h4>
                      <p className="text-sm text-muted-foreground truncate max-w-[120px]">
                        {method.details}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    {method.default && <Badge variant="outline">Default</Badge>}
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* Tax Information */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Information</CardTitle>
              <CardDescription>Important tax-related details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>YTD Earnings</span>
                  <span className="font-medium">$127,450</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax Documents</span>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-blue-600">
                    Download 1099
                  </Button>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                <p className="text-sm text-amber-700">
                  <strong>Tax Season Reminder:</strong> Your 1099 forms will be available by January
                  31st for the previous tax year.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key financial indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Avg Monthly Earnings</span>
                  <span className="font-medium">$10,621</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Best Month</span>
                  <span className="font-medium">$18,450 (June)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Growth Rate</span>
                  <span className="font-medium text-green-600">+18.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Transactions</span>
                  <span className="font-medium">342</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <h4 className="font-medium mb-2">Earnings Forecast</h4>
                <div className="h-[100px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastData}>
                      <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2} />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Projected next month: <span className="font-medium text-green-600">$17,200</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper function
function getTransactionStatusVariant(status: string) {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Processing':
      return 'outline';
    default:
      return 'outline';
  }
}

// Mock data
const earningsData = [
  { date: 'Jan', earnings: 8500, pending: 1200 },
  { date: 'Feb', earnings: 9200, pending: 1500 },
  { date: 'Mar', earnings: 10800, pending: 1800 },
  { date: 'Apr', earnings: 12400, pending: 2100 },
  { date: 'May', earnings: 14200, pending: 2400 },
  { date: 'Jun', earnings: 18450, pending: 2800 },
  { date: 'Jul', earnings: 15680, pending: 3200 },
];

const transactionHistory = [
  {
    id: '1',
    type: 'earning',
    description: 'Order #ORD-7292 - Gold Bullion Sale',
    amount: '3,900.00',
    date: 'Jul 25, 2024',
    method: 'ICP Escrow',
    status: 'Completed',
  },
  {
    id: '2',
    type: 'withdrawal',
    description: 'Bank Transfer Withdrawal',
    amount: '5,000.00',
    date: 'Jul 23, 2024',
    method: 'Bank Transfer',
    status: 'Processing',
  },
  {
    id: '3',
    type: 'earning',
    description: 'Order #ORD-7291 - Silver Bars Sale',
    amount: '280.00',
    date: 'Jul 22, 2024',
    method: 'Credit Card',
    status: 'Completed',
  },
  {
    id: '4',
    type: 'earning',
    description: 'Order #ORD-7290 - Platinum Coin Sale',
    amount: '980.00',
    date: 'Jul 20, 2024',
    method: 'ICP Escrow',
    status: 'Pending',
  },
  {
    id: '5',
    type: 'withdrawal',
    description: 'ICP Wallet Transfer',
    amount: '2,500.00',
    date: 'Jul 18, 2024',
    method: 'ICP Wallet',
    status: 'Completed',
  },
];

const earningsBreakdown = [
  {
    category: 'Product Sales',
    description: 'Revenue from commodity sales',
    amount: 120450,
    percentage: 94.5,
  },
  {
    category: 'Shipping Fees',
    description: 'Customer shipping charges',
    amount: 4200,
    percentage: 3.3,
  },
  {
    category: 'Premium Listings',
    description: 'Featured product fees collected',
    amount: 2800,
    percentage: 2.2,
  },
];

const paymentMethods = [
  {
    type: 'bank',
    name: 'Bank',
    details: '****1234',
    default: true,
  },
  {
    type: 'icp',
    name: 'ICP Wallet',
    details: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
    default: false,
  },
  {
    type: 'paypal',
    name: 'PayPal',
    details: 'seller@email.com',
    default: false,
  },
];

const forecastData = [
  { month: 'Aug', forecast: 17200 },
  { month: 'Sep', forecast: 18500 },
  { month: 'Oct', forecast: 19800 },
  { month: 'Nov', forecast: 21200 },
  { month: 'Dec', forecast: 23500 },
];