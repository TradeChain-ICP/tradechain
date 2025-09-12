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
  Search,
  MessageCircle,
  Phone,
  Mail,
  Video,
  Users,
  ChevronDown,
  ExternalLink,
  Clock,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Headphones,
  FileText,
} from 'lucide-react';

export default function SupportPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you within 24 hours.");
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: '',
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'chat':
        alert('Opening live chat...');
        break;
      case 'call':
        window.open('tel:+15551234567');
        break;
      case 'email':
        window.open('mailto:support@tradechain.com');
        break;
      case 'videos':
        alert('Opening video tutorials...');
        break;
    }
  };

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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/#features"
                className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                Features
              </Link>
              <Link
                href="/#about"
                className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                About
              </Link>
              <Link
                href="/support"
                className="text-base font-semibold text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
              >
                Support
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

      {/* Mobile Menu - Same as landing page */}
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
                href="/#features"
                className="py-3 text-base font-semibold text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#about"
                className="py-3 text-base font-semibold text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/support"
                className="py-3 text-base font-semibold text-primary transition-colors border-b border-border/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
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

      <main className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              How can we <span className="text-primary">help</span> you?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Find answers to common questions, browse our guides, or get in touch with our support
              team.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-border rounded-2xl bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <div
              className="cursor-pointer p-6 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition-all hover:scale-105 group"
              onClick={() => handleQuickAction('chat')}
            >
              <div className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2 text-foreground">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-3">Chat with our support team</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Online
                </span>
              </div>
            </div>

            <div
              className="cursor-pointer p-6 bg-card rounded-2xl border-2 border-border hover:border-green-600 hover:shadow-lg transition-all hover:scale-105 group"
              onClick={() => handleQuickAction('call')}
            >
              <div className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-full w-fit group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                  <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold mb-2 text-foreground">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-3">Call us for immediate help</p>
                <span className="text-xs text-muted-foreground">+1 (555) 123-4567</span>
              </div>
            </div>

            <div
              className="cursor-pointer p-6 bg-card rounded-2xl border-2 border-border hover:border-purple-600 hover:shadow-lg transition-all hover:scale-105 group"
              onClick={() => handleQuickAction('email')}
            >
              <div className="text-center">
                <div className="mx-auto mb-4 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-full w-fit group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                  <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold mb-2 text-foreground">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-3">Send us a detailed message</p>
                <span className="text-xs text-muted-foreground">24h response</span>
              </div>
            </div>

            <div
              className="cursor-pointer p-6 bg-card rounded-2xl border-2 border-border hover:border-red-600 hover:shadow-lg transition-all hover:scale-105 group"
              onClick={() => handleQuickAction('videos')}
            >
              <div className="text-center">
                <div className="mx-auto mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-full w-fit group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                  <Video className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-bold mb-2 text-foreground">Video Tutorials</h3>
                <p className="text-sm text-muted-foreground mb-3">Learn with step-by-step guides</p>
                <span className="text-xs text-muted-foreground">Watch Now</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-3xl border-2 border-border p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold mb-4 sm:mb-0 text-foreground">
                    Frequently Asked Questions
                  </h2>
                  <select
                    className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:outline-none"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="account">Account</option>
                    <option value="trading">Trading</option>
                    <option value="payments">Payments</option>
                    <option value="security">Security</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {filteredFAQs.slice(0, 12).map((faq) => (
                    <div key={faq.id} className="border border-border rounded-xl">
                      <button
                        className="flex items-center justify-between w-full p-4 text-left hover:bg-muted transition-colors rounded-xl"
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium uppercase tracking-wide flex-shrink-0 mt-1">
                            {faq.category}
                          </span>
                          <span className="font-semibold text-sm sm:text-base text-foreground">
                            {faq.question}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ml-2 ${
                            expandedFAQ === faq.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="px-4 pb-4">
                          <div className="pt-4 border-t border-border">
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              {faq.answer}
                            </p>
                            {faq.relatedLinks && (
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-foreground">Related:</p>
                                {faq.relatedLinks.map((link, index) => (
                                  <a
                                    key={index}
                                    href="#"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                  >
                                    {link}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">No results found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your search query.</p>
                    <button
                      className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form & Resources */}
            <div className="space-y-8">
              {/* Contact Form */}
              <div className="bg-card rounded-3xl border-2 border-border p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">Contact Support</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <select
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
                      value={contactForm.category}
                      onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      <option value="account">Account Issues</option>
                      <option value="trading">Trading Problems</option>
                      <option value="payments">Payment Issues</option>
                      <option value="technical">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Subject"
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Describe your issue..."
                      rows={4}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* System Status */}
              <div className="bg-card rounded-3xl border-2 border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-xl font-bold text-foreground">All Systems Operational</h3>
                </div>
                <div className="space-y-3">
                  {systemStatus.slice(0, 4).map((system) => (
                    <div key={system.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{system.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Operational</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help Resources */}
              <div className="bg-card rounded-3xl border-2 border-border p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">Quick Resources</h3>
                <div className="space-y-3">
                  {helpGuides.slice(0, 4).map((guide) => (
                    <a
                      key={guide.id}
                      href="#"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <guide.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-1 text-foreground">
                          {guide.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                          <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                          <span className="text-xs text-muted-foreground">{guide.category}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Same as landing page */}
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
                        href="/#features"
                        className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium"
                      >
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/#about"
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

                {/* Resources Column */}
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

// Mock data
const faqData = [
  {
    id: '1',
    category: 'account',
    question: 'How do I verify my account?',
    answer:
      "To verify your account, go to your profile settings and click on 'Verify Account'. You'll need to provide a government-issued ID and proof of address. The verification process typically takes 1-3 business days.",
    relatedLinks: ['Account Verification Guide', 'Accepted Documents List'],
  },
  {
    id: '2',
    category: 'payments',
    question: 'What payment methods are accepted?',
    answer:
      'We accept major credit cards (Visa, MasterCard, American Express), bank transfers, and ICP tokens. All payments are processed securely through our encrypted payment system.',
    relatedLinks: ['Payment Security', 'ICP Token Guide'],
  },
  {
    id: '3',
    category: 'trading',
    question: 'What are the trading fees?',
    answer:
      'Our trading fees are competitive and transparent. We charge a 0.5% fee on each transaction for buyers and 2% for sellers. There are no hidden fees or monthly charges.',
    relatedLinks: ['Fee Structure', 'Pricing Guide'],
  },
  {
    id: '4',
    category: 'security',
    question: 'How secure is my data?',
    answer:
      'We use bank-level encryption and security measures to protect your data. All sensitive information is encrypted both in transit and at rest. We also offer two-factor authentication for additional security.',
    relatedLinks: ['Security Measures', 'Privacy Policy'],
  },
  {
    id: '5',
    category: 'account',
    question: 'How to enable two-factor authentication?',
    answer:
      "Go to Settings > Security and click 'Enable 2FA'. You can use any authenticator app like Google Authenticator or Authy. Scan the QR code and enter the verification code to complete setup.",
    relatedLinks: ['2FA Setup Guide', 'Recommended Authenticator Apps'],
  },
  {
    id: '6',
    category: 'trading',
    question: 'How to track my order?',
    answer:
      "You can track your order by going to your Orders page in the dashboard. Each order has a status indicator and tracking number. You'll also receive email notifications for status updates.",
    relatedLinks: ['Order Status Guide', 'Tracking Information'],
  },
  {
    id: '7',
    category: 'trading',
    question: 'How to start trading commodities?',
    answer:
      'First, complete your account verification. Then deposit funds using your preferred payment method. Browse the marketplace, research products, and start with small investments to learn the platform.',
    relatedLinks: ['Getting Started Guide', 'Trading Tutorial'],
  },
  {
    id: '8',
    category: 'account',
    question: 'What if I forget my password?',
    answer:
      "Click 'Forgot Password' on the login page and enter your email address. We'll send you a secure reset link. For additional security, you may need to verify your identity through 2FA if enabled.",
    relatedLinks: ['Password Reset Guide', 'Account Recovery'],
  },
  {
    id: '9',
    category: 'trading',
    question: 'What is the minimum investment amount?',
    answer:
      'The minimum investment varies by commodity type. For most agricultural products, the minimum is $100, while precious metals start at $500. Energy commodities have a $1,000 minimum. You can view specific minimums on each product listing.',
    relatedLinks: ['Investment Limits Guide', 'Commodity Categories'],
  },
  {
    id: '10',
    category: 'payments',
    question: 'How long do withdrawals take to process?',
    answer:
      'Withdrawal processing times depend on your chosen method. Bank transfers take 2-5 business days, while ICP token withdrawals are processed within 1-2 hours. Credit card refunds can take 3-7 business days depending on your card issuer.',
    relatedLinks: ['Withdrawal Guide', 'Processing Times'],
  },
  {
    id: '11',
    category: 'security',
    question: 'What happens if I suspect unauthorized access to my account?',
    answer:
      'If you suspect unauthorized access, immediately change your password and contact our security team. We recommend enabling 2FA if not already active. Our team will review your account activity and help secure your account within 24 hours.',
    relatedLinks: ['Account Security Checklist', 'Reporting Suspicious Activity'],
  },
  {
    id: '12',
    category: 'account',
    question: 'Can I have multiple accounts?',
    answer:
      'Each person is allowed only one TradeChain account to ensure compliance with KYC regulations and prevent market manipulation. If you need to close your current account and create a new one, please contact our support team for assistance.',
    relatedLinks: ['Account Policy', 'KYC Requirements'],
  },
];

const helpGuides = [
  {
    id: '1',
    title: 'Getting Started with TradeChain',
    description: 'Complete guide to setting up your account and making your first trade',
    category: 'Beginner',
    readTime: '5 min read',
    icon: Users,
  },
  {
    id: '2',
    title: 'Understanding Commodity Markets',
    description: 'Learn the basics of commodity trading and market analysis',
    category: 'Education',
    readTime: '10 min read',
    icon: BookOpen,
  },
  {
    id: '3',
    title: 'Security Best Practices',
    description: 'How to keep your account and investments secure',
    category: 'Security',
    readTime: '7 min read',
    icon: Shield,
  },
  {
    id: '4',
    title: 'Payment Methods Guide',
    description: 'All about payment options and transaction processing',
    category: 'Payments',
    readTime: '4 min read',
    icon: FileText,
  },
  {
    id: '5',
    title: 'Mobile App Tutorial',
    description: 'How to use TradeChain on your mobile device',
    category: 'Mobile',
    readTime: '6 min read',
    icon: Phone,
  },
  {
    id: '6',
    title: 'Advanced Trading Strategies',
    description: 'Professional tips for experienced traders',
    category: 'Advanced',
    readTime: '15 min read',
    icon: Zap,
  },
];

const systemStatus = [
  {
    name: 'Trading Platform',
    description: 'Core trading functionality and order processing',
    status: 'operational',
  },
  {
    name: 'Payment Processing',
    description: 'Credit card and bank transfer processing',
    status: 'operational',
  },
  {
    name: 'User Authentication',
    description: 'Login and account access systems',
    status: 'operational',
  },
  {
    name: 'Market Data',
    description: 'Real-time price feeds and market information',
    status: 'operational',
  },
  {
    name: 'Mobile App',
    description: 'iOS and Android mobile applications',
    status: 'operational',
  },
  {
    name: 'Customer Support',
    description: 'Live chat and support ticket system',
    status: 'operational',
  },
];
