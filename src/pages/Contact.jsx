import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react'

export default function Contact() {
  const sectionRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current?.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      )
    })
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight text-balance max-w-3xl">
            Let's Build Something Together
          </h1>
          <p className="text-gray-400 text-lg mt-5 max-w-xl leading-relaxed">
            Tell us about your project and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="p-12 rounded-2xl bg-gray-50 border border-gray-200 text-center">
                  <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
                    <Send size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h2>
                  <p className="text-gray-600">We'll get back to you within 24 hours. In the meantime, feel free to WhatsApp us.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Name</label>
                      <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                      <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all" placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Phone (optional)</label>
                    <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all" placeholder="+254 7XX XXX XXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Service Needed</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all">
                      <option value="">Select a service</option>
                      <option value="website">Website</option>
                      <option value="bot">WhatsApp Bot</option>
                      <option value="dashboard">Business Dashboard</option>
                      <option value="automation">Custom Automation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Project Details</label>
                    <textarea rows={5} required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all resize-none" placeholder="Tell us about your project..." />
                  </div>
                  <button type="submit" className="inline-flex items-center gap-2 bg-black text-white font-semibold px-8 py-4 rounded-xl hover:bg-gray-800 transition-all text-base">
                    <Send size={18} />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Info</h3>
                <div className="space-y-5">
                  <a href="mailto:hello@framestudio.co.ke" className="flex items-center gap-4 text-gray-600 hover:text-black transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <Mail size={18} className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-500">hello@framestudio.co.ke</p>
                    </div>
                  </a>
                  <a href="https://wa.me/254793302518" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-600 hover:text-black transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <MessageCircle size={18} className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                      <p className="text-sm text-gray-500">Chat with us directly</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <MapPin size={18} className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-500">Nairobi, Kenya</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Prefer WhatsApp?</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">Most Kenyan businesses hear back fastest on WhatsApp. Tap the button below to start a chat.</p>
                <a href="https://wa.me/254793302518" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-gray-800 transition-all">
                  <MessageCircle size={16} />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
