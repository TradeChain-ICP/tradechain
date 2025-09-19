import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AuthMethod = { 'internetIdentity' : null } |
  { 'nfid' : null };
export type KYCStatus = { 'pending' : null } |
  { 'completed' : null } |
  { 'inReview' : null } |
  { 'rejected' : null };
export type Result = { 'ok' : User } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export type Result_2 = { 'ok' : null } |
  { 'err' : string };
export type Result_3 = { 'ok' : Wallet } |
  { 'err' : string };
export type Result_4 = { 'ok' : bigint } |
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
export interface User {
  'id' : string,
  'bio' : [] | [string],
  'kycSubmittedAt' : [] | [bigint],
  'verified' : boolean,
  'joinedAt' : bigint,
  'role' : [] | [UserRole],
  'authMethod' : AuthMethod,
  'walletAddress' : string,
  'email' : string,
  'website' : [] | [string],
  'kycStatus' : KYCStatus,
  'company' : [] | [string],
  'phone' : [] | [string],
  'profilePicture' : [] | [Uint8Array | number[]],
  'lastName' : string,
  'lastActive' : bigint,
  'location' : [] | [string],
  'principalId' : string,
  'firstName' : string,
}
export type UserRole = { 'seller' : null } |
  { 'buyer' : null };
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
  'addFunds' : ActorMethod<[bigint, TokenType], Result_2>,
  'forceMigration' : ActorMethod<[], Result_1>,
  'getBalance' : ActorMethod<[TokenType], Result_4>,
  'getCurrentUser' : ActorMethod<[], Result>,
  'getMigrationStatus' : ActorMethod<
    [],
    { 'info' : string, 'version' : bigint, 'isComplete' : boolean }
  >,
  'getProfilePicture' : ActorMethod<[], [] | [Uint8Array | number[]]>,
  'getTotalUsers' : ActorMethod<[], bigint>,
  'getTransaction' : ActorMethod<[string], [] | [Transaction]>,
  'getTransactionHistory' : ActorMethod<[], Array<Transaction>>,
  'getUserByPrincipal' : ActorMethod<[Principal], [] | [User]>,
  'getUserCountByRole' : ActorMethod<[], Array<[UserRole, bigint]>>,
  'getUserStats' : ActorMethod<
    [],
    {
      'kycPending' : bigint,
      'totalWallets' : bigint,
      'verifiedUsers' : bigint,
      'totalUsers' : bigint,
      'kycCompleted' : bigint,
      'kycInReview' : bigint,
      'kycRejected' : bigint,
      'totalTransactions' : bigint,
    }
  >,
  'getUsersByRole' : ActorMethod<[UserRole], Array<User>>,
  'getWallet' : ActorMethod<[], Result_3>,
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
    {
      'status' : string,
      'walletCount' : bigint,
      'timestamp' : bigint,
      'userCount' : bigint,
    }
  >,
  'registerUser' : ActorMethod<
    [
      AuthMethod,
      string,
      string,
      string,
      [] | [string],
      [] | [Uint8Array | number[]],
    ],
    Result
  >,
  'setUserRole' : ActorMethod<
    [UserRole, [] | [string], [] | [string], [] | [string], [] | [string]],
    Result
  >,
  'setWalletLock' : ActorMethod<[Principal, boolean], Result_2>,
  'transfer' : ActorMethod<
    [Principal, bigint, TokenType, [] | [string]],
    Result_1
  >,
  'updateKYCStatus' : ActorMethod<[KYCStatus], Result>,
  'updateProfile' : ActorMethod<
    [
      string,
      string,
      string,
      [] | [string],
      [] | [string],
      [] | [string],
      [] | [string],
      [] | [string],
    ],
    Result
  >,
  'updateProfilePicture' : ActorMethod<[Uint8Array | number[]], Result>,
  'userExists' : ActorMethod<[], boolean>,
  'validateSession' : ActorMethod<[], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
