"use client"

import { useState } from "react"
import { ArrowDownLeft, ArrowUpRight, Copy, Eye, EyeOff, TrendingUp, TrendingDown } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function WalletPage() {
  const { toast } = useToast()
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawAddress, setWithdrawAddress] = useState("")

  const walletData = {
    totalBalance: 1245.67,
    icpBalance: 1245.67,
    usdValue: 8719.69,
    tokens: [
      {
        symbol: "ICP",
        name: "Internet Computer",
        balance: 1245.67,
        usdValue: 8719.69,
        change24h: 2.5,
        color: "#29D0B0",
      },
      {
        symbol: "ckBTC",
        name: "Chain Key Bitcoin",
        balance: 0.15,
        usdValue: 6450.0,
        change24h: -1.2,
        color: "#F7931A",
      },
      {
        symbol: "ckETH",
        name: "Chain Key Ethereum",
        balance: 2.8,
        usdValue: 7840.0,
        change24h: 3.8,
        color: "#627EEA",
      },
      {
        symbol: "ckUSDC",
        name: "Chain Key USDC",
        balance: 5000.0,
        usdValue: 5000.0,
        change24h: 0.1,
        color: "#2775CA",
      },
    ],
  }

  const totalPortfolioValue = walletData.tokens.reduce((sum, token) => sum + token.usdValue, 0)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("rdmx6-jaaaa-aaaah-qcaiq-cai")
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard.",
    })
  }

  const handleDeposit = () => {
    if (!depositAmount || Number.parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Deposit Initiated",
      description: `Deposit of ${depositAmount} ICP has been initiated.`,
    })
    setDepositAmount("")
  }

  const handleWithdraw = () => {
    if (!withdrawAmount || Number.parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      })
      return
    }

    if (!withdrawAddress) {
      toast({
        title: "Missing Address",
        description: "Please enter a withdrawal address.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Withdrawal Initiated",
      description: `Withdrawal of ${withdrawAmount} ICP has been initiated.`,
    })
    setWithdrawAmount("")
    setWithdrawAddress("")
  }

  return (
    <DashboardLayout userRole="buyer">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Wallet</h1>
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
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {balanceVisible ? `$${totalPortfolioValue.toLocaleString()}` : "••••••"}
              </div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ICP Balance</CardTitle>
              <div className="w-4 h-4 rounded-full bg-[#29D0B0]"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {balanceVisible ? `${walletData.icpBalance.toFixed(2)} ICP` : "••••••"}
              </div>
              <p className="text-xs text-muted-foreground">
                ≈ ${balanceVisible ? walletData.usdValue.toLocaleString() : "••••••"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Change</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+2.5%</div>
              <p className="text-xs text-muted-foreground">+$218.50</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {balanceVisible ? `${(walletData.icpBalance * 0.95).toFixed(2)} ICP` : "••••••"}
              </div>
              <p className="text-xs text-muted-foreground">Ready for trading</p>
            </CardContent>
          </Card>
        </div>

        {/* Wallet Address */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Wallet Address</CardTitle>
            <CardDescription>Your ICP wallet address for receiving funds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input value="rdmx6-jaaaa-aaaah-qcaiq-cai" readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={handleCopyAddress} className="bg-transparent">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="h-20 flex-col gap-2">
                        <ArrowDownLeft className="h-6 w-6" />
                        <span>Deposit</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Deposit ICP</DialogTitle>
                        <DialogDescription>Add ICP tokens to your wallet for trading</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="deposit-amount">Amount (ICP)</Label>
                          <Input
                            id="deposit-amount"
                            type="number"
                            placeholder="0.00"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                          />
                        </div>
                        <div className="bg-blue-50 p-3 rounded-md">
                          <p className="text-sm text-blue-700">
                            Send ICP to your wallet address: rdmx6-jaaaa-aaaah-qcaiq-cai
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleDeposit}>Generate Deposit Address</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                        <ArrowUpRight className="h-6 w-6" />
                        <span>Withdraw</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Withdraw ICP</DialogTitle>
                        <DialogDescription>Send ICP tokens to an external wallet</DialogDescription>
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
                          <Label htmlFor="withdraw-amount">Amount (ICP)</Label>
                          <Input
                            id="withdraw-amount"
                            type="number"
                            placeholder="0.00"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Available: {walletData.icpBalance.toFixed(2)} ICP
                          </p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-md">
                          <p className="text-sm text-amber-700">
                            Network fee: 0.0001 ICP • Processing time: 1-2 minutes
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleWithdraw}>Withdraw</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Breakdown</CardTitle>
                <CardDescription>Your token holdings and their current values</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {walletData.tokens.map((token) => (
                    <div key={token.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: token.color }}></div>
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-sm text-muted-foreground">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {balanceVisible
                            ? `${token.balance.toFixed(token.symbol === "ckUSDC" ? 2 : 4)} ${token.symbol}`
                            : "••••••"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {balanceVisible ? `$${token.usdValue.toLocaleString()}` : "••••••"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {token.change24h > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${token.change24h > 0 ? "text-green-600" : "text-red-600"}`}>
                          {token.change24h > 0 ? "+" : ""}
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
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest wallet activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.type === "deposit"
                              ? "bg-green-100 text-green-600"
                              : transaction.type === "withdraw"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {transaction.type === "deposit" ? (
                            <ArrowDownLeft className="h-4 w-4" />
                          ) : transaction.type === "withdraw" ? (
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
                            transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "deposit" ? "+" : "-"}
                          {transaction.amount} {transaction.token}
                        </div>
                        <Badge variant={getTransactionStatus(transaction.status)}>{transaction.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Portfolio Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={walletData.tokens}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="usdValue"
                      >
                        {walletData.tokens.map((token, index) => (
                          <Cell key={`cell-${index}`} fill={token.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {walletData.tokens.map((token) => (
                    <div key={token.symbol} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: token.color }}></div>
                        <span>{token.symbol}</span>
                      </div>
                      <span>{((token.usdValue / totalPortfolioValue) * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Investment Insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI Investment Insights</CardTitle>
                <CardDescription>Personalized recommendations for your portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-700">Diversification Opportunity</span>
                  </div>
                  <p className="text-sm text-green-600">
                    Consider adding more agricultural commodities to balance your precious metals holdings.
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-4 rounded-full bg-blue-600"></div>
                    <span className="font-medium text-blue-700">Market Timing</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    Gold prices are trending upward. Good time to increase your position.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-4 rounded-full bg-amber-600"></div>
                    <span className="font-medium text-amber-700">Risk Assessment</span>
                  </div>
                  <p className="text-sm text-amber-600">
                    Your portfolio has moderate risk. Consider adding stable assets like timber.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Transactions</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">This Month</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Transaction</span>
                  <span className="font-medium">$1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Largest Transaction</span>
                  <span className="font-medium">$4,180</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper function
function getTransactionStatus(status: string) {
  switch (status) {
    case "Completed":
      return "default"
    case "Pending":
      return "secondary"
    case "Failed":
      return "destructive"
    default:
      return "outline"
  }
}

// Mock data
const mockTransactions = [
  {
    id: "1",
    type: "purchase",
    description: "Gold Bullion Purchase",
    amount: "278.57",
    token: "ICP",
    date: "Jul 25, 2024",
    status: "Completed",
  },
  {
    id: "2",
    type: "deposit",
    description: "ICP Deposit",
    amount: "500.00",
    token: "ICP",
    date: "Jul 24, 2024",
    status: "Completed",
  },
  {
    id: "3",
    type: "purchase",
    description: "Silver Bars Purchase",
    amount: "40.00",
    token: "ICP",
    date: "Jul 22, 2024",
    status: "Completed",
  },
  {
    id: "4",
    type: "withdraw",
    description: "ICP Withdrawal",
    amount: "100.00",
    token: "ICP",
    date: "Jul 20, 2024",
    status: "Completed",
  },
  {
    id: "5",
    type: "purchase",
    description: "Agricultural Products",
    amount: "412.86",
    token: "ICP",
    date: "Jul 15, 2024",
    status: "Completed",
  },
]
