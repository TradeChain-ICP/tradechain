// app/dashboard/buyer/wallet/page.tsx
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
  DialogTrigger,
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
  Legend,
} from 'recharts';

export default function WalletPage() {
  const { toast } = useToast();
  const { contentPadding } = useContentPadding();
  const { user } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [isLoading, setIsLoading] = useState(false);

  const walletData = {
    totalBalance: 1245.67,
    icpBalance: 1245.67,
    usdValue: 8719.69,
    lockedBalance: 62.28,
    pendingTransactions: 2,
    tokens: [
      {
        symbol: 'ICP',
        name: 'Internet Computer',
        balance: 1245.67,
        usdValue: 8719.69,
        change24h: 2.5,
        color: '#29D0B0',
        allocation: 45,
      },
      {
        symbol: 'ckBTC',
        name: 'Chain Key Bitcoin',
        balance: 0.15,
        usdValue: 6450.0,
        change24h: -1.2,
        color: '#F7931A',
        allocation: 33,
      },
      {
        symbol: 'ckETH',
        name: 'Chain Key Ethereum',
        balance: 2.8,
        usdValue: 7840.0,
        change24h: 3.8,
        color: '#627EEA',
        allocation: 15,
      },
      {
        symbol: 'ckUSDC',
        name: 'Chain Key USDC',
        balance: 5000.0,
        usdValue: 5000.0,
        change24h: 0.1,
        color: '#2775CA',
        allocation: 7,
      },
    ],
  };

  const performanceData = [
    { date: 'Jan', value: 15420 },
    { date: 'Feb', value: 16890 },
    { date: 'Mar', value: 18200 },
    { date: 'Apr', value: 19450 },
    { date: 'May', value: 21300 },
    { date: 'Jun', value: 22800 },
    { date: 'Jul', value: 28009 },
  ];

  const totalPortfolioValue = walletData.tokens.reduce((sum, token) => sum + token.usdValue, 0);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user?.walletAddress || 'rdmx6-jaaaa-aaaah-qcaiq-cai');
    toast({
      title: 'Address Copied',
      description: 'Wallet address copied to clipboard.',
    });
  };

  const handleTransaction = async () => {
    const amount = transactionType === 'deposit' ? depositAmount : withdrawAmount;

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }

    if (transactionType === 'withdraw' && !withdrawAddress) {
      toast({
        title: 'Missing Address',
        description: 'Please enter a withdrawal address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: `${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} Initiated`,
        description: `${
          transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'
        } of ${amount} ICP has been initiated.`,
      });

      setDepositAmount('');
      setWithdrawAmount('');
      setWithdrawAddress('');
      setIsTransactionOpen(false);
    } catch (error) {
      toast({
        title: 'Transaction Failed',
        description: 'There was an error processing your transaction. Please try again.',
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
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">Manage your digital assets and transactions</p>
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

      {/* Portfolio Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={Wallet}
          title="Total Portfolio"
          value={`${totalPortfolioValue.toLocaleString()}`}
          subtitle="+12.5% from last month"
          trend={12.5}
          color="success"
        />

        <StatCard
          icon={DollarSign}
          title="ICP Balance"
          value={`${walletData.icpBalance.toFixed(2)} ICP`}
          subtitle={`≈ ${walletData.usdValue.toLocaleString()}`}
          trend={2.5}
          color="success"
        />

        <StatCard
          icon={TrendingUp}
          title="24h Change"
          value="+2.5%"
          subtitle="+$218.50"
          trend={2.5}
          color="success"
        />

        <StatCard
          icon={BarChart3}
          title="Available Balance"
          value={`${(walletData.icpBalance * 0.95).toFixed(2)} ICP`}
          subtitle="Ready for trading"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Wallet Address Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Address
            </CardTitle>
            <CardDescription>Your ICP wallet address for receiving funds</CardDescription>
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
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">
                    Connected via {user?.authMethod === 'nfid' ? 'NFID' : 'Internet Identity'}
                  </p>
                  <p>Your wallet is securely connected and ready for transactions</p>
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
            <div className="grid grid-cols-2 gap-3">
              <Button
                className="h-20 flex-col gap-2"
                onClick={() => {
                  setTransactionType('deposit');
                  setIsTransactionOpen(true);
                }}
              >
                <ArrowDownLeft className="h-6 w-6" />
                <span>Deposit</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent"
                onClick={() => {
                  setTransactionType('withdraw');
                  setIsTransactionOpen(true);
                }}
              >
                <ArrowUpRight className="h-6 w-6" />
                <span>Withdraw</span>
              </Button>
            </div>

            {walletData.pendingTransactions > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    {walletData.pendingTransactions} pending transaction
                    {walletData.pendingTransactions > 1 ? 's' : ''}
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
          {/* Portfolio Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Your wallet value over the last 7 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value.toLocaleString()}`, 'Portfolio Value']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#29D0B0"
                      strokeWidth={3}
                      dot={{ fill: '#29D0B0', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Token Holdings</CardTitle>
              <CardDescription>Your current token portfolio and performance</CardDescription>
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
                        {balanceVisible ? `${token.usdValue.toLocaleString()}` : '••••••'}
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

          {/* Transaction History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest wallet activity</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent">
                <ExternalLink className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === 'deposit'
                            ? 'bg-green-100 text-green-600'
                            : transaction.type === 'withdraw'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {transaction.type === 'deposit' ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : transaction.type === 'withdraw' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
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
                          transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'deposit' ? '+' : '-'}
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
          {/* Portfolio Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Distribution</CardTitle>
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
                    <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
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

          {/* AI Investment Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Insights
              </CardTitle>
              <CardDescription>Personalized recommendations for your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-700 text-sm">
                    Diversification Opportunity
                  </span>
                </div>
                <p className="text-xs text-green-600">
                  Consider adding agricultural commodities to balance your precious metals holdings.
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-700 text-sm">Market Timing</span>
                </div>
                <p className="text-xs text-blue-600">
                  Gold prices trending upward. Good time to increase position.
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-amber-700 text-sm">Risk Assessment</span>
                </div>
                <p className="text-xs text-amber-600">
                  Portfolio has moderate risk. Consider stable assets like timber.
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
                <span className="text-sm text-muted-foreground">Total Transactions</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Transaction</span>
                <span className="font-medium">$1,250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Largest Transaction</span>
                <span className="font-medium">$4,180</span>
              </div>

              <div className="pt-3 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Locked Balance</span>
                    <span>{walletData.lockedBalance.toFixed(2)} ICP</span>
                  </div>
                  <Progress value={5} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    5% of total balance locked in trades
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction Dialog */}
      <Dialog open={isTransactionOpen} onOpenChange={setIsTransactionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {transactionType === 'deposit' ? 'Deposit ICP' : 'Withdraw ICP'}
            </DialogTitle>
            <DialogDescription>
              {transactionType === 'deposit'
                ? 'Add ICP tokens to your wallet for trading'
                : 'Send ICP tokens to an external wallet'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {transactionType === 'withdraw' && (
              <div className="space-y-2">
                <Label htmlFor="withdraw-address">Destination Address</Label>
                <Input
                  id="withdraw-address"
                  placeholder="Enter ICP address"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ICP)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={transactionType === 'deposit' ? depositAmount : withdrawAmount}
                onChange={(e) =>
                  transactionType === 'deposit'
                    ? setDepositAmount(e.target.value)
                    : setWithdrawAmount(e.target.value)
                }
              />
              {transactionType === 'withdraw' && (
                <p className="text-xs text-muted-foreground">
                  Available: {walletData.icpBalance.toFixed(2)} ICP
                </p>
              )}
            </div>

            <div
              className={`p-3 rounded-lg ${
                transactionType === 'deposit'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-amber-50 border border-amber-200'
              }`}
            >
              <p
                className={`text-sm ${
                  transactionType === 'deposit' ? 'text-blue-700' : 'text-amber-700'
                }`}
              >
                {transactionType === 'deposit'
                  ? `Send ICP to your wallet address: ${
                      user?.walletAddress || 'rdmx6-jaaaa-aaaah-qcaiq-cai'
                    }`
                  : 'Network fee: 0.0001 ICP • Processing time: 1-2 minutes'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransactionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransaction} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : transactionType === 'deposit' ? (
                'Generate Address'
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
    case 'Failed':
      return 'destructive';
    default:
      return 'outline';
  }
}

// Mock data
const mockTransactions = [
  {
    id: '1',
    type: 'purchase',
    description: 'Gold Bullion Purchase',
    amount: '278.57',
    token: 'ICP',
    date: 'Jul 25, 2024',
    status: 'Completed',
  },
  {
    id: '2',
    type: 'deposit',
    description: 'ICP Deposit',
    amount: '500.00',
    token: 'ICP',
    date: 'Jul 24, 2024',
    status: 'Completed',
  },
  {
    id: '3',
    type: 'purchase',
    description: 'Silver Bars Purchase',
    amount: '40.00',
    token: 'ICP',
    date: 'Jul 22, 2024',
    status: 'Completed',
  },
  {
    id: '4',
    type: 'withdraw',
    description: 'ICP Withdrawal',
    amount: '100.00',
    token: 'ICP',
    date: 'Jul 20, 2024',
    status: 'Pending',
  },
  {
    id: '5',
    type: 'purchase',
    description: 'Agricultural Products',
    amount: '412.86',
    token: 'ICP',
    date: 'Jul 15, 2024',
    status: 'Completed',
  },
];
