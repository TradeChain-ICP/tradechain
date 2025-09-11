// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Shield,
  Zap,
  Globe2,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from "next/image";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typeSpeed, setTypeSpeed] = useState(150);

  const words = ['Trade', 'Invest', 'Access', 'Secure'];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Enhanced typewriter effect
  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[currentWordIndex];

      if (isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        setTypeSpeed(50);
      } else {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        setTypeSpeed(150);
      }

      if (!isDeleting && currentText === currentWord) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    };

    const timer = setTimeout(handleTyping, typeSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, typeSpeed, words]);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
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

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight">
                <span className="text-primary">Trade</span>
                <span className="text-foreground dark:text-foreground/80">Chain</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                Features
              </Link>
              <Link
                href="#about"
                className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                About
              </Link>
              <Link
                href="#docs"
                className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                Docs
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() =>
                  window.open('https://github.com/TradeChain-ICP/tradechain', '_blank')
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted hover:scale-105 transition-all shadow-sm"
              >
                <Github className="h-4 w-4" />
              </button>

              <button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted hover:scale-105 transition-all shadow-sm"
              >
                {getThemeIcon()}
              </button>

              <Link href="/connect">
                <button className="group relative overflow-hidden h-10 px-6 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background"
              >
                {getThemeIcon()}
              </button>

              <button
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-out md:hidden">
            <div className="flex h-16 items-center justify-between px-6 border-b border-border">
              <span className="text-lg font-bold">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col p-6 space-y-6">
              <Link
                href="#features"
                className="py-3 text-base font-semibold text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#about"
                className="py-3 text-base font-semibold text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#docs"
                className="py-3 text-base font-semibold text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Docs
              </Link>

              <div className="pt-6 border-t border-border">
                <button
                  onClick={() => {
                    window.open('https://github.com/TradeChain-ICP/tradechain', '_blank');
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center space-x-3 py-3 text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </button>
              </div>

              <Link href="/connect" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full h-12 px-6 bg-primary text-primary-foreground rounded-xl text-base font-bold shadow-lg">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </>
      )}

      <main>
        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl text-center">
              <div className="animate-fade-in-up space-y-8">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight">
                  <span className="text-primary font-black">{currentText}</span>
                  <span className="text-foreground"> commodities</span>
                  <br />
                  <span className="text-foreground/80">on the blockchain</span>
                </h1>

                <p className="mx-auto max-w-3xl text-lg sm:text-xl md:text-2xl leading-relaxed text-muted-foreground font-medium">
                  Secure commodity trading on the Internet Computer Protocol. Built for the future
                  of decentralized finance and global trade.
                </p>

                <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 mt-10">
                  <Link href="/connect">
                    <button className="group relative overflow-hidden rounded-2xl bg-primary px-8 py-4 font-bold text-primary-foreground shadow-2xl transition-all duration-300 hover:shadow-primary/25 hover:scale-105 text-base sm:text-lg">
                      <span className="relative z-10 flex items-center">
                        Start Trading
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary to-primary/80 transition-opacity group-hover:opacity-90" />
                    </button>
                  </Link>

                  <Link href="#about">
                    <button className="rounded-2xl border-2 border-border bg-background px-8 py-4 font-bold text-foreground transition-all duration-300 hover:bg-muted hover:scale-105 shadow-lg text-base sm:text-lg">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Animated background elements */}
          <div className="absolute -top-24 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-0 -z-10 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-gradient-to-bl from-primary/10 to-transparent blur-3xl animate-pulse animation-delay-2000" />
        </section>

        {/* Platform Preview */}
        <section className="relative py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="animate-slide-in-from-bottom relative">
                <div className="overflow-hidden rounded-3xl border-2 border-border bg-gradient-to-br from-muted/50 to-muted/30 p-4 shadow-2xl backdrop-blur-sm">
                  <div className="aspect-video overflow-hidden rounded-2xl bg-background shadow-inner">
                    <Image
                      src="/images/platform-preview.png"
                      alt="TradeChain Platform Preview"
                      width={1200}
                      height={675}
                      className="h-full w-full object-cover rounded-2xl"
                      priority
                    />
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -right-6 -top-6 h-20 w-20 animate-float rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center backdrop-blur-sm">
                  <div className="h-10 w-10 rounded-full bg-primary animate-pulse" />
                </div>
                <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full border-2 border-border bg-muted animate-float animation-delay-2000" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="h-screen flex flex-col justify-center relative py-20 sm:py-24"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center mb-16">
              <div className="animate-fade-in-up">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
                  Built for{' '}
                  <span className="text-gradient bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    modern trading
                  </span>
                </h2>
                <p className="mt-6 text-lg sm:text-xl text-muted-foreground font-semibold leading-relaxed">
                  Everything you need to trade commodities securely and efficiently with
                  cutting-edge technology.
                </p>
              </div>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative animate-slide-in-from-bottom rounded-3xl border-2 border-border bg-card p-8 shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-3 hover:border-primary/30"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    {feature.description}
                  </p>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="relative py-20 sm:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="animate-fade-in-up">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
                  The future of{' '}
                  <span className="text-gradient bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    commodity trading
                  </span>
                </h2>
                <p className="mt-8 text-lg sm:text-xl leading-relaxed text-muted-foreground font-semibold max-w-3xl mx-auto">
                  TradeChain leverages cutting-edge blockchain technology to create a transparent,
                  secure, and ultra-efficient marketplace for commodity trading. Connect with
                  verified buyers and sellers worldwide in our revolutionary trading ecosystem.
                </p>
                <div className="mt-10">
                  <Link href="/connect">
                    <button className="group relative overflow-hidden rounded-2xl bg-primary px-10 py-5 font-bold text-primary-foreground shadow-2xl transition-all duration-300 hover:shadow-primary/25 hover:scale-105 text-lg">
                      <span className="relative z-10">Get Started Today</span>
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary to-primary/80 transition-opacity group-hover:opacity-90" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Advanced Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap justify-between lg:justify-start items-start gap-10 lg:gap-20">
              {/* Brand Section */}
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
                    onClick={() =>
                      window.open('https://github.com/TradeChain-ICP/tradechain', '_blank')
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted hover:scale-105 transition-all shadow-sm"
                  >
                    <Github className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => window.open('https://twitter.com/tradechain', '_blank')}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted hover:scale-105 transition-all shadow-sm"
                  >
                    <Twitter className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => window.open('https://linkedin.com/company/tradechain', '_blank')}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted hover:scale-105 transition-all shadow-sm"
                  >
                    <Linkedin className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Columns */}
              <div className="flex flex-wrap gap-12 sm:gap-16">
                {/* Platform Column */}
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-foreground">Platform</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="#features"
                        className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium"
                      >
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#about"
                        className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#docs"
                        className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium"
                      >
                        Documentation
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Resources Column (New) */}
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-foreground">Resources</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="/blog"
                        className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium"
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/support"
                        className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium"
                      >
                        Support
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/community"
                        className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium"
                      >
                        Community
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Legal Column */}
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-foreground">Legal</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="/privacy"
                        className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/terms"
                        className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium"
                      >
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/cookies"
                        className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium"
                      >
                        Cookie Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
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

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-from-bottom {
          from {
            opacity: 0;
            transform: translateY(48px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-slide-in-from-bottom {
          animation: slide-in-from-bottom 1s ease-out;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

// Enhanced feature data
const features = [
  {
    title: 'Blockchain Security',
    description:
      'All transactions are secured by Internet Computer Protocol with advanced smart contract automation and immutable record-keeping for complete transparency.',
    icon: Shield,
  },
  {
    title: 'Lightning Fast',
    description:
      'Execute trades in seconds with minimal fees using cutting-edge ICP blockchain technology and highly optimized smart contracts for maximum efficiency.',
    icon: Zap,
  },
  {
    title: 'Global Access',
    description:
      'Connect with verified buyers and sellers worldwide in our secure, regulated marketplace ecosystem with 24/7 availability and multi-language support.',
    icon: Globe2,
  },
];
