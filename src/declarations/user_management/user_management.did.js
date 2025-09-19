export const idlFactory = ({ IDL }) => {
  const TokenType = IDL.Variant({
    'ICP' : IDL.Null,
    'USD' : IDL.Null,
    'Naira' : IDL.Null,
    'Euro' : IDL.Null,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
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
    'bio' : IDL.Opt(IDL.Text),
    'kycSubmittedAt' : IDL.Opt(IDL.Int),
    'verified' : IDL.Bool,
    'joinedAt' : IDL.Int,
    'role' : IDL.Opt(UserRole),
    'authMethod' : AuthMethod,
    'walletAddress' : IDL.Text,
    'email' : IDL.Text,
    'website' : IDL.Opt(IDL.Text),
    'kycStatus' : KYCStatus,
    'company' : IDL.Opt(IDL.Text),
    'phone' : IDL.Opt(IDL.Text),
    'profilePicture' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'lastName' : IDL.Text,
    'lastActive' : IDL.Int,
    'location' : IDL.Opt(IDL.Text),
    'principalId' : IDL.Text,
    'firstName' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  const DocumentStatus = IDL.Variant({
    'pending' : IDL.Null,
    'approved' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const DocumentType = IDL.Variant({
    'selfie' : IDL.Null,
    'proofOfAddress' : IDL.Null,
    'idFront' : IDL.Null,
    'idBack' : IDL.Null,
  });
  const KYCDocument = IDL.Record({
    'id' : IDL.Text,
    'status' : DocumentStatus,
    'owner' : IDL.Principal,
    'rejectionReason' : IDL.Opt(IDL.Text),
    'fileData' : IDL.Vec(IDL.Nat8),
    'mimeType' : IDL.Text,
    'fileName' : IDL.Text,
    'reviewedAt' : IDL.Opt(IDL.Int),
    'reviewedBy' : IDL.Opt(IDL.Principal),
    'docType' : DocumentType,
    'uploadedAt' : IDL.Int,
  });
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
  const Result_3 = IDL.Variant({ 'ok' : Wallet, 'err' : IDL.Text });
  return IDL.Service({
    'addFunds' : IDL.Func([IDL.Nat, TokenType], [Result_2], []),
    'completeKYCVerification' : IDL.Func([IDL.Principal], [Result_2], []),
    'forceMigration' : IDL.Func([], [Result_1], []),
    'getBalance' : IDL.Func([TokenType], [Result_4], []),
    'getCurrentUser' : IDL.Func([], [Result], []),
    'getDocument' : IDL.Func([IDL.Text], [IDL.Opt(KYCDocument)], ['query']),
    'getKYCStatistics' : IDL.Func(
        [],
        [
          IDL.Record({
            'usersInReview' : IDL.Nat,
            'pendingDocuments' : IDL.Nat,
            'verifiedUsers' : IDL.Nat,
            'rejectedDocuments' : IDL.Nat,
            'approvedDocuments' : IDL.Nat,
            'totalDocuments' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getMigrationStatus' : IDL.Func(
        [],
        [
          IDL.Record({
            'info' : IDL.Text,
            'version' : IDL.Nat,
            'userCount' : IDL.Nat,
            'isComplete' : IDL.Bool,
          }),
        ],
        ['query'],
      ),
    'getPendingKYCDocuments' : IDL.Func([], [IDL.Vec(KYCDocument)], ['query']),
    'getProfilePicture' : IDL.Func([], [IDL.Opt(IDL.Vec(IDL.Nat8))], []),
    'getTotalUsers' : IDL.Func([], [IDL.Nat], ['query']),
    'getTransaction' : IDL.Func([IDL.Text], [IDL.Opt(Transaction)], ['query']),
    'getTransactionHistory' : IDL.Func([], [IDL.Vec(Transaction)], []),
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
    'getUserDocuments' : IDL.Func([], [IDL.Vec(KYCDocument)], []),
    'getUserStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'kycPending' : IDL.Nat,
            'totalWallets' : IDL.Nat,
            'verifiedUsers' : IDL.Nat,
            'totalUsers' : IDL.Nat,
            'kycCompleted' : IDL.Nat,
            'kycInReview' : IDL.Nat,
            'kycRejected' : IDL.Nat,
            'totalTransactions' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getUsersByRole' : IDL.Func([UserRole], [IDL.Vec(User)], ['query']),
    'getWallet' : IDL.Func([], [Result_3], []),
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
            'userCount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'registerUser' : IDL.Func(
        [
          AuthMethod,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Vec(IDL.Nat8)),
        ],
        [Result],
        [],
      ),
    'reviewKYCDocument' : IDL.Func(
        [IDL.Text, IDL.Bool, IDL.Opt(IDL.Text)],
        [Result_2],
        [],
      ),
    'setUserRole' : IDL.Func(
        [
          UserRole,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [Result],
        [],
      ),
    'setWalletLock' : IDL.Func([IDL.Principal, IDL.Bool], [Result_2], []),
    'submitKYCForReview' : IDL.Func([], [Result_1], []),
    'transfer' : IDL.Func(
        [IDL.Principal, IDL.Nat, TokenType, IDL.Opt(IDL.Text)],
        [Result_1],
        [],
      ),
    'updateKYCStatus' : IDL.Func([KYCStatus], [Result], []),
    'updateProfile' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [Result],
        [],
      ),
    'updateProfilePicture' : IDL.Func([IDL.Vec(IDL.Nat8)], [Result], []),
    'uploadKYCDocument' : IDL.Func(
        [DocumentType, IDL.Text, IDL.Vec(IDL.Nat8), IDL.Text],
        [Result_1],
        [],
      ),
    'userExists' : IDL.Func([], [IDL.Bool], []),
    'validateSession' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
