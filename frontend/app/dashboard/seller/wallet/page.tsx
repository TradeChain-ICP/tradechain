// app/dashboard/seller/wallet/page.tsx
'use client';

import { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  BarChart3,
  Zap,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CreditCard,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useContentPadding } from '@/contexts/sidebar-context';
import { useAuth } from '@/contexts/auth-context';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';

export default function SellerWalletPage() {
  const { toast } = useToast();
  const { contentPadding } = useContentPadding();
  const { user } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const walletData = {
    totalBalance: 2847.92,
    icpBalance: 2847.92,
    usdValue: 19935.44,
    pendingEarnings: 324.56,
    totalEarnings: 45231.0,
    escrowBalance: 156.78,
    tokens: [
      {
        symbol: 'ICP',
        name: 'Internet Computer',
        balance: 2847.92,
        usdValue: 19935.44,
        change24h: 2.5,
        color: '#29D0B0',
        allocation: 78,
      },
      {
        symbol: 'ckBTC',
        name: 'Chain Key Bitcoin',
        balance: 0.08,
        usdValue: 3440.0,
        change24h: -1.2,
        color: '#F7931A',
        allocation: 13,
      },
      {
        symbol: 'ckUSDC',
        name: 'Chain Key USDC',
        balance: 2300.0,
        usdValue: 2300.0,
        change24h: 0.1,
        color: '#2775CA',
        allocation: 9,
      },
    ],
  };

  const revenueData = [
    { date: 'Jan', revenue: 8420, orders: 15 },
    { date: 'Feb', revenue: 12890, orders: 23 },
    { date: 'Mar', revenue: 15200, orders: 28 },
    { date: 'Apr', revenue: 18450, orders: 34 },
    { date: 'May', revenue: 22300, orders: 41 },
    { date: 'Jun', revenue: 28800, orders: 52 },
    { date: 'Jul', revenue: 35009, orders: 67 },
  ];

  const totalPortfolioValue = walletData.tokens.reduce((sum, token) => sum + token.usdValue, 0);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user?.walletAddress || 'rdmx6-jaaaa-aaaah-qcaiq-cai');
    toast({
      title: 'Address Copied',
      description: 'Wallet address copied to clipboard.',
    });
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number.parseFloat(withdrawAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid withdrawal amount.',
        variant: 'destructive',
      });
      return;
    }

    if (!withdrawAddress) {
      toast({
        title: 'Missing Address',
        description: 'Please enter a withdrawal address.',
        variant: 'destructive',
      });
      return;
    }

    if (Number.parseFloat(withdrawAmount) > walletData.icpBalance) {
      toast({
        title: 'Insufficient Balance',
        description: 'Withdrawal amount exceeds available balance.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: 'Withdrawal Initiated',
        description: `Withdrawal of ${withdrawAmount} ICP has been initiated.`,
      });

      setWithdrawAmount('');
      setWithdrawAddress('');
      setIsWithdrawOpen(false);
    } catch (error) {
      toast({
        title: 'Withdrawal Failed',
        description: 'There was an error processing your withdrawal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    color = 'default',
  }: {
    icon: any;
    title: string;
    value: string;
    subtitle: string;
    trend?: number;
    color?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon
          className={`h-4 w-4 ${
            color === 'success'
              ? 'text-green-600'
              : color === 'warning'
              ? 'text-yellow-600'
              : color === 'primary'
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{balanceVisible ? value : '••••••'}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{subtitle}</span>
          {trend !== undefined && (
            <>
              {trend > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
                {trend > 0 ? '+' : ''}
                {trend}%
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Wallet</h1>
          <p className="text-muted-foreground">Manage your earnings and payment processing</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setBalanceVisible(!balanceVisible)}
            size="sm"
            className="bg-transparent"
          >
            {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">
              {balanceVisible ? 'Hide' : 'Show'} Balance
            </span>
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <RefreshCw className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Seller-specific Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={DollarSign}
          title="Total Earnings"
          value={`$${walletData.totalEarnings.toLocaleString()}`}
          subtitle="All-time sales revenue"
          trend={24.5}
          color="success"
        />

        <StatCard
          icon={Wallet}
          title="Available Balance"
          value={`${walletData.icpBalance.toFixed(2)} ICP`}
          subtitle={`≈ $${walletData.usdValue.toLocaleString()}`}
          trend={12.3}
          color="success"
        />

        <StatCard
          icon={Receipt}
          title="Pending Earnings"
          value={`${walletData.pendingEarnings.toFixed(2)} ICP`}
          subtitle="From recent sales"
          color="warning"
        />

        <StatCard
          icon={CreditCard}
          title="In Escrow"
          value={`${walletData.escrowBalance.toFixed(2)} ICP`}
          subtitle="Protected transactions"
          color="primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Payment Address */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Payment Address
            </CardTitle>
            <CardDescription>
              Your ICP wallet address for receiving customer payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={user?.walletAddress || 'rdmx6-jaaaa-aaaah-qcaiq-cai'}
                readOnly
                className="font-mono text-sm flex-1"
              />
              <Button variant="outline" onClick={handleCopyAddress} className="bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-700">
                    <p className="font-medium">Auto-Settlement Enabled</p>
                    <p>Payments are automatically settled to your wallet</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">
                      Connected via {user?.authMethod === 'nfid' ? 'NFID' : 'Internet Identity'}
                    </p>
                    <p>Secure blockchain authentication</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full h-12 justify-start" onClick={() => setIsWithdrawOpen(true)}>
                <ArrowUpRight className="h-5 w-5 mr-2" />
                Withdraw Earnings
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 justify-start bg-transparent"
                asChild
              >
                <a href="#payment-settings">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Settings
                </a>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 justify-start bg-transparent"
                asChild
              >
                <a href="/dashboard/seller/analytics">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Analytics
                </a>
              </Button>
            </div>

            {walletData.pendingEarnings > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    {walletData.pendingEarnings.toFixed(2)} ICP pending from recent sales
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Performance</CardTitle>
              <CardDescription>
                Your sales revenue and order volume over the last 7 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="revenue" orientation="left" />
                    <YAxis yAxisId="orders" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'revenue' ? `$${value.toLocaleString()}` : `${value} orders`,
                        name === 'revenue' ? 'Revenue' : 'Orders',
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area
                      yAxisId="revenue"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                    />
                    <Line
                      yAxisId="orders"
                      type="monotone"
                      dataKey="orders"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Token Holdings */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Token Holdings</CardTitle>
              <CardDescription>Tokens received from customer payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walletData.tokens.map((token) => (
                  <div
                    key={token.symbol}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: token.color + '20' }}
                      >
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: token.color }}
                        ></div>
                      </div>
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {balanceVisible
                          ? `${token.balance.toFixed(token.symbol === 'ckUSDC' ? 2 : 4)} ${
                              token.symbol
                            }`
                          : '••••••'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {balanceVisible ? `$${token.usdValue.toLocaleString()}` : '••••••'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {token.change24h > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          token.change24h > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {token.change24h > 0 ? '+' : ''}
                        {token.change24h}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest payment activity</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent">
                <ExternalLink className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSellerTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === 'sale'
                            ? 'bg-green-100 text-green-600'
                            : transaction.type === 'withdrawal'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {transaction.type === 'sale' ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : transaction.type === 'withdrawal' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <CreditCard className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">{transaction.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-medium ${
                          transaction.type === 'sale'
                            ? 'text-green-600'
                            : transaction.type === 'withdrawal'
                            ? 'text-blue-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {transaction.type === 'sale'
                          ? '+'
                          : transaction.type === 'withdrawal'
                          ? '-'
                          : ''}
                        {transaction.amount} {transaction.token}
                      </div>
                      <Badge variant={getTransactionStatus(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={walletData.tokens}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="allocation"
                    >
                      {walletData.tokens.map((token, index) => (
                        <Cell key={`cell-${index}`} fill={token.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {walletData.tokens.map((token) => (
                  <div key={token.symbol} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: token.color }}
                      ></div>
                      <span className="font-medium">{token.symbol}</span>
                    </div>
                    <span className="text-muted-foreground">{token.allocation}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Business Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Business Insights
              </CardTitle>
              <CardDescription>AI-powered recommendations for your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-700 text-sm">Revenue Opportunity</span>
                </div>
                <p className="text-xs text-green-600">
                  Your gold products are trending. Consider increasing inventory.
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-700 text-sm">Payment Optimization</span>
                </div>
                <p className="text-xs text-blue-600">
                  Enable multi-token payments to attract more customers.
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-amber-700 text-sm">Tax Consideration</span>
                </div>
                <p className="text-xs text-amber-600">
                  Track crypto transactions for tax reporting purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Sales</span>
                <span className="font-medium">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Sale</span>
                <span className="font-medium">$508</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Largest Sale</span>
                <span className="font-medium">$3,480</span>
              </div>

              <div className="pt-3 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Settlement Rate</span>
                    <span>98.5%</span>
                  </div>
                  <Progress value={98.5} className="h-2" />
                  <p className="text-xs text-muted-foreground">Excellent payment processing rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Earnings</DialogTitle>
            <DialogDescription>Transfer your earnings to an external wallet</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-address">Destination Address</Label>
              <Input
                id="withdraw-address"
                placeholder="Enter ICP address"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ICP)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Available: {walletData.icpBalance.toFixed(2)} ICP
              </p>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-sm text-amber-700">
                Network fee: 0.0001 ICP • Processing time: 1-2 minutes
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWithdraw} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                'Withdraw'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function
function getTransactionStatus(status: string) {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Processing':
      return 'outline';
    case 'Failed':
      return 'destructive';
    default:
      return 'outline';
  }
}

// Mock data for seller transactions
const mockSellerTransactions = [
  {
    id: '1',
    type: 'sale',
    description: 'Gold Bullion Sale',
    amount: '432.10',
    token: 'ICP',
    date: 'Jul 25, 2024',
    status: 'Completed',
  },
  {
    id: '2',
    type: 'sale',
    description: 'Silver Bars Sale',
    amount: '156.75',
    token: 'ICP',
    date: 'Jul 24, 2024',
    status: 'Completed',
  },
  {
    id: '3',
    type: 'withdrawal',
    description: 'Earnings Withdrawal',
    amount: '800.00',
    token: 'ICP',
    date: 'Jul 22, 2024',
    status: 'Completed',
  },
  {
    id: '4',
    type: 'sale',
    description: 'Platinum Coins Sale',
    amount: '1250.50',
    token: 'ICP',
    date: 'Jul 20, 2024',
    status: 'Processing',
  },
  {
    id: '5',
    type: 'escrow',
    description: 'Escrow Release',
    amount: '89.30',
    token: 'ICP',
    date: 'Jul 18, 2024',
    status: 'Completed',
  },
];
