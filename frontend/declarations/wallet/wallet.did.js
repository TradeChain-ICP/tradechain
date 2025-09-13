export const idlFactory = ({ IDL }) => {
  const TokenType = IDL.Variant({
    'ICP' : IDL.Null,
    'USD' : IDL.Null,
    'Naira' : IDL.Null,
    'Euro' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Wallet = IDL.Record({
    'lastTransactionAt' : IDL.Int,
    'owner' : IDL.Principal,
    'createdAt' : IDL.Int,
    'euroBalance' : IDL.Nat,
    'icpBalance' : IDL.Nat,
    'nairaBalance' : IDL.Nat,
    'isLocked' : IDL.Bool,
    'usdBalance' : IDL.Nat,
    'totalTransactions' : IDL.Nat,
  });
  const Result_2 = IDL.Variant({ 'ok' : Wallet, 'err' : IDL.Text });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const TransactionStatus = IDL.Variant({
    'cancelled' : IDL.Null,
    'pending' : IDL.Null,
    'completed' : IDL.Null,
    'failed' : IDL.Null,
  });
  const TransactionType = IDL.Variant({
    'deposit' : IDL.Null,
    'withdrawal' : IDL.Null,
    'transfer' : IDL.Null,
    'escrow' : IDL.Null,
    'payment' : IDL.Null,
    'refund' : IDL.Null,
  });
  const Transaction = IDL.Record({
    'id' : IDL.Text,
    'status' : TransactionStatus,
    'completedAt' : IDL.Opt(IDL.Int),
    'transactionType' : TransactionType,
    'memo' : IDL.Opt(IDL.Text),
    'createdAt' : IDL.Int,
    'toPrincipal' : IDL.Principal,
    'fromPrincipal' : IDL.Principal,
    'tokenType' : TokenType,
    'amount' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'addFunds' : IDL.Func([IDL.Nat, TokenType], [Result_1], []),
    'createWallet' : IDL.Func([], [Result_2], []),
    'getBalance' : IDL.Func([TokenType], [Result_3], []),
    'getTransaction' : IDL.Func([IDL.Text], [IDL.Opt(Transaction)], ['query']),
    'getTransactionHistory' : IDL.Func([], [IDL.Vec(Transaction)], []),
    'getWallet' : IDL.Func([], [Result_2], []),
    'getWalletStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalIcpLocked' : IDL.Nat,
            'totalWallets' : IDL.Nat,
            'totalUsdLocked' : IDL.Nat,
            'totalTransactions' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'healthCheck' : IDL.Func(
        [],
        [
          IDL.Record({
            'status' : IDL.Text,
            'walletCount' : IDL.Nat,
            'timestamp' : IDL.Int,
          }),
        ],
        ['query'],
      ),
    'setWalletLock' : IDL.Func([IDL.Principal, IDL.Bool], [Result_1], []),
    'transfer' : IDL.Func(
        [IDL.Principal, IDL.Nat, TokenType, IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
