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
export interface User {
  'id' : string,
  'kycSubmittedAt' : [] | [bigint],
  'verified' : boolean,
  'joinedAt' : bigint,
  'role' : [] | [UserRole],
  'authMethod' : AuthMethod,
  'walletAddress' : string,
  'kycStatus' : KYCStatus,
  'lastName' : string,
  'lastActive' : bigint,
  'principalId' : string,
  'firstName' : string,
}
export type UserRole = { 'seller' : null } |
  { 'buyer' : null };
export interface _SERVICE {
  'getCurrentUser' : ActorMethod<[], Result>,
  'getTotalUsers' : ActorMethod<[], bigint>,
  'getUserByPrincipal' : ActorMethod<[Principal], [] | [User]>,
  'getUserCountByRole' : ActorMethod<[], Array<[UserRole, bigint]>>,
  'getUserStats' : ActorMethod<
    [],
    {
      'kycPending' : bigint,
      'verifiedUsers' : bigint,
      'totalUsers' : bigint,
      'kycCompleted' : bigint,
      'kycInReview' : bigint,
      'kycRejected' : bigint,
    }
  >,
  'getUsersByRole' : ActorMethod<[UserRole], Array<User>>,
  'healthCheck' : ActorMethod<
    [],
    { 'status' : string, 'timestamp' : bigint, 'userCount' : bigint }
  >,
  'registerUser' : ActorMethod<[AuthMethod, string, string], Result>,
  'setUserRole' : ActorMethod<[UserRole], Result>,
  'updateKYCStatus' : ActorMethod<[KYCStatus], Result>,
  'updateProfile' : ActorMethod<[string, string], Result>,
  'userExists' : ActorMethod<[], boolean>,
  'validateSession' : ActorMethod<[], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
