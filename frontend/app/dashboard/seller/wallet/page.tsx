'use client';

import { useState, useEffect } from 'react';
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
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Receipt,
  CheckCircle,
  Send,
  Brain,
  Target,
  Lightbulb,
  Zap,
  AlertCircle,
  CreditCard,
  Users,
  Package,
  TrendingDown as TrendingDownIcon,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

// Real-time price data hook
const useCryptoPrices = () => {
  const [prices, setPrices] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Using CoinGecko free API (no API key required)
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=internet-computer,usd-coin,bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
      );

      if (!response.ok) throw new Error('Failed to fetch prices');

      const data = await response.json();

      // Also fetch fiat exchange rates
      const fiatResponse = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );

      let fiatRates = { NGN: 0.0012, EUR: 1.08 }; // fallback rates
      if (fiatResponse.ok) {
        const fiatData = await fiatResponse.json();
        fiatRates = {
          NGN: 1 / fiatData.rates.NGN,
          EUR: fiatData.rates.EUR,
        };
      }

      setPrices({
        ICP: {
          usd: data['internet-computer']?.usd || 7.0,
          change24h: data['internet-computer']?.usd_24h_change || 0,
        },
        USD: {
          usd: 1.0,
          change24h: 0,
        },
        Naira: {
          usd: fiatRates.NGN,
          change24h: -0.8, // Naira tends to depreciate
        },
        Euro: {
          usd: fiatRates.EUR,
          change24h: 0.2,
        },
      });
    } catch (err) {
      console.error('Failed to fetch prices:', err);
      setError('Failed to fetch real-time prices');
      // Fallback to demo data
      setPrices({
        ICP: { usd: 7.0, change24h: 2.5 },
        USD: { usd: 1.0, change24h: 0 },
        Naira: { usd: 0.0012, change24h: -0.8 },
        Euro: { usd: 1.08, change24h: 0.2 },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return { prices, loading, error, refetch: fetchPrices };
};

// AI Business Insights Hook for Sellers
const useAIInsights = (wallet: any, prices: any) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateInsights = () => {
    if (!wallet || !prices) return;

    setLoading(true);

    // Simulate AI analysis with seller-specific insights
    setTimeout(() => {
      const newInsights = [];

      // Revenue analysis
      const totalValue = getTotalPortfolioValue(wallet, prices);
      const icpPercentage = getTokenAllocation('ICP', wallet, prices);

      if (totalValue > 10000) {
        newInsights.push({
          type: 'opportunity',
          title: 'High Revenue Opportunity',
          description: `Your earnings of $${totalValue.toLocaleString()} indicate strong business performance. Consider expanding inventory.`,
          action: 'Expand Business',
          confidence: 88,
        });
      }

      // Market opportunity analysis
      if (prices.ICP?.change24h > 3) {
        newInsights.push({
          type: 'suggestion',
          title: 'Currency Appreciation',
          description: `ICP is up ${prices.ICP.change24h.toFixed(2)}% today. Good time to convert earnings for maximum value.`,
          action: 'Convert Now',
          confidence: 75,
        });
      }

      // Business optimization
      if (icpPercentage > 80) {
        newInsights.push({
          type: 'warning',
          title: 'Currency Concentration Risk',
          description: `${icpPercentage}% of earnings in ICP. Consider diversifying payment methods or converting to stable currencies.`,
          action: 'Diversify Payments',
          confidence: 82,
        });
      }

      // Payment optimization insight
      newInsights.push({
        type: 'info',
        title: 'Payment Processing',
        description: 'Your wallet shows excellent settlement rates. Consider offering multi-currency options to attract more customers.',
        action: 'Enable Multi-Currency',
        confidence: 79,
      });

      setInsights(newInsights);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateInsights();
  }, [wallet, prices]);

  return { insights, loading, refresh: generateInsights };
};

// Helper functions
const formatBalance = (balance: number) => {
  return (balance / 100000000).toFixed(8);
};

const getTotalPortfolioValue = (wallet: any, prices: any) => {
  if (!wallet || !prices) return 0;

  const icpValue = (wallet.icpBalance / 100000000) * prices.ICP?.usd;
  const usdValue = wallet.usdBalance / 100000000;
  const nairaValue = (wallet.nairaBalance / 100000000) * prices.Naira?.usd;
  const euroValue = (wallet.euroBalance / 100000000) * prices.Euro?.usd;

  return icpValue + usdValue + nairaValue + euroValue;
};

const getTokenBalance = (token: string, wallet: any) => {
  if (!wallet) return 0;
  switch (token) {
    case 'ICP': return wallet.icpBalance;
    case 'USD': return wallet.usdBalance;
    case 'Naira': return wallet.nairaBalance;
    case 'Euro': return wallet.euroBalance;
    default: return 0;
  }
};

const getTokenAllocation = (token: string, wallet: any, prices: any) => {
  const totalValue = getTotalPortfolioValue(wallet, prices);
  if (totalValue === 0) return 0;

  let tokenValue = 0;
  const balance = getTokenBalance(token, wallet) / 100000000;

  switch (token) {
    case 'ICP':
      tokenValue = balance * (prices.ICP?.usd || 7.0);
      break;
    case 'USD':
      tokenValue = balance;
      break;
    case 'Naira':
      tokenValue = balance * (prices.Naira?.usd || 0.0012);
      break;
    case 'Euro':
      tokenValue = balance * (prices.Euro?.usd || 1.08);
      break;
  }

  return Math.round((tokenValue / totalValue) * 100);
};

export default function SellerWalletPage() {
  const { toast } = useToast();
  const { contentPadding } = useContentPadding();
  const { user, wallet, getWallet, addFunds, transfer, getTransactionHistory } = useAuth();
  const { prices, loading: pricesLoading, error: pricesError, refetch: refetchPrices } = useCryptoPrices();
  const { insights, loading: insightsLoading, refresh: refreshInsights } = useAIInsights(wallet, prices);

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'withdraw'>('withdraw');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Transaction form state
  const [amount, setAmount] = useState('');
  const [tokenType, setTokenType] = useState<'ICP' | 'USD' | 'Naira' | 'Euro'>('ICP');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    initializeWallet();
  }, []);

  const initializeWallet = async () => {
    try {
      setIsLoading(true);
      await getWallet();
      await loadTransactionHistory();
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      toast({
        title: 'Wallet Error',
        description: 'Failed to load wallet data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactionHistory = async () => {
    try {
      const history = await getTransactionHistory();
      setTransactions(history);
    } catch (error) {
      console.error('Failed to load transaction history:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        getWallet(),
        loadTransactionHistory(),
        refetchPrices(),
      ]);

      toast({
        title: 'Wallet Refreshed',
        description: 'Your wallet data has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Refresh Failed',
        description: 'Failed to refresh wallet data.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(user?.walletAddress || '');
      setCopySuccess(true);
      toast({
        title: 'Address Copied',
        description: 'Payment address copied to clipboard.',
      });

      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy address to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const validateAmount = (amount: string, tokenType: string) => {
    const numAmount = Number.parseFloat(amount);

    if (!amount || numAmount <= 0) {
      return 'Please enter a valid amount greater than 0';
    }

    if (numAmount > 1000000) {
      return 'Amount too large';
    }

    const balance = getTokenBalance(tokenType, wallet) / 100000000;
    if (numAmount > balance) {
      return `Insufficient balance. Available: ${balance.toFixed(8)} ${tokenType}`;
    }

    return null;
  };

  const handleWithdraw = async () => {
    const validation = validateAmount(amount, tokenType);
    if (validation) {
      toast({
        title: 'Invalid Amount',
        description: validation,
        variant: 'destructive',
      });
      return;
    }

    if (!recipientAddress.trim()) {
      toast({
        title: 'Missing Address',
        description: 'Please enter a recipient address.',
        variant: 'destructive',
      });
      return;
    }

    // Basic address validation
    if (recipientAddress.length < 20) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid wallet address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const amountInSmallestUnit = Math.floor(Number.parseFloat(amount) * 100000000);
      const txId = await transfer({
        to: recipientAddress,
        amount: amountInSmallestUnit,
        tokenType: tokenType,
        memo: memo || 'Seller earnings withdrawal',
      });

      toast({
        title: 'Withdrawal Successful',
        description: `${amount} ${tokenType} withdrawn successfully. Transaction ID: ${txId.slice(0, 8)}...`,
      });

      setAmount('');
      setRecipientAddress('');
      setMemo('');
      setIsTransactionOpen(false);
      await Promise.all([getWallet(), loadTransactionHistory()]);
      refreshInsights();
    } catch (error: any) {
      toast({
        title: 'Withdrawal Failed',
        description: error.message || 'Withdrawal failed. Please check your inputs and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const walletTokens = [
    {
      symbol: 'ICP',
      name: 'Internet Computer',
      balance: getTokenBalance('ICP', wallet),
      usdValue: (getTokenBalance('ICP', wallet) / 100000000) * (prices.ICP?.usd || 7.0),
      change24h: prices.ICP?.change24h || 0,
      color: '#29D0B0',
      allocation: getTokenAllocation('ICP', wallet, prices),
    },
    {
      symbol: 'USD',
      name: 'US Dollar',
      balance: getTokenBalance('USD', wallet),
      usdValue: getTokenBalance('USD', wallet) / 100000000,
      change24h: prices.USD?.change24h || 0,
      color: '#22C55E',
      allocation: getTokenAllocation('USD', wallet, prices),
    },
    {
      symbol: 'Naira',
      name: 'Nigerian Naira',
      balance: getTokenBalance('Naira', wallet),
      usdValue: (getTokenBalance('Naira', wallet) / 100000000) * (prices.Naira?.usd || 0.0012),
      change24h: prices.Naira?.change24h || 0,
      color: '#10B981',
      allocation: getTokenAllocation('Naira', wallet, prices),
    },
    {
      symbol: 'Euro',
      name: 'Euro',
      balance: getTokenBalance('Euro', wallet),
      usdValue: (getTokenBalance('Euro', wallet) / 100000000) * (prices.Euro?.usd || 1.08),
      change24h: prices.Euro?.change24h || 0,
      color: '#3B82F6',
      allocation: getTokenAllocation('Euro', wallet, prices),
    },
  ];

  // Mock earnings data for revenue chart
  const earningsData = [
    { month: 'Jan', earnings: 5240, orders: 42 },
    { month: 'Feb', earnings: 6890, orders: 55 },
    { month: 'Mar', earnings: 8200, orders: 67 },
    { month: 'Apr', earnings: 9450, orders: 73 },
    { month: 'May', earnings: 11300, orders: 89 },
    { month: 'Jun', earnings: 13800, orders: 102 },
    { month: 'Jul', earnings: 16900, orders: 126 },
  ];

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    color = 'default',
    loading = false,
  }: {
    icon: any;
    title: string;
    value: string;
    subtitle: string;
    trend?: number;
    color?: string;
    loading?: boolean;
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
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="animate-pulse bg-muted h-8 w-24 rounded" />
          ) : balanceVisible ? (
            value
          ) : (
            '••••••'
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{subtitle}</span>
          {trend !== undefined && !loading && (
            <>
              {trend > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : trend < 0 ? (
                <TrendingDownIcon className="h-3 w-3 text-red-600" />
              ) : null}
              <span className={trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : ''}>
                {trend > 0 ? '+' : ''}
                {trend.toFixed(2)}%
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading && !wallet) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${contentPadding}`}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading wallet...</p>
        </div>
      </div>
    );
  }

  const totalPortfolioValue = getTotalPortfolioValue(wallet, prices);
  const pendingEarnings = totalPortfolioValue * 0.05; // Simulate 5% pending
  const totalEarnings = totalPortfolioValue * 3.2; // Simulate total historical earnings

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Wallet</h1>
          <p className="text-muted-foreground">
            Manage your earnings and payment processing
          </p>
          {pricesError && (
            <div className="flex items-center gap-2 mt-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-600">Using cached price data</span>
            </div>
          )}
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
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Seller-specific Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={DollarSign}
          title="Total Earnings"
          value={`$${totalEarnings.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle="All-time revenue"
          trend={24.5}
          color="success"
          loading={pricesLoading}
        />
        <StatCard
          icon={Wallet}
          title="Available Balance"
          value={`${formatBalance(wallet?.icpBalance || 0)} ICP`}
          subtitle={`≈ $${totalPortfolioValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          trend={12.3}
          color="success"
          loading={pricesLoading}
        />
        <StatCard
          icon={Receipt}
          title="Pending Earnings"
          value={`$${pendingEarnings.toFixed(2)}`}
          subtitle="From recent sales"
          color="warning"
        />
        <StatCard
          icon={CreditCard}
          title="Settlement Rate"
          value="98.5%"
          subtitle="Payment processing"
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
                value={user?.walletAddress || 'Not connected'}
                readOnly
                className="font-mono text-sm flex-1"
              />
              <Button
                variant="outline"
                onClick={handleCopyAddress}
                className={`bg-transparent transition-all duration-300 ${
                  copySuccess ? 'border-green-500 text-green-600' : ''
                }`}
              >
                {copySuccess ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copySuccess ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200 dark:bg-green-950 dark:border-green-800">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-700 dark:text-green-300">
                    <p className="font-medium">Auto-Settlement Enabled</p>
                    <p>Payments are automatically settled to your wallet</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
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
              <Button
                className="w-full h-12 justify-start"
                onClick={() => setIsTransactionOpen(true)}
                disabled={wallet?.isLocked || totalPortfolioValue === 0}
              >
                <Send className="h-5 w-5 mr-2" />
                Withdraw Earnings
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 justify-start bg-transparent"
                onClick={() =>
                  window.open(
                    `https://dashboard.internetcomputer.org/account/${user?.walletAddress}`,
                    '_blank'
                  )
                }
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                View on Explorer
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

            {pendingEarnings > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    ${pendingEarnings.toFixed(2)} pending from recent sales
                  </span>
                </div>
              </div>
            )}

            {wallet?.isLocked && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200 dark:bg-red-950 dark:border-red-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700 dark:text-red-300">
                    Wallet is temporarily locked
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
              <CardDescription>Your earnings and order volume over the last 7 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="earnings" orientation="left" />
                    <YAxis yAxisId="orders" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'earnings' ? `$${value.toLocaleString()}` : `${value} orders`,
                        name === 'earnings' ? 'Earnings' : 'Orders',
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area
                      yAxisId="earnings"
                      type="monotone"
                      dataKey="earnings"
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

          {/* Payment Token Holdings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment Token Holdings</CardTitle>
                <CardDescription>Tokens received from customer payments</CardDescription>
              </div>
              {pricesLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Updating prices...
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walletTokens.map((token) => (
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
                          ? `${formatBalance(token.balance)} ${token.symbol}`
                          : '••••••'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {balanceVisible ? `$${token.usdValue.toFixed(2)}` : '••••••'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {token.change24h > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : token.change24h < 0 ? (
                        <TrendingDownIcon className="h-4 w-4 text-red-600" />
                      ) : null}
                      <span
                        className={`text-sm font-medium ${
                          token.change24h > 0
                            ? 'text-green-600'
                            : token.change24h < 0
                            ? 'text-red-600'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {token.change24h !== 0 && (token.change24h > 0 ? '+' : '')}
                        {token.change24h.toFixed(2)}%
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
                <CardDescription>Your latest payment activity and withdrawals</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={loadTransactionHistory}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Your transaction history will appear here</p>
                  </div>
                ) : (
                  transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.transactionType === 'transfer' &&
                            transaction.fromPrincipal === user?.principalId
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-950'
                              : 'bg-green-100 text-green-600 dark:bg-green-950'
                          }`}
                        >
                          {transaction.transactionType === 'transfer' &&
                          transaction.fromPrincipal === user?.principalId ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.transactionType === 'transfer' &&
                            transaction.fromPrincipal === user?.principalId
                              ? 'Earnings Withdrawn'
                              : 'Payment Received'}{' '}
                            {transaction.tokenType}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-medium ${
                            transaction.transactionType === 'transfer' &&
                            transaction.fromPrincipal === user?.principalId
                              ? 'text-blue-600'
                              : 'text-green-600'
                          }`}
                        >
                          {transaction.transactionType === 'transfer' &&
                          transaction.fromPrincipal === user?.principalId
                            ? '-'
                            : '+'}
                          {formatBalance(transaction.amount)} {transaction.tokenType}
                        </div>
                        <Badge variant={getTransactionStatus(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
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
                      data={walletTokens.filter((token) => token.allocation > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="allocation"
                    >
                      {walletTokens.map((token, index) => (
                        <Cell key={`cell-${index}`} fill={token.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {walletTokens
                  .filter((token) => token.allocation > 0)
                  .map((token) => (
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
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-4 w-4 text-primary" />
                Business Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insightsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing business data...
                </div>
              ) : (
                insights.slice(0, 3).map((insight, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      insight.type === 'opportunity'
                        ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                        : insight.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800'
                        : insight.type === 'suggestion'
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                        : 'bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {insight.type === 'opportunity' ? (
                          <Target className="h-4 w-4 text-green-600" />
                        ) : insight.type === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        ) : insight.type === 'suggestion' ? (
                          <Lightbulb className="h-4 w-4 text-blue-600" />
                        ) : (
                          <BarChart3 className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium text-sm ${
                            insight.type === 'opportunity'
                              ? 'text-green-700 dark:text-green-300'
                              : insight.type === 'warning'
                              ? 'text-yellow-700 dark:text-yellow-300'
                              : insight.type === 'suggestion'
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {insight.title}
                        </h4>
                        <p
                          className={`text-xs mt-1 ${
                            insight.type === 'opportunity'
                              ? 'text-green-600 dark:text-green-400'
                              : insight.type === 'warning'
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : insight.type === 'suggestion'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {insight.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {insight.confidence}% confidence
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                          >
                            {insight.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full h-8 text-xs bg-transparent"
                  onClick={refreshInsights}
                  disabled={insightsLoading}
                >
                  <RefreshCw className={`h-3 w-3 mr-2 ${insightsLoading ? 'animate-spin' : ''}`} />
                  Refresh Insights
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Business Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Business Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Sales</span>
                <span className="font-medium">126</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Sale</span>
                <span className="font-medium">$385</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Customer Rating</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">4.8</span>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Withdraw Dialog */}
      <Dialog open={isTransactionOpen} onOpenChange={setIsTransactionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Earnings</DialogTitle>
            <DialogDescription>Transfer your earnings to an external wallet</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token-type">Token Type</Label>
              <Select
                value={tokenType}
                onValueChange={(value: 'ICP' | 'USD' | 'Naira' | 'Euro') => setTokenType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ICP">
                    ICP - ${(prices.ICP?.usd || 7.0).toFixed(2)}
                  </SelectItem>
                  <SelectItem value="USD">USD - $1.00</SelectItem>
                  <SelectItem value="Naira">
                    Naira - ${(prices.Naira?.usd || 0.0012).toFixed(4)}
                  </SelectItem>
                  <SelectItem value="Euro">
                    Euro - ${(prices.Euro?.usd || 1.08).toFixed(2)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.00000001"
              />
              <p className="text-xs text-muted-foreground">
                Available: {formatBalance(getTokenBalance(tokenType, wallet))} {tokenType}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Destination Address</Label>
              <Input
                id="recipient"
                placeholder="Enter recipient address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo">Memo (Optional)</Label>
              <Input
                id="memo"
                placeholder="Transaction memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Network fee: ~0.0001 ICP • Processing time: 1-2 minutes
                </p>
              </div>
            </div>

            {amount && (
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex justify-between text-sm">
                  <span>Amount:</span>
                  <span className="font-medium">
                    {amount} {tokenType}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>USD Value:</span>
                  <span className="font-medium">
                    ${(
                      Number.parseFloat(amount || '0') *
                      (prices[tokenType]?.usd || 1.0)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Network Fee:</span>
                  <span className="font-medium">~0.0001 ICP</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsTransactionOpen(false);
                setAmount('');
                setRecipientAddress('');
                setMemo('');
              }}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={
                isLoading ||
                !amount ||
                Number.parseFloat(amount) <= 0 ||
                !recipientAddress.trim()
              }
            >
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
    case 'completed':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'failed':
      return 'destructive';
    default:
      return 'outline';
  }
}