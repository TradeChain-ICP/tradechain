export const idlFactory = ({ IDL }) => {
  const UserRole = IDL.Variant({ 'seller' : IDL.Null, 'buyer' : IDL.Null });
  const AuthMethod = IDL.Variant({
    'internetIdentity' : IDL.Null,
    'nfid' : IDL.Null,
  });
  const KYCStatus = IDL.Variant({
    'pending' : IDL.Null,
    'completed' : IDL.Null,
    'inReview' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const User = IDL.Record({
    'id' : IDL.Text,
    'kycSubmittedAt' : IDL.Opt(IDL.Int),
    'verified' : IDL.Bool,
    'joinedAt' : IDL.Int,
    'role' : IDL.Opt(UserRole),
    'authMethod' : AuthMethod,
    'walletAddress' : IDL.Text,
    'kycStatus' : KYCStatus,
    'lastName' : IDL.Text,
    'lastActive' : IDL.Int,
    'principalId' : IDL.Text,
    'firstName' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  return IDL.Service({
    'getCurrentUser' : IDL.Func([], [Result], []),
    'getTotalUsers' : IDL.Func([], [IDL.Nat], ['query']),
    'getUserByPrincipal' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(User)],
        ['query'],
      ),
    'getUserCountByRole' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(UserRole, IDL.Nat))],
        ['query'],
      ),
    'getUserStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'kycPending' : IDL.Nat,
            'verifiedUsers' : IDL.Nat,
            'totalUsers' : IDL.Nat,
            'kycCompleted' : IDL.Nat,
            'kycInReview' : IDL.Nat,
            'kycRejected' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getUsersByRole' : IDL.Func([UserRole], [IDL.Vec(User)], ['query']),
    'healthCheck' : IDL.Func(
        [],
        [
          IDL.Record({
            'status' : IDL.Text,
            'timestamp' : IDL.Int,
            'userCount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'registerUser' : IDL.Func([AuthMethod, IDL.Text, IDL.Text], [Result], []),
    'setUserRole' : IDL.Func([UserRole], [Result], []),
    'updateKYCStatus' : IDL.Func([KYCStatus], [Result], []),
    'updateProfile' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'userExists' : IDL.Func([], [IDL.Bool], []),
    'validateSession' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
