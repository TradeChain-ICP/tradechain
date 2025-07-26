import { Actor, HttpAgent } from '@dfinity/agent';

// Import IDL (will be generated after deployment)
const userManagementIdl = ({ IDL }: { IDL: any }) => {
  const UserRole = IDL.Variant({
    'Admin' : IDL.Null,
    'Buyer' : IDL.Null,
    'Seller' : IDL.Null,
  });
  
  const AuthProvider = IDL.Variant({
    'Email' : IDL.Null,
    'InternetIdentity' : IDL.Null,
  });

  const RegisterRequest = IDL.Record({
    'agreeTerms' : IDL.Bool,
    'role' : UserRole,
    'email' : IDL.Opt(IDL.Text),
    'authProvider' : AuthProvider,
  });

  const UserProfile = IDL.Record({
    'id' : IDL.Text,
    'bio' : IDL.Opt(IDL.Text),
    'principal' : IDL.Principal,
    'lastName' : IDL.Opt(IDL.Text),
    'role' : UserRole,
    'verified' : IDL.Bool,
    'avatar' : IDL.Opt(IDL.Text),
    'website' : IDL.Opt(IDL.Text),
    'authProvider' : AuthProvider,
    'email' : IDL.Opt(IDL.Text),
    'phone' : IDL.Opt(IDL.Text),
    'totalTrades' : IDL.Nat,
    'company' : IDL.Opt(IDL.Text),
    'successRate' : IDL.Float64,
    'rating' : IDL.Float64,
    'firstName' : IDL.Opt(IDL.Text),
    'joinDate' : IDL.Int,
    'lastActive' : IDL.Int,
    'location' : IDL.Opt(IDL.Text),
    'kycStatus' : IDL.Variant({
      'Pending' : IDL.Null,
      'Verified' : IDL.Null,
      'NotStarted' : IDL.Null,
      'Rejected' : IDL.Null,
    }),
  });

  return IDL.Service({
    'getUserProfile' : IDL.Func([], [IDL.Variant({'ok' : UserProfile, 'err' : IDL.Text})], []),
    'loginDemo' : IDL.Func([IDL.Text, IDL.Text, UserRole], [IDL.Variant({'ok' : UserProfile, 'err' : IDL.Text})], []),
    'registerUser' : IDL.Func([RegisterRequest], [IDL.Variant({'ok' : UserProfile, 'err' : IDL.Text})], []),
    'healthCheck' : IDL.Func([], [IDL.Text], ['query']),
  });
};

// Create agent
const agent = new HttpAgent({
  host: process.env.NEXT_PUBLIC_IC_HOST,
});

// Create actor
export const userManagementActor = Actor.createActor(userManagementIdl, {
  agent,
  canisterId: process.env.NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID!,
});