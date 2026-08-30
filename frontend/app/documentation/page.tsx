// app/documentation/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Menu,
  X,
  Github,
  Twitter,
  Linkedin,
  Monitor,
  Moon,
  Sun,
  ArrowRight,
  BookOpen,
  Layers,
  Rocket,
  Shield,
  Wallet,
  Code2,
  Database,
  Server,
  Map,
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  FolderTree,
  Cpu,
  Fingerprint,
  CheckCircle,
  Clock,
  Circle,
  AlertTriangle,
  Target,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CANISTER_ID = 'wuprw-oqaaa-aaaae-qfx4a-cai';
const FRONTEND_CANISTER_ID = 'yfmxz-kyaaa-aaaaj-a2gqq-cai';
const CANDID_URL = `https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=${CANISTER_ID}`;
const LIVE_URL = 'https://trade-chain-icp.vercel.app';
const REPO_URL = 'https://github.com/TradeChain-ICP/tradechain';

const sections = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'scope', label: 'Project Scope', icon: Target },
  { id: 'architecture', label: 'Architecture', icon: Layers },
  { id: 'getting-started', label: 'Getting Started', icon: Rocket },
  { id: 'authentication', label: 'Auth, Roles & KYC', icon: Fingerprint },
  { id: 'wallet', label: 'Wallet & Transactions', icon: Wallet },
  { id: 'api', label: 'Canister API', icon: Code2 },
  { id: 'types', label: 'Data Types', icon: Database },
  { id: 'frontend', label: 'Frontend Integration', icon: Cpu },
  { id: 'deployment', label: 'Deployment', icon: Server },
  { id: 'structure', label: 'Project Structure', icon: FolderTree },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'faq', label: 'FAQ & Resources', icon: HelpCircle },
];

// ---------------------------------------------------------------------------
// Content data
// ---------------------------------------------------------------------------

type ScopeStatus = 'live' | 'partial' | 'planned';

const scopeItems: { area: string; status: ScopeStatus; detail: string }[] = [
  {
    area: 'Authentication (Internet Identity + NFID)',
    status: 'live',
    detail: 'Passwordless login via ICP-native identity providers, 30-minute idle session timeout.',
  },
  {
    area: 'User registration & profiles',
    status: 'live',
    detail: 'On-chain user records with name, email, phone, bio, company, website and profile picture.',
  },
  {
    area: 'Role selection (Buyer / Seller)',
    status: 'live',
    detail: 'Users pick a role after first login; routes and dashboards are guarded by role.',
  },
  {
    area: 'KYC document verification',
    status: 'live',
    detail: 'Upload ID front/back, selfie and proof of address; submit for review; status tracking.',
  },
  {
    area: 'Integrated multi-currency wallet',
    status: 'live',
    detail: 'ICP, USD, Naira and Euro balances with transfer, deposit and transaction history.',
  },
  {
    area: 'Buyer dashboard',
    status: 'live',
    detail: 'Marketplace, orders, portfolio, favorites, history, AI insights and wallet views.',
  },
  {
    area: 'Seller dashboard',
    status: 'live',
    detail: 'Products, inventory, orders, analytics, earnings, performance and price optimizer.',
  },
  {
    area: 'AI market insights',
    status: 'partial',
    detail: 'Portfolio insights and recommendations driven by live CoinGecko / ExchangeRate data on the client. Dedicated AI Insights canister is planned.',
  },
  {
    area: 'Marketplace listings',
    status: 'partial',
    detail: 'Browse, search, category and product pages are complete in the UI. Listings are served from frontend data; the Marketplace canister is planned.',
  },
  {
    area: 'Cart & checkout',
    status: 'partial',
    detail: 'Cart drawer, checkout and order-tracking flows exist in the UI; on-chain settlement waits on the Escrow canister.',
  },
  {
    area: 'Smart contract escrow',
    status: 'planned',
    detail: 'Funds held on-chain and released on delivery confirmation. Transaction type `escrow` is already reserved in the wallet.',
  },
  {
    area: 'Admin permission checks',
    status: 'planned',
    detail: 'Admin methods (KYC review, wallet lock) currently have no caller authorization. Must be restricted before production use.',
  },
  {
    area: 'Notifications canister',
    status: 'planned',
    detail: 'On-chain notification feed for orders, KYC decisions and wallet activity.',
  },
  {
    area: 'Mobile app',
    status: 'planned',
    detail: 'Native mobile experience after public launch.',
  },
];

type ApiMethod = {
  name: string;
  signature: string;
  returns: string;
  kind: 'update' | 'query';
  description: string;
};

const apiGroups: { title: string; description: string; methods: ApiMethod[] }[] = [
  {
    title: 'Users & Profiles',
    description: 'Registration and profile management. All methods are scoped to the caller principal.',
    methods: [
      {
        name: 'registerUser',
        signature: '(AuthMethod, firstName: text, lastName: text, email: text, phone: opt text, profilePicture: opt blob)',
        returns: 'Result_User',
        kind: 'update',
        description: 'Creates a user for the calling principal and provisions a wallet. Fails if the user already exists.',
      },
      {
        name: 'setUserRole',
        signature: '(UserRole, bio: opt text, location: opt text, company: opt text, website: opt text)',
        returns: 'Result_User',
        kind: 'update',
        description: 'Assigns buyer or seller role and optional profile details after first login.',
      },
      {
        name: 'getCurrentUser',
        signature: '()',
        returns: 'Result_User',
        kind: 'update',
        description: 'Returns the caller’s user record, updating lastActive.',
      },
      {
        name: 'updateProfile',
        signature: '(firstName, lastName, email, phone, bio, location, company, website)',
        returns: 'Result_User',
        kind: 'update',
        description: 'Updates the caller’s profile fields. Optional fields accept `opt text`.',
      },
      {
        name: 'updateProfilePicture',
        signature: '(blob)',
        returns: 'Result_User',
        kind: 'update',
        description: 'Stores a new profile image for the caller.',
      },
      {
        name: 'getProfilePicture',
        signature: '()',
        returns: 'opt blob',
        kind: 'update',
        description: 'Returns the caller’s profile image bytes if set.',
      },
    ],
  },
  {
    title: 'Session',
    description: 'Lightweight helpers used by the frontend auth context on app load.',
    methods: [
      {
        name: 'validateSession',
        signature: '()',
        returns: 'Result_User',
        kind: 'update',
        description: 'Confirms the caller has a registered account and returns it.',
      },
      {
        name: 'userExists',
        signature: '()',
        returns: 'bool',
        kind: 'update',
        description: 'Whether the calling principal already has a user record.',
      },
    ],
  },
  {
    title: 'KYC',
    description: 'Document upload and review workflow. Review methods are intended for admins.',
    methods: [
      {
        name: 'uploadKYCDocument',
        signature: '(DocumentType, fileName: text, fileData: blob, mimeType: text)',
        returns: 'Result_Text',
        kind: 'update',
        description: 'Uploads one document (idFront, idBack, selfie, proofOfAddress). Returns the document id.',
      },
      {
        name: 'getUserDocuments',
        signature: '()',
        returns: 'vec KYCDocument',
        kind: 'update',
        description: 'Lists the caller’s uploaded documents with their review status.',
      },
      {
        name: 'submitKYCForReview',
        signature: '()',
        returns: 'Result_Text',
        kind: 'update',
        description: 'Moves the caller’s KYC status from pending to inReview once required documents exist.',
      },
      {
        name: 'updateKYCStatus',
        signature: '(KYCStatus)',
        returns: 'Result_User',
        kind: 'update',
        description: 'Sets the caller’s KYC status directly.',
      },
      {
        name: 'getDocument',
        signature: '(documentId: text)',
        returns: 'opt KYCDocument',
        kind: 'query',
        description: 'Fetch a single document by id (admin).',
      },
      {
        name: 'reviewKYCDocument',
        signature: '(documentId: text, approved: bool, rejectionReason: opt text)',
        returns: 'Result_Unit',
        kind: 'update',
        description: 'Approve or reject a document (admin).',
      },
      {
        name: 'completeKYCVerification',
        signature: '(user: principal)',
        returns: 'Result_Unit',
        kind: 'update',
        description: 'Marks a user as verified once all documents are approved (admin).',
      },
      {
        name: 'getPendingKYCDocuments',
        signature: '()',
        returns: 'vec KYCDocument',
        kind: 'query',
        description: 'All documents awaiting review (admin).',
      },
      {
        name: 'getKYCStatistics',
        signature: '()',
        returns: 'KYCStats',
        kind: 'query',
        description: 'Aggregate counts of documents and users by KYC state.',
      },
    ],
  },
  {
    title: 'Wallet',
    description: 'Each user has one wallet holding ICP, USD, Naira and Euro balances (stored as `nat`, smallest unit).',
    methods: [
      {
        name: 'getWallet',
        signature: '()',
        returns: 'Result_Wallet',
        kind: 'update',
        description: 'Returns the caller’s wallet with all balances.',
      },
      {
        name: 'getBalance',
        signature: '(TokenType)',
        returns: 'Result_Nat',
        kind: 'update',
        description: 'Balance for a single token type.',
      },
      {
        name: 'transfer',
        signature: '(to: principal, amount: nat, TokenType, memo: opt text)',
        returns: 'Result_Text',
        kind: 'update',
        description: 'Moves funds to another user’s wallet. Fails if locked or insufficient. Returns the transaction id.',
      },
      {
        name: 'addFunds',
        signature: '(amount: nat, TokenType)',
        returns: 'Result_Unit',
        kind: 'update',
        description: 'Credits the caller’s wallet (deposit). Records a `deposit` transaction.',
      },
      {
        name: 'getTransactionHistory',
        signature: '()',
        returns: 'vec Transaction',
        kind: 'update',
        description: 'All transactions where the caller is sender or recipient.',
      },
      {
        name: 'getTransaction',
        signature: '(transactionId: text)',
        returns: 'opt Transaction',
        kind: 'query',
        description: 'Look up a single transaction.',
      },
      {
        name: 'setWalletLock',
        signature: '(user: principal, locked: bool)',
        returns: 'Result_Unit',
        kind: 'update',
        description: 'Freeze or unfreeze a wallet (admin).',
      },
    ],
  },
  {
    title: 'Statistics & Health',
    description: 'Read-only aggregates, useful for admin dashboards and monitoring.',
    methods: [
      {
        name: 'healthCheck',
        signature: '()',
        returns: 'HealthCheck',
        kind: 'query',
        description: 'Status string, timestamp, user count and wallet count.',
      },
      {
        name: 'getUserStats',
        signature: '()',
        returns: 'UserStats',
        kind: 'query',
        description: 'Totals for users, verified users, KYC states, wallets and transactions.',
      },
      {
        name: 'getWalletStats',
        signature: '()',
        returns: 'WalletStats',
        kind: 'query',
        description: 'Wallet count, transaction count and total ICP / USD locked.',
      },
      {
        name: 'getTotalUsers',
        signature: '()',
        returns: 'nat',
        kind: 'query',
        description: 'Number of registered users.',
      },
      {
        name: 'getUserCountByRole',
        signature: '()',
        returns: 'vec record { UserRole; nat }',
        kind: 'query',
        description: 'User counts per role.',
      },
      {
        name: 'getUsersByRole',
        signature: '(UserRole)',
        returns: 'vec User',
        kind: 'query',
        description: 'All users with the given role (admin).',
      },
      {
        name: 'getUserByPrincipal',
        signature: '(principal)',
        returns: 'opt User',
        kind: 'query',
        description: 'Look up a user by principal (admin).',
      },
    ],
  },
  {
    title: 'Migration',
    description: 'Stable-memory upgrade helpers. The canister uses enhanced orthogonal persistence.',
    methods: [
      {
        name: 'getMigrationStatus',
        signature: '()',
        returns: 'MigrationStatus',
        kind: 'query',
        description: 'Current schema version and whether migration completed.',
      },
      {
        name: 'forceMigration',
        signature: '()',
        returns: 'Result_Text',
        kind: 'update',
        description: 'Re-runs data migration after an upgrade.',
      },
    ],
  },
];

const envVars = [
  { name: 'NEXT_PUBLIC_DFX_NETWORK', example: 'local | ic', purpose: 'Which network the frontend targets.' },
  { name: 'NEXT_PUBLIC_IC_HOST', example: 'http://localhost:4943', purpose: 'HTTP gateway for the agent. Use https://icp-api.io on mainnet.' },
  { name: 'NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID', example: CANISTER_ID, purpose: 'Canister the frontend creates its actor against.' },
  { name: 'NEXT_PUBLIC_INTERNET_IDENTITY_URL', example: 'https://identity.ic0.app', purpose: 'Internet Identity provider URL. Locally, the II canister served by dfx.' },
  { name: 'NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID', example: 'uxrrr-q7777-77774-qaaaq-cai', purpose: 'Local Internet Identity canister id.' },
  { name: 'NEXT_PUBLIC_NFID_URL', example: 'https://nfid.one/authenticate', purpose: 'NFID authentication endpoint.' },
  { name: 'NEXT_PUBLIC_DISABLE_SIGNATURE_VALIDATION', example: 'true | false', purpose: 'Skip query signature checks and fetch the root key. Local development only.' },
  { name: 'NEXT_PUBLIC_ENABLE_MOCK_AUTH', example: 'true | false', purpose: 'Use a mock actor when the canister is unreachable during development.' },
];

const roadmap = [
  {
    phase: 'Phase 1 — Foundation',
    status: 'done' as const,
    items: ['MVP UI/UX across 30+ pages', 'User Management canister (auth, profiles, KYC, wallet)', 'Internet Identity + NFID integration'],
  },
  {
    phase: 'Phase 2 — Mainnet & Intelligence',
    status: 'active' as const,
    items: ['Mainnet deployment (live)', 'AI insights with live market data', 'Beta testing with real users', 'Frontend hosted as an ICP asset canister'],
  },
  {
    phase: 'Phase 3 — Marketplace on-chain',
    status: 'next' as const,
    items: ['Marketplace canister for listings & orders', 'Escrow canister with delivery-triggered release', 'Notifications canister', 'Admin authorization model'],
  },
  {
    phase: 'Phase 4 — Scale',
    status: 'next' as const,
    items: ['Public launch', 'Mobile app', 'Tokenized fiat on/off ramps', 'Commodity supplier partnerships'],
  },
];

const faqs = [
  {
    q: 'Do I need a wallet extension or seed phrase to use TradeChain?',
    a: 'No. TradeChain authenticates with Internet Identity or NFID, both of which use passkeys / WebAuthn. Your principal is derived from your identity and a wallet is created for you on first registration.',
  },
  {
    q: 'Where is user data stored?',
    a: 'All user, KYC and wallet records live in the user_management canister on the Internet Computer. Nothing is stored on a centralized server. KYC document bytes are stored on-chain as blobs.',
  },
  {
    q: 'Are wallet balances real tokens?',
    a: 'Balances are ledger entries inside the canister today, not ICRC-1 ledger tokens. Integration with the ICP ledger and tokenized fiat rails is on the roadmap.',
  },
  {
    q: 'Why does the frontend fall back to a "mock actor"?',
    a: 'In development, if the generated declarations are missing or the canister is unreachable, lib/icp-agent.ts returns mock responses so UI work can continue. Set NEXT_PUBLIC_ENABLE_MOCK_AUTH=false in production.',
  },
  {
    q: 'How do I regenerate the TypeScript bindings after changing main.mo?',
    a: 'Run `dfx generate` (or `npm run generate` from the repo root). Output goes to frontend/declarations as configured in dfx.json.',
  },
];

// ---------------------------------------------------------------------------
// Small UI helpers
// ---------------------------------------------------------------------------

function CodeBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="group relative rounded-xl border border-border bg-muted/40 dark:bg-muted/20">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{lang}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StatusBadge({ status }: { status: ScopeStatus }) {
  const map = {
    live: { label: 'Live', cls: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30', Icon: CheckCircle },
    partial: { label: 'Partial', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30', Icon: Clock },
    planned: { label: 'Planned', cls: 'bg-muted text-muted-foreground border-border', Icon: Circle },
  }[status];
  const Icon = map.Icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${map.cls}`}>
      <Icon className="h-3 w-3" />
      {map.label}
    </span>
  );
}

function KindBadge({ kind }: { kind: 'update' | 'query' }) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
        kind === 'query'
          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
          : 'bg-primary/10 text-primary'
      }`}
    >
      {kind}
    </span>
  );
}

function SectionHeading({
  id,
  title,
  subtitle,
  icon: Icon,
}: {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="mb-6 scroll-mt-24" id={id}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h2>
      </div>
      {subtitle && <p className="mt-3 text-base text-muted-foreground font-medium leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warn';
  title: string;
  children: React.ReactNode;
}) {
  const cls =
    tone === 'warn'
      ? 'border-amber-500/40 bg-amber-500/5'
      : 'border-primary/40 bg-primary/5';
  const Icon = tone === 'warn' ? AlertTriangle : Shield;
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone === 'warn' ? 'text-amber-500' : 'text-primary'}`} />
        <div className="space-y-1">
          <p className="font-bold">{title}</p>
          <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DocumentationPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll-spy for the side navigation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="h-4 w-4" />;
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const navLinkClass =
    'text-base font-semibold text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full';

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header - Same as landing page */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight">
                <span className="text-primary">Trade</span>
                <span className="text-foreground dark:text-foreground/80">Chain</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className={navLinkClass}>
                Features
              </Link>
              <Link href="/#about" className={navLinkClass}>
                About
              </Link>
              <Link
                href="/documentation"
                className="text-base font-semibold text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
              >
                Docs
              </Link>
              <Link href="/support" className={navLinkClass}>
                Support
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => window.open(REPO_URL, '_blank')}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted hover:scale-105 transition-all shadow-sm"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </button>
              <button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted hover:scale-105 transition-all shadow-sm"
                aria-label="Toggle theme"
              >
                {getThemeIcon()}
              </button>
              <Link href="/connect">
                <button className="group relative overflow-hidden h-10 px-6 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
            </div>

            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background"
                aria-label="Toggle theme"
              >
                {getThemeIcon()}
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] overflow-y-auto bg-background border-l border-border shadow-2xl md:hidden">
            <div className="flex h-16 items-center justify-between px-6 border-b border-border">
              <span className="text-lg font-bold">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col p-6 space-y-2">
              <Link
                href="/#features"
                className="py-3 text-base font-semibold text-muted-foreground hover:text-foreground border-b border-border/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#about"
                className="py-3 text-base font-semibold text-muted-foreground hover:text-foreground border-b border-border/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/support"
                className="py-3 text-base font-semibold text-muted-foreground hover:text-foreground border-b border-border/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>

              <p className="pt-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                On this page
              </p>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}

              <Link href="/connect" onClick={() => setMobileMenuOpen(false)} className="pt-6">
                <button className="w-full h-12 px-6 bg-primary text-primary-foreground rounded-xl text-base font-bold shadow-lg">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <BookOpen className="h-4 w-4" />
              Developer & Product Documentation
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              Build on <span className="text-primary">TradeChain</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">
              Everything you need to understand, run, integrate with and deploy the TradeChain
              commodity marketplace on the Internet Computer.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a href="#getting-started">
                <button className="h-11 px-6 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  Quick Start
                </button>
              </a>
              <a href={CANDID_URL} target="_blank" rel="noreferrer">
                <button className="flex h-11 items-center gap-2 px-6 rounded-xl border border-border bg-background text-sm font-bold hover:bg-muted transition-all">
                  Candid UI <ExternalLink className="h-4 w-4" />
                </button>
              </a>
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                <button className="flex h-11 items-center gap-2 px-6 rounded-xl border border-border bg-background text-sm font-bold hover:bg-muted transition-all">
                  <Github className="h-4 w-4" /> Source
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mx-auto flex max-w-7xl gap-10 lg:gap-14">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-1">
              <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                On this page
              </p>
              {sections.map((s) => {
                const Icon = s.icon;
                const active = activeSection === s.id;
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {s.label}
                  </a>
                );
              })}
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-20">
            {/* ------------------------------------------------------------ */}
            <section>
              <SectionHeading
                id="overview"
                icon={BookOpen}
                title="Overview"
                subtitle="TradeChain is a Web3 marketplace on the Internet Computer where everyday users can buy and sell real-world commodities — gold, oil, crops, timber — using ICP or tokenized fiat. Think Amazon meets commodity futures, built for retail users."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Backend canister (mainnet)</p>
                  <code className="block break-all text-sm font-semibold">{CANISTER_ID}</code>
                  <a href={CANDID_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                    Open Candid interface <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Frontend asset canister (mainnet)</p>
                  <code className="block break-all text-sm font-semibold">{FRONTEND_CANISTER_ID}</code>
                  <a href={LIVE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                    Live demo <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { title: 'Democratized access', body: 'Lower the entry barrier from six-figure minimums to amounts anyone can afford.' },
                  { title: 'On-chain trust', body: 'User records, KYC and wallets live in Motoko canisters — no central database.' },
                  { title: 'AI-assisted decisions', body: 'Portfolio insights and price signals driven by live market data.' },
                ].map((c) => (
                  <div key={c.title} className="rounded-xl border border-border bg-card p-5">
                    <p className="font-bold">{c.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            <section>
              <SectionHeading
                id="scope"
                icon={Target}
                title="Project Scope"
                subtitle="What TradeChain sets out to deliver, what is shipped today, and what is still ahead. Use this as the source of truth when planning work or evaluating the platform."
              />

              <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                    <p className="font-bold">Problem</p>
                    <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground leading-relaxed">
                      <li>Hard-commodity trading is restricted to institutions and high-net-worth buyers.</li>
                      <li>$100K+ minimums, months-long onboarding and opaque pricing shut out retail investors.</li>
                      <li>420M+ crypto users have no compliant on-ramp into a $2.2T asset class.</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                    <p className="font-bold">Solution</p>
                    <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground leading-relaxed">
                      <li>A marketplace where verified sellers list physical commodities and buyers purchase with ICP or tokenized fiat.</li>
                      <li>Identity, KYC and wallets held on-chain; escrow releases funds on delivery.</li>
                      <li>Institutional-grade insights surfaced to everyone through an AI layer.</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">Target users</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { role: 'Buyers', body: 'Retail investors and small businesses sourcing commodities or hedging with real assets. Onboard, verify, fund a wallet, browse, buy and track orders.' },
                      { role: 'Sellers', body: 'Producers, cooperatives and traders listing inventory. Manage products, pricing, orders, earnings and performance analytics.' },
                      { role: 'Admins', body: 'Platform operators reviewing KYC documents, monitoring statistics and managing wallet locks.' },
                    ].map((u) => (
                      <div key={u.role} className="rounded-xl border border-border bg-card p-5">
                        <p className="font-bold text-primary">{u.role}</p>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{u.body}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">Feature scope & current status</h3>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-[640px] text-sm">
                      <thead className="bg-muted/50 text-left">
                        <tr>
                          <th className="px-4 py-3 font-bold">Area</th>
                          <th className="px-4 py-3 font-bold">Status</th>
                          <th className="px-4 py-3 font-bold">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {scopeItems.map((item) => (
                          <tr key={item.area} className="align-top">
                            <td className="px-4 py-3 font-semibold">{item.area}</td>
                            <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                            <td className="px-4 py-3 text-muted-foreground leading-relaxed">{item.detail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                    <p className="font-bold">In scope</p>
                    <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground leading-relaxed">
                      <li>ICP-native identity (Internet Identity, NFID) — no passwords, no seed phrases.</li>
                      <li>Buyer, seller and admin experiences with role-guarded routing.</li>
                      <li>KYC/AML document verification workflow.</li>
                      <li>Multi-currency wallet: ICP, USD, Naira, Euro.</li>
                      <li>Commodity categories: precious metals, energy, agriculture, timber.</li>
                      <li>Static, exportable Next.js frontend deployable to Vercel or an ICP asset canister.</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                    <p className="font-bold">Out of scope (for now)</p>
                    <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground leading-relaxed">
                      <li>Physical logistics, warehousing and custody — handled by sellers and partners.</li>
                      <li>Derivatives, leverage or futures contracts.</li>
                      <li>Direct fiat card processing; fiat is represented as tokenized balances.</li>
                      <li>Cross-chain bridging to EVM or Bitcoin.</li>
                      <li>Regulatory licensing in specific jurisdictions (tracked separately).</li>
                    </ul>
                  </div>
                </div>

                <Callout tone="warn" title="Known limitation: admin authorization">
                  Admin-only methods (<code>reviewKYCDocument</code>, <code>completeKYCVerification</code>,{' '}
                  <code>setWalletLock</code>, <code>getPendingKYCDocuments</code>) do not yet verify the caller.
                  Any principal can call them on the current mainnet build. Restricting these to controller or
                  allow-listed principals is a Phase 3 deliverable and must ship before handling real funds.
                </Callout>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            <section>
              <SectionHeading
                id="architecture"
                icon={Layers}
                title="Architecture"
                subtitle="A Next.js client talks directly to Motoko canisters over the IC HTTP gateway. There is no traditional backend server."
              />
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                  <p className="font-bold">Frontend</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Next.js 15 App Router, React 18, TypeScript</li>
                    <li>TailwindCSS + shadcn/ui (Radix primitives)</li>
                    <li>React Context for auth, products, sidebar</li>
                    <li>@dfinity/agent, auth-client, candid, principal</li>
                    <li>Recharts for analytics, next-themes for theming</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                  <p className="font-bold">On-chain (ICP)</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li><strong className="text-foreground">user_management</strong> — users, roles, KYC, wallet, stats (live)</li>
                    <li><strong className="text-foreground">internet_identity</strong> — local II canister for dev</li>
                    <li><strong className="text-foreground">frontend</strong> — asset canister serving the static build</li>
                    <li className="text-muted-foreground/70">marketplace, escrow, notifications, ai_insights — planned</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                  <p className="font-bold">External services</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Internet Identity (identity.ic0.app)</li>
                    <li>NFID (nfid.one)</li>
                    <li>CoinGecko API — live crypto prices</li>
                    <li>ExchangeRate API — fiat conversion</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-lg font-bold">Request flow</h3>
                <CodeBlock
                  lang="text"
                  code={`Browser (Next.js)
   │  1. AuthClient.login() → Internet Identity / NFID popup
   │  2. Delegated identity returned to the browser
   │  3. HttpAgent { host, identity } → Actor.createActor(idlFactory, canisterId)
   ▼
IC HTTP Gateway (icp-api.io / localhost:4943)
   ▼
user_management canister (Motoko)
   ├─ users        : HashMap<Principal, User>
   ├─ wallets      : HashMap<Principal, Wallet>
   ├─ transactions : HashMap<Text, Transaction>
   └─ kycDocuments : HashMap<Text, KYCDocument>
      (stable memory, enhanced orthogonal persistence)`}
                />
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-lg font-bold">Design decisions</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground leading-relaxed">
                  <li><strong className="text-foreground">Single canister for the MVP.</strong> Users, KYC and wallet share one canister to keep calls atomic and avoid inter-canister latency. Splitting into dedicated canisters is planned once the marketplace lands.</li>
                  <li><strong className="text-foreground">Caller-scoped state.</strong> Every user method keys off <code>msg.caller</code>; there are no user-supplied ids for own-account operations.</li>
                  <li><strong className="text-foreground">Result variants, not traps.</strong> Methods return <code>{'{ ok; err: text }'}</code> so the UI can surface errors without failed calls.</li>
                  <li><strong className="text-foreground">Static export.</strong> The frontend builds to static assets so it can be served from an ICP asset canister as well as Vercel.</li>
                </ul>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            <section>
              <SectionHeading
                id="getting-started"
                icon={Rocket}
                title="Getting Started"
                subtitle="Run the full stack locally in about five minutes."
              />
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-bold">Prerequisites</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>Node.js 18+ and npm</li>
                    <li>DFX (Internet Computer SDK) 0.15+</li>
                    <li>Mops (Motoko package manager) — used as the packtool in <code>dfx.json</code></li>
                  </ul>
                  <div className="mt-3">
                    <CodeBlock
                      code={`# Install DFX
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Install mops
npm i -g ic-mops`}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">1. Clone and install</h3>
                  <CodeBlock
                    code={`git clone ${REPO_URL}.git
cd tradechain
npm install                 # root: dfx helper scripts
cd frontend && npm install && cd ..`}
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">2. Start a local replica and deploy</h3>
                  <CodeBlock
                    code={`dfx start --background --clean
dfx deploy user_management
dfx deploy internet_identity
dfx generate                # writes TS bindings to frontend/declarations

# Grab the local canister ids
dfx canister id user_management
dfx canister id internet_identity`}
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">3. Configure the frontend</h3>
                  <p className="mb-3 text-sm text-muted-foreground">Create <code>frontend/.env.local</code>:</p>
                  <CodeBlock
                    lang="env"
                    code={`NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_IC_HOST=http://localhost:4943
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=<user_management id>
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=<internet_identity id>
NEXT_PUBLIC_INTERNET_IDENTITY_URL=http://localhost:4943/?canisterId=<internet_identity id>
NEXT_PUBLIC_NFID_URL=https://nfid.one/authenticate
NEXT_PUBLIC_DISABLE_SIGNATURE_VALIDATION=true
NEXT_PUBLIC_ENABLE_MOCK_AUTH=false`}
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">4. Run</h3>
                  <CodeBlock
                    code={`cd frontend && npm run dev
# → http://localhost:3000

# Smoke-test the canister from the repo root
npm run canister:call:health`}
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">Useful root scripts</h3>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead className="bg-muted/50 text-left">
                        <tr>
                          <th className="px-4 py-3 font-bold">Script</th>
                          <th className="px-4 py-3 font-bold">What it does</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {[
                          ['npm run replica:start', 'dfx start --background'],
                          ['npm run replica:clean', 'Start a fresh replica, wiping local state'],
                          ['npm run canister:status', 'dfx canister status --all'],
                          ['npm run canister:call:health', 'Calls healthCheck on user_management'],
                          ['npm run generate', 'Regenerate TypeScript declarations'],
                          ['npm run frontend:dev', 'Start the Next.js dev server'],
                          ['npm run frontend:build', 'Production build of the frontend'],
                        ].map(([cmd, desc]) => (
                          <tr key={cmd}>
                            <td className="px-4 py-3"><code className="text-xs font-semibold">{cmd}</code></td>
                            <td className="px-4 py-3 text-muted-foreground">{desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            <section>
              <SectionHeading
                id="authentication"
                icon={Fingerprint}
                title="Authentication, Roles & KYC"
                subtitle="Identity comes from ICP-native providers; everything else is keyed to the resulting principal."
              />
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-bold">Login flow</h3>
                  <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground leading-relaxed">
                    <li>User clicks <em>Connect</em> and picks Internet Identity or NFID on <code>/connect</code>.</li>
                    <li><code>AuthClient.login()</code> opens the provider; a delegated identity is returned to the browser.</li>
                    <li>The auth context calls <code>userExists()</code>. New users are sent to registration, then <code>registerUser(...)</code> creates the record and wallet.</li>
                    <li>Users without a role are routed to <code>/role-selection</code>, which calls <code>setUserRole(...)</code>.</li>
                    <li>Buyers land on <code>/dashboard/buyer</code>, sellers on <code>/dashboard/seller</code>. Route access is enforced by <code>components/auth/role-guard.tsx</code>.</li>
                    <li>Sessions idle out after 30 minutes; <code>validateSession()</code> is re-checked on reload.</li>
                  </ol>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">KYC lifecycle</h3>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-[560px] text-sm">
                      <thead className="bg-muted/50 text-left">
                        <tr>
                          <th className="px-4 py-3 font-bold">Status</th>
                          <th className="px-4 py-3 font-bold">Meaning</th>
                          <th className="px-4 py-3 font-bold">Transition</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {[
                          ['pending', 'Account created, no documents submitted.', 'Default after registerUser'],
                          ['inReview', 'Documents uploaded and submitted; awaiting admin review.', 'submitKYCForReview()'],
                          ['completed', 'All documents approved; user.verified = true.', 'completeKYCVerification(principal)'],
                          ['rejected', 'One or more documents rejected with a reason.', 'reviewKYCDocument(id, false, reason)'],
                        ].map(([s, m, t]) => (
                          <tr key={s} className="align-top">
                            <td className="px-4 py-3"><code className="font-semibold">{s}</code></td>
                            <td className="px-4 py-3 text-muted-foreground">{m}</td>
                            <td className="px-4 py-3"><code className="text-xs">{t}</code></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Required documents: <code>idFront</code>, <code>idBack</code>, <code>selfie</code>, <code>proofOfAddress</code>. Each is a{' '}
                    <code>KYCDocument</code> with its own <code>pending → approved | rejected</code> status.
                  </p>
                </div>

                <Callout title="Privacy note">
                  KYC document bytes are stored on-chain inside the canister. Only the canister can read them, and
                  they are returned solely through the admin review methods. Do not log document blobs on the client.
                </Callout>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            <section>
              <SectionHeading
                id="wallet"
                icon={Wallet}
                title="Wallet & Transactions"
                subtitle="Every registered user gets one wallet with four balances. Transfers are settled inside the canister."
              />
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card p-5">
                    <p className="font-bold">Token types</p>
                    <p className="mt-1 text-sm text-muted-foreground"><code>ICP</code>, <code>USD</code>, <code>Naira</code>, <code>Euro</code>. Balances are <code>nat</code> in the smallest unit (e8s for ICP, cents/kobo for fiat).</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-5">
                    <p className="font-bold">Transaction types</p>
                    <p className="mt-1 text-sm text-muted-foreground"><code>transfer</code>, <code>deposit</code>, <code>withdrawal</code>, <code>escrow</code>, <code>payment</code>, <code>refund</code> — each with status <code>pending | completed | failed | cancelled</code>.</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">Transfer rules</h3>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground leading-relaxed">
                    <li>Sender and recipient must both be registered users.</li>
                    <li>Sender wallet must not be locked (<code>isLocked = false</code>).</li>
                    <li>Balance for the chosen token must cover the amount; otherwise <code>err</code> is returned and nothing changes.</li>
                    <li>On success both wallets update atomically and a <code>completed</code> transaction is recorded with an id returned to the caller.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">Example: transfer from the frontend</h3>
                  <CodeBlock
                    lang="ts"
                    code={`import { Principal } from '@dfinity/principal';
import { IcpAgent } from '@/lib/icp-agent';

const actor = IcpAgent.getUserManagementActor();

const result = await actor.transfer(
  Principal.fromText('<recipient principal>'),
  250_000_000n,          // 2.5 ICP in e8s
  { ICP: null },         // TokenType variant
  ['Invoice #1042'],     // opt text → [] | [value]
);

if ('ok' in result) console.log('tx id', result.ok);
else console.error(result.err);`}
                  />
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            <section>
              <SectionHeading
                id="api"
                icon={Code2}
                title="Canister API Reference"
                subtitle={`Public interface of user_management (${CANISTER_ID}). Update calls go through consensus; query calls are fast and read-only.`}
              />
              <div className="space-y-10">
                {apiGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-lg font-bold">{group.title}</h3>
                    <p className="mb-4 mt-1 text-sm text-muted-foreground">{group.description}</p>
                    <div className="divide-y divide-border rounded-xl border border-border">
                      {group.methods.map((m) => (
                        <div key={m.name} className="p-4 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <code className="text-sm font-bold text-primary">{m.name}</code>
                            <KindBadge kind={m.kind} />
                          </div>
                          <code className="block overflow-x-auto whitespace-pre text-xs text-muted-foreground">
                            {m.signature} → {m.returns}
                          </code>
                          <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div>
                  <h3 className="mb-3 text-lg font-bold">Calling from the CLI</h3>
                  <CodeBlock
                    code={`# Local
dfx canister call user_management healthCheck
dfx canister call user_management getUserStats

# Mainnet
dfx canister --network ic call ${CANISTER_ID} healthCheck
dfx canister --network ic call ${CANISTER_ID} getBalance '(variant { ICP })'`}
                  />
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            <section>
              <SectionHeading
                id="types"
                icon={Database}
                title="Data Types"
                subtitle="Core Candid records returned by the API. Timestamps are nanoseconds since epoch (int)."
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <CodeBlock
                  lang="candid"
                  code={`type User = record {
  id            : text;
  principalId   : text;
  firstName     : text;
  lastName      : text;
  email         : text;
  phone         : opt text;
  profilePicture: opt blob;
  role          : opt UserRole;     // buyer | seller
  authMethod    : AuthMethod;       // nfid | internetIdentity
  kycStatus     : KYCStatus;        // pending | inReview | completed | rejected
  kycSubmittedAt: opt int;
  verified      : bool;
  walletAddress : text;
  bio           : opt text;
  location      : opt text;
  company       : opt text;
  website       : opt text;
  joinedAt      : int;
  lastActive    : int;
};`}
                />
                <CodeBlock
                  lang="candid"
                  code={`type Wallet = record {
  owner             : principal;
  icpBalance        : nat;
  usdBalance        : nat;
  nairaBalance      : nat;
  euroBalance       : nat;
  createdAt         : int;
  lastTransactionAt : int;
  isLocked          : bool;
  totalTransactions : nat;
};

type Transaction = record {
  id              : text;
  fromPrincipal   : principal;
  toPrincipal     : principal;
  amount          : nat;
  tokenType       : TokenType;
  transactionType : TransactionType;
  status          : TransactionStatus;
  createdAt       : int;
  completedAt     : opt int;
  memo            : opt text;
};`}
                />
                <CodeBlock
                  lang="candid"
                  code={`type KYCDocument = record {
  id              : text;
  owner           : principal;
  docType         : DocumentType;   // idFront | idBack | selfie | proofOfAddress
  fileName        : text;
  fileData        : blob;
  mimeType        : text;
  uploadedAt      : int;
  status          : DocumentStatus; // pending | approved | rejected
  reviewedAt      : opt int;
  reviewedBy      : opt principal;
  rejectionReason : opt text;
};`}
                />
                <CodeBlock
                  lang="candid"
                  code={`type UserStats = record {
  totalUsers; verifiedUsers;
  kycPending; kycInReview; kycCompleted; kycRejected;
  totalWallets; totalTransactions : nat;
};

type HealthCheck = record {
  status      : text;
  timestamp   : int;
  userCount   : nat;
  walletCount : nat;
};

// Every mutating method returns one of:
type Result_User   = variant { ok : User;   err : text };
type Result_Wallet = variant { ok : Wallet; err : text };
type Result_Text   = variant { ok : text;   err : text };
type Result_Nat    = variant { ok : nat;    err : text };
type Result_Unit   = variant { ok;          err : text };`}
                />
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            <section>
              <SectionHeading
                id="frontend"
                icon={Cpu}
                title="Frontend Integration"
                subtitle="How the Next.js app connects to the canister, and the environment variables that control it."
              />
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-bold">Key modules</h3>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-[560px] text-sm">
                      <thead className="bg-muted/50 text-left">
                        <tr>
                          <th className="px-4 py-3 font-bold">File</th>
                          <th className="px-4 py-3 font-bold">Responsibility</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {[
                          ['lib/icp-agent.ts', 'Creates AuthClient, HttpAgent and the user_management actor. Wraps every call with logging and dev-mode fallbacks.'],
                          ['lib/dev-mode-handler.ts', 'Decides when to swap in mock responses during local development.'],
                          ['lib/mock-auth.ts', 'Mock identity used when NEXT_PUBLIC_ENABLE_MOCK_AUTH=true.'],
                          ['contexts/auth-context.tsx', 'Login / logout, registration, role assignment and redirect logic.'],
                          ['contexts/product-context.tsx', 'Marketplace catalog, cart and favorites state.'],
                          ['components/auth/role-guard.tsx', 'Blocks routes unless the user holds the required role.'],
                          ['components/layouts/dashboard-layout.tsx', 'Shared shell for buyer and seller dashboards.'],
                          ['declarations/user_management', 'Generated Candid → TypeScript bindings (dfx generate).'],
                        ].map(([f, r]) => (
                          <tr key={f} className="align-top">
                            <td className="px-4 py-3"><code className="text-xs font-semibold">{f}</code></td>
                            <td className="px-4 py-3 text-muted-foreground">{r}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">Environment variables</h3>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-[640px] text-sm">
                      <thead className="bg-muted/50 text-left">
                        <tr>
                          <th className="px-4 py-3 font-bold">Variable</th>
                          <th className="px-4 py-3 font-bold">Example</th>
                          <th className="px-4 py-3 font-bold">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {envVars.map((v) => (
                          <tr key={v.name} className="align-top">
                            <td className="px-4 py-3"><code className="text-xs font-semibold">{v.name}</code></td>
                            <td className="px-4 py-3"><code className="text-xs text-muted-foreground">{v.example}</code></td>
                            <td className="px-4 py-3 text-muted-foreground">{v.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">Using the actor in a component</h3>
                  <CodeBlock
                    lang="tsx"
                    code={`'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { IcpAgent } from '@/lib/icp-agent';

export function WalletBalance() {
  const { isConnected } = useAuth();
  const [icp, setIcp] = useState<bigint | null>(null);

  useEffect(() => {
    if (!isConnected) return;
    (async () => {
      const actor = IcpAgent.getUserManagementActor();
      const res = await actor.getBalance({ ICP: null });
      if ('ok' in res) setIcp(res.ok);
    })();
  }, [isConnected]);

  return <span>{icp === null ? '—' : \`\${Number(icp) / 1e8} ICP\`}</span>;
}`}
                  />
                </div>

                <Callout title="Candid ↔ TypeScript conventions">
                  Variants are objects with a single null-valued key (<code>{'{ ICP: null }'}</code>). Optional values are
                  arrays (<code>[]</code> for none, <code>[value]</code> for some). <code>nat</code> and <code>int</code> arrive as{' '}
                  <code>bigint</code>. <code>blob</code> is a <code>Uint8Array</code>.
                </Callout>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            <section>
              <SectionHeading
                id="deployment"
                icon={Server}
                title="Deployment"
                subtitle="Three targets: the local replica, ICP mainnet for the canister, and Vercel or an ICP asset canister for the frontend."
              />
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-bold">Mainnet canister</h3>
                  <CodeBlock
                    code={`# One-time: create an identity and fund a cycles wallet
dfx identity new mainnet && dfx identity use mainnet
dfx ledger account-id            # send ICP here
dfx ledger --network ic create-canister $(dfx identity get-principal) --amount 0.5
dfx identity --network ic set-wallet <wallet canister id>

# Deploy / upgrade
dfx deploy --network ic user_management
dfx canister --network ic call user_management healthCheck

# Reinstall from scratch (destroys state — use with care)
scripts/deploy-mainnet-reinstall.sh`}
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">Frontend → ICP asset canister</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    <code>scripts/deploy-frontend-to-icp.sh</code> writes a production <code>.env.production</code>, builds and
                    exports the Next.js app, then deploys it to the <code>frontend</code> asset canister ({FRONTEND_CANISTER_ID}).
                  </p>
                  <CodeBlock code={`chmod +x scripts/*.sh
scripts/deploy-frontend-to-icp.sh`} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">Frontend → Vercel</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Set the same <code>NEXT_PUBLIC_*</code> variables in the Vercel project (network <code>ic</code>, host{' '}
                    <code>https://icp-api.io</code>, mainnet canister id), then:
                  </p>
                  <CodeBlock code={`cd frontend && vercel --prod`} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold">Upgrade checklist</h3>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground leading-relaxed">
                    <li>Bump the migration version in <code>backend/src/user_management/migration.mo</code> when stable types change.</li>
                    <li>Run <code>dfx generate</code> and commit updated <code>frontend/declarations</code>.</li>
                    <li>After <code>dfx deploy --network ic</code>, call <code>getMigrationStatus</code>; call <code>forceMigration</code> if <code>isComplete</code> is false.</li>
                    <li>Verify <code>healthCheck</code> user/wallet counts match pre-upgrade values.</li>
                    <li>Top up cycles: <code>dfx canister --network ic status user_management</code>.</li>
                  </ul>
                </div>

                <p className="text-sm text-muted-foreground">
                  Full walkthroughs: <code>docs/MAINNET_DEPLOYMENT_GUIDE.md</code>, <code>docs/TRADECHAIN_MAINNET_DEPLOYMENT.md</code>,{' '}
                  <code>docs/BACKEND_DEVELOPMENT_GUIDE.md</code>.
                </p>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            <section>
              <SectionHeading id="structure" icon={FolderTree} title="Project Structure" />
              <CodeBlock
                lang="text"
                code={`tradechain/
├── backend/src/user_management/
│   ├── main.mo               # Actor: users, KYC, wallet, stats
│   ├── types.mo              # Shared Motoko types
│   ├── migration.mo          # Stable-memory upgrade logic
│   └── user_management.did   # Candid interface
├── canisters/internet_identity/   # Local II wasm + did
├── frontend/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Landing
│   │   ├── connect/          # Login (II / NFID)
│   │   ├── role-selection/
│   │   ├── documentation/    # This page
│   │   ├── support/
│   │   ├── category/[slug]/  search/  seller/[id]/  cart/  checkout/  order-tracking/
│   │   └── dashboard/
│   │       ├── buyer/        # marketplace, orders, portfolio, wallet, ai-insights, …
│   │       ├── seller/       # products, inventory, orders, analytics, earnings, …
│   │       ├── kyc/  profile/  settings/  messages/  notifications/  help/
│   ├── components/           # ui/ (shadcn), auth/, dashboard/, kyc/, products/, …
│   ├── contexts/             # auth, product, sidebar
│   ├── lib/                  # icp-agent, dev-mode-handler, mock-auth, utils
│   ├── declarations/         # Generated bindings (dfx generate)
│   └── public/
├── docs/                     # Backend & deployment guides
├── scripts/                  # deploy-local-dev, deploy-frontend-to-icp, deploy-mainnet-reinstall, …
├── dfx.json  dfx.local.json  dfx.mainnet.json
├── canister_ids.json         # Mainnet ids
└── mops.toml                 # Motoko dependencies`}
              />
            </section>

            {/* ------------------------------------------------------------ */}
            <section>
              <SectionHeading id="roadmap" icon={Map} title="Roadmap" />
              <div className="grid gap-4 md:grid-cols-2">
                {roadmap.map((r) => {
                  const badge =
                    r.status === 'done'
                      ? { label: 'Complete', cls: 'bg-green-500/10 text-green-600 dark:text-green-400' }
                      : r.status === 'active'
                        ? { label: 'In progress', cls: 'bg-primary/10 text-primary' }
                        : { label: 'Upcoming', cls: 'bg-muted text-muted-foreground' };
                  return (
                    <div key={r.phase} className="rounded-xl border border-border bg-card p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold">{r.phase}</p>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.cls}`}>{badge.label}</span>
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {r.items.map((i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            {r.status === 'done' ? (
                              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                            ) : r.status === 'active' ? (
                              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            ) : (
                              <Circle className="mt-0.5 h-4 w-4 shrink-0" />
                            )}
                            {i}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            <section>
              <SectionHeading id="faq" icon={HelpCircle} title="FAQ & Resources" />
              <div className="space-y-3">
                {faqs.map((f) => (
                  <details key={f.q} className="group rounded-xl border border-border bg-card">
                    <summary className="cursor-pointer list-none px-5 py-4 font-semibold flex items-center justify-between gap-4">
                      {f.q}
                      <span className="text-muted-foreground transition-transform group-open:rotate-90">›</span>
                    </summary>
                    <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'GitHub repository', href: REPO_URL },
                  { label: 'Live platform', href: LIVE_URL },
                  { label: 'Candid interface (mainnet)', href: CANDID_URL },
                  { label: 'Internet Computer developer docs', href: 'https://internetcomputer.org/docs' },
                  { label: 'Motoko language reference', href: 'https://internetcomputer.org/docs/current/motoko/main/motoko' },
                  { label: 'Internet Identity', href: 'https://identity.ic0.app' },
                ].map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 font-semibold hover:bg-muted transition-colors"
                  >
                    {l.label}
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-border bg-primary/5 p-6 text-center">
                <p className="text-lg font-bold">Still have questions?</p>
                <p className="mt-1 text-sm text-muted-foreground">Reach the team through the support center or open an issue on GitHub.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <Link href="/support">
                    <button className="h-10 px-5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow hover:scale-105 transition-all">
                      Support Center
                    </button>
                  </Link>
                  <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
                    <button className="h-10 px-5 rounded-xl border border-border bg-background text-sm font-bold hover:bg-muted transition-all">
                      Open an issue
                    </button>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer - Same as landing page */}
      <footer className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap justify-between lg:justify-start items-start gap-10 lg:gap-20">
              <div className="max-w-md space-y-6">
                <div>
                  <span className="text-3xl sm:text-4xl font-black tracking-tight">
                    <span className="text-primary">Trade</span>
                    <span className="text-foreground dark:text-foreground/80">Chain</span>
                  </span>
                </div>
                <p className="text-base text-muted-foreground font-medium leading-relaxed">
                  Secure commodity trading on the Internet Computer Protocol. Built for the future
                  of decentralized finance and global trade.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => window.open(REPO_URL, '_blank')}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted hover:scale-105 transition-all shadow-sm"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => window.open('https://twitter.com/tradechain', '_blank')}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted hover:scale-105 transition-all shadow-sm"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => window.open('https://linkedin.com/company/tradechain', '_blank')}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted hover:scale-105 transition-all shadow-sm"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-12 sm:gap-16">
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-foreground">Platform</h3>
                  <ul className="space-y-3">
                    <li><Link href="/#features" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">Features</Link></li>
                    <li><Link href="/#about" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">About</Link></li>
                    <li><Link href="/documentation" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">Documentation</Link></li>
                  </ul>
                </div>
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-foreground">Resources</h3>
                  <ul className="space-y-3">
                    <li><Link href="/blog" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">Blog</Link></li>
                    <li><Link href="/support" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">Support</Link></li>
                    <li><Link href="/community" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">Community</Link></li>
                  </ul>
                </div>
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-foreground">Legal</h3>
                  <ul className="space-y-3">
                    <li><Link href="/privacy" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">Terms of Service</Link></li>
                    <li><Link href="/cookies" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">Cookie Policy</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-14 border-t border-border pt-8">
              <p className="text-center text-lg text-muted-foreground font-medium">
                © 2025 <span className="text-primary">Trade</span>
                <span className="text-foreground dark:text-foreground/80">Chain</span>. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
