import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : null } |
  { 'err' : string };
export type Result_2 = { 'ok' : Wallet } |
  { 'err' : string };
export type Result_3 = { 'ok' : bigint } |
  { 'err' : string };
export type TokenType = { 'ICP' : null } |
  { 'USD' : null } |
  { 'Naira' : null } |
  { 'Euro' : null };
export interface Transaction {
  'id' : string,
  'status' : TransactionStatus,
  'completedAt' : [] | [bigint],
  'transactionType' : TransactionType,
  'memo' : [] | [string],
  'createdAt' : bigint,
  'toPrincipal' : Principal,
  'fromPrincipal' : Principal,
  'tokenType' : TokenType,
  'amount' : bigint,
}
export type TransactionStatus = { 'cancelled' : null } |
  { 'pending' : null } |
  { 'completed' : null } |
  { 'failed' : null };
export type TransactionType = { 'deposit' : null } |
  { 'withdrawal' : null } |
  { 'transfer' : null } |
  { 'escrow' : null } |
  { 'payment' : null } |
  { 'refund' : null };
export interface Wallet {
  'lastTransactionAt' : bigint,
  'owner' : Principal,
  'createdAt' : bigint,
  'euroBalance' : bigint,
  'icpBalance' : bigint,
  'nairaBalance' : bigint,
  'isLocked' : boolean,
  'usdBalance' : bigint,
  'totalTransactions' : bigint,
}
export interface _SERVICE {
  'addFunds' : ActorMethod<[bigint, TokenType], Result_1>,
  'createWallet' : ActorMethod<[], Result_2>,
  'getBalance' : ActorMethod<[TokenType], Result_3>,
  'getTransaction' : ActorMethod<[string], [] | [Transaction]>,
  'getTransactionHistory' : ActorMethod<[], Array<Transaction>>,
  'getWallet' : ActorMethod<[], Result_2>,
  'getWalletStats' : ActorMethod<
    [],
    {
      'totalIcpLocked' : bigint,
      'totalWallets' : bigint,
      'totalUsdLocked' : bigint,
      'totalTransactions' : bigint,
    }
  >,
  'healthCheck' : ActorMethod<
    [],
    { 'status' : string, 'walletCount' : bigint, 'timestamp' : bigint }
  >,
  'setWalletLock' : ActorMethod<[Principal, boolean], Result_1>,
  'transfer' : ActorMethod<
    [Principal, bigint, TokenType, [] | [string]],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
