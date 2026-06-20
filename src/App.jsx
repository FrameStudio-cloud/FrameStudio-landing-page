import { Mail, MessageCircle, Globe, Bot, BarChart3, ArrowRight, Check, Menu, X } from 'lucide-react'
import { useState } from 'react'

const handleEmailClick = () => {
  window.location.href = 'mailto:hello@framestudio.co.ke'
}

const handleWhatsAppClick = () => {
  window.open('https://wa.me/254?text=Hi%20FrameStudio%2C%20I%27m%20interested%20in%20learning%20more%20about%20your%20services.', '_blank')
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="text-xl font-bold text-blue-900 tracking-tight">
              FrameStudio
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm font-medium text-gray-600 hover:text-blue-900 transition-colors">
                Services
              </a>
              <a href="#why-us" className="text-sm font-medium text-gray-600 hover:text-blue-900 transition-colors">
                Why Us
              </a>
              <button onClick={handleEmailClick} className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                Get Started
              </button>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-100 pt-4 flex flex-col gap-3">
              <a href="#services" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600 hover:text-blue-900 transition-colors">
                Services
              </a>
              <a href="#why-us" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600 hover:text-blue-900 transition-colors">
                Why Us
              </a>
              <button onClick={() => { setMenuOpen(false); handleEmailClick() }} className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors w-fit">
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 leading-tight mb-6">
            Digital Tools for Growing Kenyan Businesses
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            FrameStudio builds modern websites, smart WhatsApp bots, and real-time business dashboards
            tailored for small and medium enterprises in Kenya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleEmailClick} className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-base inline-flex items-center justify-center gap-2">
              Start Your Project <ArrowRight size={18} />
            </button>
            <button onClick={handleWhatsAppClick} className="border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-base inline-flex items-center justify-center gap-2">
              <MessageCircle size={18} /> Chat on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-4">What We Build</h2>
          <p className="text-gray-600 text-center max-w-xl mx-auto mb-12 text-lg">
            Every solution is designed for Kenyan businesses — affordable, mobile-friendly, and built to scale.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group border border-gray-200 rounded-xl p-8 hover:border-blue-400 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-5">
                <Globe size={24} className="text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Websites</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2"><Check size={16} className="text-blue-600 mt-0.5 shrink-0" /> E-commerce stores</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-blue-600 mt-0.5 shrink-0" /> Mobile-optimised designs</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-blue-600 mt-0.5 shrink-0" /> SEO & Google-ready</li>
              </ul>
            </div>
            <div className="group border border-gray-200 rounded-xl p-8 hover:border-green-400 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-5">
                <Bot size={24} className="text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bots & Automation</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2"><Check size={16} className="text-green-600 mt-0.5 shrink-0" /> WhatsApp order bots</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-green-600 mt-0.5 shrink-0" /> Automated customer support</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-green-600 mt-0.5 shrink-0" /> Lead generation flows</li>
              </ul>
            </div>
            <div className="group border border-gray-200 rounded-xl p-8 hover:amber-400 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-5">
                <BarChart3 size={24} className="text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dashboards</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2"><Check size={16} className="text-amber-600 mt-0.5 shrink-0" /> Inventory tracking</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-amber-600 mt-0.5 shrink-0" /> Sales analytics</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-amber-600 mt-0.5 shrink-0" /> Real-time reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">Why Kenyan Businesses Choose Us</h2>
              <div className="space-y-5">
                <div className="flex gap-3">
                  <Check size={20} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-gray-900">Affordable</strong>
                    <p className="text-gray-600 text-sm mt-1">Pricing built for SMEs — no enterprise budgets required.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check size={20} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-gray-900">Fast & Reliable</strong>
                    <p className="text-gray-600 text-sm mt-1">Optimised for M-Pesa, slow connections, and local payment methods.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check size={20} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-gray-900">Local Support</strong>
                    <p className="text-gray-600 text-sm mt-1">Our team is based in Nairobi — we understand your market.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check size={20} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-gray-900">Custom Solutions</strong>
                    <p className="text-gray-600 text-sm mt-1">Every project is built from scratch around your specific needs.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 md:p-10 text-white">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">100+</div>
                  <div className="text-blue-200 text-sm">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">500+</div>
                  <div className="text-blue-200 text-sm">Happy Clients</div>
                </div>
                <div className="text-center col-span-2">
                  <div className="text-4xl font-bold mb-1">&lt; 2 Weeks</div>
                  <div className="text-blue-200 text-sm">Average Turnaround</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-blue-900">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto mb-10">
            Let's talk about what FrameStudio can do for you. No pressure, just a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleEmailClick} className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8 py-3.5 rounded-lg transition-colors text-base inline-flex items-center justify-center gap-2">
              <Mail size={18} /> Email Us
            </button>
            <button onClick={handleWhatsAppClick} className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-3.5 rounded-lg transition-colors text-base inline-flex items-center justify-center gap-2">
              <MessageCircle size={18} /> WhatsApp Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">FrameStudio</h4>
              <p className="text-sm leading-relaxed">
                Digital solutions for Kenyan small and medium businesses. We build what your business needs to grow online.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>Websites</li>
                <li>WhatsApp Bots</li>
                <li>Business Dashboards</li>
                <li>Automation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:hello@framestudio.co.ke" className="hover:text-white transition-colors">hello@framestudio.co.ke</a></li>
                <li><a href="mailto:admin@framestudio.co.ke" className="hover:text-white transition-colors">admin@framestudio.co.ke</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Location</h4>
              <p className="text-sm leading-relaxed">
                Nairobi, Kenya<br />
                Available for remote &<br />
                on-site consultations
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 text-sm text-center">
            &copy; {new Date().getFullYear()} FrameStudio. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  )
}

export default App
