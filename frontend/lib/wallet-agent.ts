import { Actor, HttpAgent } from '@dfinity/agent';

// Wallet IDL (simplified for demo)
const walletIdl = ({ IDL }: { IDL: any }) => {
  const TokenType = IDL.Variant({
    ICP: IDL.Null,
    ckBTC: IDL.Null,
    ckETH: IDL.Null,
    ckUSDC: IDL.Null,
  });

  const TokenBalance = IDL.Record({
    symbol: IDL.Text,
    name: IDL.Text,
    balance: IDL.Float64,
    usdValue: IDL.Float64,
    change24h: IDL.Float64,
    color: IDL.Text,
  });

  const WalletInfo = IDL.Record({
    userId: IDL.Text,
    principal: IDL.Principal,
    address: IDL.Text,
    totalBalance: IDL.Float64,
    totalUsdValue: IDL.Float64,
    tokens: IDL.Vec(TokenBalance),
    createdAt: IDL.Int,
    lastActivity: IDL.Int,
  });

  const TransactionType = IDL.Variant({
    Deposit: IDL.Null,
    Withdraw: IDL.Null,
    Purchase: IDL.Null,
    Sale: IDL.Null,
    Transfer: IDL.Null,
  });

  const TransactionStatus = IDL.Variant({
    Pending: IDL.Null,
    Completed: IDL.Null,
    Failed: IDL.Null,
    Cancelled: IDL.Null,
  });

  const Transaction = IDL.Record({
    id: IDL.Text,
    userId: IDL.Text,
    transactionType: TransactionType,
    tokenType: TokenType,
    amount: IDL.Float64,
    usdValue: IDL.Float64,
    fromAddress: IDL.Opt(IDL.Text),
    toAddress: IDL.Opt(IDL.Text),
    status: TransactionStatus,
    timestamp: IDL.Int,
    description: IDL.Text,
    fee: IDL.Float64,
    hash: IDL.Opt(IDL.Text),
  });

  const DepositRequest = IDL.Record({
    amount: IDL.Float64,
    tokenType: TokenType,
  });

  const WithdrawalRequest = IDL.Record({
    toAddress: IDL.Text,
    amount: IDL.Float64,
    tokenType: TokenType,
  });

  return IDL.Service({
    getWalletInfo: IDL.Func([], [IDL.Variant({ ok: WalletInfo, err: IDL.Text })], []),
    getDemoWallet: IDL.Func([IDL.Text], [IDL.Variant({ ok: WalletInfo, err: IDL.Text })], []),
    getTransactionHistory: IDL.Func(
      [],
      [IDL.Variant({ ok: IDL.Vec(Transaction), err: IDL.Text })],
      []
    ),
    getDemoTransactionHistory: IDL.Func(
      [IDL.Text],
      [IDL.Variant({ ok: IDL.Vec(Transaction), err: IDL.Text })],
      []
    ),
    deposit: IDL.Func([DepositRequest], [IDL.Variant({ ok: Transaction, err: IDL.Text })], []),
    withdraw: IDL.Func([WithdrawalRequest], [IDL.Variant({ ok: Transaction, err: IDL.Text })], []),
    healthCheck: IDL.Func([], [IDL.Text], ['query']),
  });
};

// Create agent
const agent = new HttpAgent({
  host: process.env.NEXT_PUBLIC_IC_HOST,
});

// Create wallet actor
export const walletActor = Actor.createActor(walletIdl, {
  agent,
  canisterId: process.env.NEXT_PUBLIC_WALLET_CANISTER_ID!,
});