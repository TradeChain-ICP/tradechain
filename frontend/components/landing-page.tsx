"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowRight, 
  ChevronDown, 
  Menu, 
  X, 
  Shield, 
  Zap, 
  TrendingUp, 
  Globe, 
  Users, 
  Award,
  ChevronRight,
  Play,
  Star,
  BarChart3,
  Lock,
  Wallet,
  ShieldCheck,
  LineChart,
  CheckCircle,
  Quote
} from "lucide-react"

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/20 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="/images/tradechain-logo.png"
                  alt="TradeChain Logo"
                  className="w-10 h-10 rounded-lg transform rotate-12 hover:rotate-0 transition-transform duration-300"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TradeChain
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {['Features', 'Commodities', 'How It Works', 'Testimonials'].map((item) => (
                <Link 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/login">
                <button className="px-6 py-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 font-medium transition-colors duration-200">
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/20">
            <div className="container mx-auto px-4 py-6 space-y-4">
              {['Features', 'Commodities', 'How It Works', 'Testimonials'].map((item) => (
                <Link 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block py-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 font-medium transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-6 py-3 text-slate-600 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-colors duration-200">
                    Sign In
                  </button>
                </Link>
                <Link href="/register" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-12 lg:pt-24 lg:pb-16 min-h-screen flex items-center overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4 animate-bounce-gentle">
                  <Zap className="w-4 h-4 mr-2" />
                  Built on Internet Computer Protocol
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
                  Trade Real-World{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                    Commodities
                  </span>{' '}
                  with Blockchain Security
                </h1>
                
                <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-6 leading-relaxed max-w-xl">
                  Buy and sell precious metals, oil, agricultural products, and timber using ICP tokens. 
                  Experience institutional-grade trading with retail accessibility.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link href="/register">
                    <button className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-base hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center">
                      Start Trading Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </Link>
                  <button className="group px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-base hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 flex items-center justify-center">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative animate-fade-in-right">
                {/* Laptop Mockup Container */}
                <div className="relative z-10 max-w-lg mx-auto">
                  <div className="relative bg-slate-800 rounded-t-xl p-1.5 shadow-2xl">
                    {/* Laptop Screen Bezel */}
                    <div className="bg-black rounded-t-lg p-3">
                      {/* Browser Chrome */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex space-x-1.5">
                          <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                          <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 mx-3">
                          <div className="bg-slate-700 rounded-md px-2 py-0.5 text-xs text-slate-300 text-center">
                            tradechain.icp
                          </div>
                        </div>
                        <div className="w-12"></div>
                      </div>
                      
                      {/* Dashboard Screenshot */}
                      <div className="relative overflow-hidden rounded-md">
                        <img 
                          src="/images/dashboard-hero.png"
                          alt="TradeChain Platform Dashboard"
                          className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    
                    {/* Laptop Base */}
                    <div className="bg-slate-700 h-4 rounded-b-xl relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-0.5 bg-slate-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center animate-float">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-3 -left-3 w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center animate-float animation-delay-2000">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-32 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2" />
                Platform Features
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Everything You Need to Trade{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Smart
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                TradeChain combines the security of blockchain with the intelligence of AI to create the ultimate commodity trading platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group relative p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 dark:border-slate-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commodities Section */}
        <section id="commodities" className="py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 text-sm font-medium mb-6">
                <Globe className="w-4 h-4 mr-2" />
                Global Marketplace
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Diverse Range of{' '}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Commodities
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                From precious metals to agricultural products, explore and trade a wide variety of real-world assets on our secure platform.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {commodityCategories.map((category, index) => (
                <div 
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                      <p className="text-slate-200 text-sm">{category.count} products available</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300 text-sm">Starting from</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{category.startingPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 lg:py-32 bg-slate-900 dark:bg-slate-950 text-white overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-blue-900/30 rounded-full text-blue-400 text-sm font-medium mb-6">
                <CheckCircle className="w-4 h-4 mr-2" />
                Simple Process
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                How{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TradeChain
                </span>{' '}
                Works
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Our platform makes trading commodities simple, secure, and transparent with just three easy steps.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {steps.map((step, index) => (
                <div key={index} className="relative text-center group">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold transform group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 -translate-y-0.5"></div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400 text-sm font-medium mb-6">
                <Users className="w-4 h-4 mr-2" />
                Customer Stories
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                What Our{' '}
                <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Traders
                </span>{' '}
                Say
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Join thousands of satisfied traders who have transformed their investment strategy with TradeChain.
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className="bg-white dark:bg-slate-800 p-8 lg:p-12 rounded-2xl shadow-xl">
                        <Quote className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-6" />
                        <p className="text-xl lg:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8 font-medium">
                          &quot;{testimonial.content}&quot;
                        </p>
                        <div className="flex items-center">
                          <img 
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full mr-4"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{testimonial.name}</h4>
                            <p className="text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTestimonial 
                        ? 'bg-blue-600 w-8' 
                        : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                    }`}
                    onClick={() => setActiveTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/trading-background.jpeg')] opacity-10 bg-cover bg-center"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Ready to Transform Your Trading?
              </h2>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed">
                Join TradeChain today and experience the future of commodity trading with blockchain security and AI intelligence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/register">
                  <button className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center">
                    Start Trading Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center">
                    Sign In
                  </button>
                </Link>
              </div>

              <div className="grid sm:grid-cols-3 gap-8 text-center">
                {ctaStats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
                    <div className="text-blue-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/images/tradechain-logo.png"
                  alt="TradeChain Logo"
                  className="w-10 h-10 rounded-lg"
                />
                <span className="text-2xl font-bold">TradeChain</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                Democratizing commodity trading through blockchain technology and AI intelligence.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons would go here */}
              </div>
            </div>

            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="font-bold text-lg mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link.href} className="text-slate-400 hover:text-white transition-colors duration-200">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 mb-4 md:mb-0">
                © 2025 TradeChain. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Data
const stats = [
  { value: "$2.2T", label: "Market Size" },
  { value: "10K+", label: "Active Traders" },
  { value: "99.9%", label: "Uptime" }
]

const features = [
  {
    title: "Blockchain Security",
    description: "Every transaction is secured by ICP blockchain technology with smart contract automation and immutable records.",
    icon: ShieldCheck,
  },
  {
    title: "AI-Powered Insights",
    description: "Get institutional-grade market intelligence with AI-driven price predictions and trend analysis.",
    icon: LineChart,
  },
  {
    title: "Smart Escrow System",
    description: "Automated escrow protection ensures secure transactions with funds released upon delivery confirmation.",
    icon: Lock,
  },
  {
    title: "Multi-Currency Wallet",
    description: "Trade with ICP tokens or tokenized fiat currencies through our integrated wallet system.",
    icon: Wallet,
  },
  {
    title: "Real-Time Analytics",
    description: "Track market trends, portfolio performance, and trading opportunities with comprehensive dashboards.",
    icon: BarChart3,
  },
  {
    title: "Global Marketplace",
    description: "Connect with verified buyers and sellers worldwide in our diverse, regulated marketplace.",
    icon: Globe,
  },
]

const commodityCategories = [
  {
    name: "Precious Metals",
    count: "150+",
    startingPrice: "1,950 ICP",
    image: "/images/precious-metals.jpeg"
  },
  {
    name: "Oil & Gas",
    count: "80+",
    startingPrice: "75 ICP",
    image: "/images/oil-gas.jpeg"
  },
  {
    name: "Agriculture",
    count: "200+",
    startingPrice: "7.25 ICP",
    image: "/images/agriculture.jpeg"
  },
  {
    name: "Timber",
    count: "120+",
    startingPrice: "350 ICP",
    image: "/images/timber.jpeg"
  }
]

const steps = [
  {
    title: "Create Account & Verify",
    description: "Sign up with Internet Identity and complete our streamlined KYC process in minutes, not days."
  },
  {
    title: "Connect Your Wallet",
    description: "Link your ICP wallet or create a new one with multi-currency support for seamless trading."
  },
  {
    title: "Start Trading Smart",
    description: "Browse AI-recommended commodities, execute secure trades, and track your portfolio performance."
  }
]

const testimonials = [
  {
    name: "Sarah Davids",
    role: "Investment Manager",
    content: "TradeChain revolutionized how I approach commodity investing. The AI insights helped me increase my portfolio returns by 40% in just 6 months.",
    avatar: "/images/sarah-davids.jpeg"
  },
  {
    name: "Marcus Johnson",
    role: "Agricultural Trader",
    content: "As a coffee bean trader, I love the transparency and security. The escrow system gives me confidence in every transaction, and the global reach is incredible.",
    avatar: "/images/marcus-johnson.jpeg"
  },
  {
    name: "Elena Akwasi",
    role: "Precious Metals Investor",
    content: "The platform's user experience is exceptional. I can trade gold and silver with the same ease as buying stocks, but with much better insights and security.",
    avatar: "/images/elena-akwasi.jpeg"
  }
]

const ctaStats = [
  { value: "0%", label: "Platform Fees" },
  { value: "24/7", label: "Support" },
  { value: "5min", label: "Setup Time" }
]

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Features", href: "#features" },
      { label: "Commodities", href: "#commodities" },
      { label: "Pricing", href: "/pricing" },
      { label: "API", href: "/api" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Help Center", href: "/help" },
      { label: "Blog", href: "/blog" },
      { label: "Webinars", href: "/webinars" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" }
    ]
  }
]