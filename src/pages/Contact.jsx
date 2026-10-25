import { useEffect, useRef, useState } from 'react'
import { Mail, MessageCircle, MapPin, Send, ArrowRight, X } from 'lucide-react'

const STEPS = [
  { id: 'plan', label: 'Choose Plan' },
  { id: 'details', label: 'Your Details' },
  { id: 'message', label: 'Project Message' },
]

const PLAN_OPTIONS = [
  { value: 'mini-catalogue', label: 'Mini Catalogue', price: 'KSh 7,000' },
  { value: 'starter', label: 'Starter', price: 'KSh 15,000' },
  { value: 'business', label: 'Business', price: 'KSh 35,000' },
  { value: 'custom', label: 'Custom', price: "Let's Talk" },
]

export default function Contact() {
  const sectionRef = useRef(null)
  const [step, setStep] = useState(0)
  const [state, setState] = useState('idle') // idle | sending | success | error
  const [error, setError] = useState(null)

  // Form data across steps
  const [form, setForm] = useState({
    plan: '',
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })

  // Prefill plan from URL query param when coming from pricing cards
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const plan = params.get('plan')
    if (plan && !form.plan) {
      setForm((prev) => ({ ...prev, plan }))
    }
  }, [])

  const currentStep = STEPS[step]
  const isLastStep = step === STEPS.length - 1
  const progress = ((step) / (STEPS.length - 1)) * 100

  const goNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1)
  }

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const handleInput = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setState('sending')
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service || form.plan,
          message: form.message || `Interested in the ${form.plan} plan.`,
        }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setState('success')
    } catch {
      setState('error')
    }
  }

  const restart = () => {
    setStep(0)
    setState('idle')
    setError(null)
    setForm({ plan: '', name: '', email: '', phone: '', service: '', message: '' })
  }

  return (
    <>
      <title>Contact — FrameStudio | Get in Touch</title>
      <meta name="description" content="Get in touch with FrameStudio. Nairobi-based digital agency building websites, WhatsApp bots, and dashboards. Start your project with our guided enquiry wizard." />
      <meta property="og:title" content="Contact — FrameStudio" />
      <meta property="og:description" content="Guided enquiry wizard — choose your plan, enter your details, and send your message." />
      <meta property="og:url" content="https://www.framestudio.co.ke/contact" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href="https://www.framestudio.co.ke/contact" />

      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight text-balance max-w-3xl">
            Let's Build Something Together
          </h1>
          <p className="text-gray-400 text-lg mt-5 max-w-xl leading-relaxed">
            Choose your plan, fill in your details, and send your enquiry. We'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Wizard column */}
            <div className="lg:col-span-3">
              {/* Completion modal overlay */}
              {state === 'success' || state === 'error' ? (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-full max-w-md p-6 rounded-2xl bg-white text-center shadow-2xl">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                      state === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {state === 'success' ? (
                        <Send size={24} className="text-green-600" />
                      ) : (
                        <X size={24} className="text-red-600" />
                      )}
                    </div>
                    <h2 className={`text-2xl font-bold mb-3 ${state === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                      {state === 'success' ? 'Message Sent!' : 'Something Went Wrong'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {state === 'success'
                        ? 'Thanks! Your enquiry has been sent and we’ll get back to you within 24 hours.'
                        : 'Your message couldn’t be sent. Please try again or reach us on WhatsApp.'}
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={restart}
                        className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition-all"
                      >
                        {state === 'success' ? 'Start Again' : 'Try Again'}
                      </button>
                      <a
                        href="https://wa.me/254793302518"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                      >
                        WhatsApp Instead
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}

              {state === 'idle' && (
                <>
                  {/* Progress bar */}
                  <div className="mb-10">
                    <div className="flex justify-between text-xs uppercase tracking-wider font-semibold text-gray-400 mb-3">
                      {STEPS.map((s, i) => (
                        <span
                          key={s.id}
                          className={`transition-colors ${
                            i < step ? 'text-gray-900' : i === step ? 'text-black' : 'text-gray-400'
                          }`}
                        >
                          {s.label}
                        </span>
                      ))}
                    </div>
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-medium">
                      {STEPS.map((_, i) => (
                        <span
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i < step ? 'bg-black' : i === step ? 'bg-black/40' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="space-y-6">
                    {/* Step 1: Choose Plan */}
                    <div
                      className={`opacity-100 transition-opacity duration-300 ${
                        step !== 0 ? 'hidden' : ''
                      }`}
                    >
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
                      <p className="text-gray-600 text-sm mb-6">Pick the package that fits your project.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PLAN_OPTIONS.map((p) => {
                          const isSelected = form.plan === p.value
                          return (
                            <button
                              key={p.value}
                              onClick={() => handleInput('plan', p.value)}
                              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                                isSelected
                                  ? 'bg-black border-black text-white'
                                  : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                isSelected ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-300'
                              }`}>
                                {isSelected ? '✓' : ''}
                              </div>
                              <div>
                                <div className="font-semibold">{p.label}</div>
                                <div className="text-xs text-gray-500">{p.price}</div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                      {!form.plan && (
                        <p className="mt-4 text-xs text-red-500">Please select a plan to continue.</p>
                      )}
                      <div className="mt-8 flex justify-between">
                        <button
                          onClick={goNext}
                          disabled={!form.plan}
                          className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                            form.plan
                              ? 'bg-black text-white hover:bg-gray-800'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Next <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Step 2: Your Details */}
                    <div
                      className={`opacity-100 transition-opacity duration-300 ${
                        step !== 1 ? 'hidden' : ''
                      }`}
                    >
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Your Details</h2>
                      <p className="text-gray-600 text-sm mb-6">So we know who we’re replying to.</p>
                      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                          <input
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={(e) => handleInput('name', e.target.value)}
                            placeholder="Your name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                          <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => handleInput('email', e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Phone</label>
                          <input
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={(e) => handleInput('phone', e.target.value)}
                            placeholder="+254 7XX XXX XXX"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                          />
                        </div>
                      </form>
                      <div className="mt-8 flex justify-between">
                        <button
                          onClick={goBack}
                          className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                        >
                          Back
                        </button>
                        <button
                          onClick={goNext}
                          disabled={!form.name || !form.email || !form.phone}
                          className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                            form.name && form.email && form.phone
                              ? 'bg-black text-white hover:bg-gray-800'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Next <ArrowRight size={16} />
                        </button>
                      </div>
                      {!form.name || !form.email || !form.phone ? (
                        <p className="mt-3 text-xs text-red-500">Please fill in your name, email, and phone to continue.</p>
                      ) : null}
                    </div>

                    {/* Step 3: Project Message */}
                    <div
                      className={`opacity-100 transition-opacity duration-300 ${
                        step !== 2 ? 'hidden' : ''
                      }`}
                    >
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Tell Us About Your Project</h2>
                      <p className="text-gray-600 text-sm mb-6">A few details help us give you an accurate reply.</p>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-900 mb-2">Plan Selected</label>
                        <div className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900">
                          {PLAN_OPTIONS.find((p) => p.value === form.plan)?.label || form.plan}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900 mb-2">Service Needed</label>
                        <select
                          name="service"
                          value={form.service}
                          onChange={(e) => handleInput('service', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                        >
                          <option value="">Select a service</option>
                          <option value="Website">Website</option>
                          <option value="Telegram Bot">Telegram Bot</option>
                          <option value="Business Dashboard">Business Dashboard</option>
                          <option value="Custom Automation">Custom Automation</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Project Details</label>
                        <textarea
                          name="message"
                          rows={5}
                          value={form.message}
                          onChange={(e) => handleInput('message', e.target.value)}
                          placeholder="Tell us about your project, timeline, and any specific requirements..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all resize-none"
                        />
                      </div>
                      <div className="mt-8 flex justify-between">
                        <button
                          onClick={goBack}
                          className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={state === 'sending'}
                          className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                            state === 'sending' ? 'opacity-60 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
                          }`}
                        >
                          <Send size={16} />
                          {state === 'sending' ? 'Sending...' : 'Send Message'}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Info column */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Info</h3>
                <div className="space-y-5">
                  <a
                    href="mailto:email.framestudio@gmail.com"
                    className="flex items-center gap-4 text-gray-600 hover:text-black transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <Mail size={18} className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-500">email.framestudio@gmail.com</p>
                    </div>
                  </a>
                  <a
                    href="https://wa.me/254793302518"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-gray-600 hover:text-black transition-colors group"
                  >
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
                <a
                  href="https://wa.me/254793302518"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-gray-800 transition-all"
                >
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
