import { useState } from 'react'
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

// Field styling shared by inputs, selects and the textarea.
const fieldClass =
  'w-full px-4 py-3 rounded-xl border border-ink/15 bg-paper text-ink text-sm placeholder:text-ink/35 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-all'

export default function Contact() {
  const [step, setStep] = useState(0)
  const [state, setState] = useState('idle') // idle | sending | success | error

  // Coming from a pricing card: prefill the plan from the URL. Initialised
  // lazily so there is no post-mount setState (and no extra render).
  const [form, setForm] = useState(() => ({
    plan: new URLSearchParams(window.location.search).get('plan') || '',
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  }))

  const progress = (step / (STEPS.length - 1)) * 100

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
    setForm({ plan: '', name: '', email: '', phone: '', service: '', message: '' })
  }

  return (
    <>
      <title>Contact — FrameStudio | Get in Touch</title>
      <meta name="description" content="Get in touch with FrameStudio. Nairobi-based digital agency building websites, WhatsApp bots, and dashboards. Start your project with our guided enquiry wizard." />
      <meta property="og:title" content="Contact — FrameStudio" />
      <meta property="og:image" content="https://www.framestudio.co.ke/og-image.png" />
      <meta name="twitter:image" content="https://www.framestudio.co.ke/og-image.png" />
      <meta property="og:description" content="Guided enquiry wizard — choose your plan, enter your details, and send your message." />
      <meta property="og:url" content="https://www.framestudio.co.ke/contact" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href="https://www.framestudio.co.ke/contact" />

      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_20%_0%,#1a0e0a_0%,#0b0b0b_55%)]" />
        <div className="absolute top-0 right-0 w-[560px] h-[380px] bg-accent/[0.12] rounded-full blur-[140px]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent mb-5 flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            Start a project
          </p>
          <h1 className="font-display text-[2.6rem] md:text-6xl lg:text-[4.2rem] font-semibold text-paper tracking-[-0.03em] leading-[0.98] text-balance max-w-3xl">
            Let's build something <span className="accent-italic text-accent">together</span>
          </h1>
          <p className="text-paper/55 text-lg mt-6 max-w-xl leading-relaxed">
            Choose your plan, fill in your details, and send your enquiry. We'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 lg:gap-16">

            {/* Wizard column */}
            <div className="lg:col-span-3">
              {state === 'success' || state === 'error' ? (
                <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center px-6">
                  <div className="w-full max-w-md p-8 rounded-3xl bg-paper text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                      state === 'success' ? 'bg-accent' : 'bg-red-100'
                    }`}>
                      {state === 'success' ? (
                        <Send size={24} className="text-ink" />
                      ) : (
                        <X size={24} className="text-red-600" />
                      )}
                    </div>
                    <h2 className="font-display text-2xl font-semibold mb-3 text-ink">
                      {state === 'success' ? 'Message sent!' : 'Something went wrong'}
                    </h2>
                    <p className="text-ink-soft mb-7">
                      {state === 'success'
                        ? 'Thanks! Your enquiry has been sent and we’ll get back to you within 24 hours.'
                        : 'Your message couldn’t be sent. Please try again or reach us on WhatsApp.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={restart}
                        className="px-6 py-3 rounded-full bg-ink text-paper font-semibold hover:bg-accent hover:text-ink transition-all"
                      >
                        {state === 'success' ? 'Start again' : 'Try again'}
                      </button>
                      <a
                        href="https://wa.me/254793302518"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-full border border-ink/20 text-ink font-semibold hover:border-ink/50 transition-all"
                      >
                        WhatsApp instead
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}

              {state === 'idle' && (
                <>
                  {/* Progress */}
                  <div className="mb-10">
                    <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] mb-3">
                      {STEPS.map((s, i) => (
                        <span
                          key={s.id}
                          className={`transition-colors ${
                            i < step ? 'text-ink/70' : i === step ? 'text-accent' : 'text-ink/30'
                          }`}
                        >
                          {s.label}
                        </span>
                      ))}
                    </div>
                    <div className="h-1 w-full bg-ink/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      {STEPS.map((_, i) => (
                        <span
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i < step ? 'bg-accent' : i === step ? 'bg-accent/50' : 'bg-ink/15'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="space-y-6">
                    {/* Step 1: Choose Plan */}
                    <div className={step !== 0 ? 'hidden' : ''}>
                      <h2 className="font-display text-xl font-semibold text-ink mb-2">Choose your plan</h2>
                      <p className="text-ink-soft text-sm mb-6">Pick the package that fits your project.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PLAN_OPTIONS.map((p) => {
                          const isSelected = form.plan === p.value
                          return (
                            <button
                              key={p.value}
                              onClick={() => handleInput('plan', p.value)}
                              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                                isSelected
                                  ? 'bg-ink border-ink text-paper'
                                  : 'bg-paper border-ink/15 text-ink hover:border-ink/35'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center text-[10px] ${
                                isSelected ? 'bg-accent text-ink border-accent' : 'bg-transparent text-transparent border-ink/25'
                              }`}>
                                ✓
                              </div>
                              <div>
                                <div className="font-display font-semibold">{p.label}</div>
                                <div className={`font-mono text-[10px] ${isSelected ? 'text-paper/45' : 'text-ink/45'}`}>{p.price}</div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                      {!form.plan && (
                        <p className="mt-4 text-xs text-red-600">Please select a plan to continue.</p>
                      )}
                      <div className="mt-8 flex justify-between">
                        <button
                          onClick={goNext}
                          disabled={!form.plan}
                          className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-all ${
                            form.plan
                              ? 'bg-accent text-ink hover:bg-accent-deep'
                              : 'bg-ink/10 text-ink/35 cursor-not-allowed'
                          }`}
                        >
                          Next <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Step 2: Your Details */}
                    <div className={step !== 1 ? 'hidden' : ''}>
                      <h2 className="font-display text-xl font-semibold text-ink mb-2">Your details</h2>
                      <p className="text-ink-soft text-sm mb-6">So we know who we’re replying to.</p>
                      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                          <label className="block text-sm font-medium text-ink mb-2">Full Name</label>
                          <input
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={(e) => handleInput('name', e.target.value)}
                            placeholder="Your name"
                            className={fieldClass}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-ink mb-2">Email</label>
                          <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => handleInput('email', e.target.value)}
                            placeholder="you@example.com"
                            className={fieldClass}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-ink mb-2">Phone</label>
                          <input
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={(e) => handleInput('phone', e.target.value)}
                            placeholder="+254 7XX XXX XXX"
                            required
                            className={fieldClass}
                          />
                        </div>
                      </form>
                      <div className="mt-8 flex justify-between">
                        <button
                          onClick={goBack}
                          className="px-6 py-3.5 rounded-full border border-ink/15 text-ink/70 font-semibold hover:border-ink/40 hover:text-ink transition-all"
                        >
                          Back
                        </button>
                        <button
                          onClick={goNext}
                          disabled={!form.name || !form.email || !form.phone}
                          className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-all ${
                            form.name && form.email && form.phone
                              ? 'bg-accent text-ink hover:bg-accent-deep'
                              : 'bg-ink/10 text-ink/35 cursor-not-allowed'
                          }`}
                        >
                          Next <ArrowRight size={16} />
                        </button>
                      </div>
                      {!form.name || !form.email || !form.phone ? (
                        <p className="mt-3 text-xs text-red-600">Please fill in your name, email, and phone to continue.</p>
                      ) : null}
                    </div>

                    {/* Step 3: Project Message */}
                    <div className={step !== 2 ? 'hidden' : ''}>
                      <h2 className="font-display text-xl font-semibold text-ink mb-2">Tell us about your project</h2>
                      <p className="text-ink-soft text-sm mb-6">A few details help us give you an accurate reply.</p>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-ink mb-2">Plan Selected</label>
                        <div className="px-4 py-3 rounded-xl border border-ink/10 bg-cream text-sm text-ink">
                          {PLAN_OPTIONS.find((p) => p.value === form.plan)?.label || form.plan}
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <label className="block text-sm font-medium text-ink mb-2">Service Needed</label>
                        <select
                          name="service"
                          value={form.service}
                          onChange={(e) => handleInput('service', e.target.value)}
                          className={fieldClass}
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
                        <label className="block text-sm font-medium text-ink mb-2">Project Details</label>
                        <textarea
                          name="message"
                          rows={5}
                          value={form.message}
                          onChange={(e) => handleInput('message', e.target.value)}
                          placeholder="Tell us about your project, timeline, and any specific requirements..."
                          className={`${fieldClass} resize-none`}
                        />
                      </div>
                      <div className="mt-8 flex justify-between">
                        <button
                          onClick={goBack}
                          className="px-6 py-3.5 rounded-full border border-ink/15 text-ink/70 font-semibold hover:border-ink/40 hover:text-ink transition-all"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={state === 'sending'}
                          className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-all ${
                            state === 'sending' ? 'opacity-60 cursor-not-allowed bg-accent text-ink' : 'bg-accent text-ink hover:bg-accent-deep'
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
                <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40 mb-6">Contact info</h3>
                <div className="space-y-5">
                  <a
                    href="mailto:email.framestudio@gmail.com"
                    className="flex items-center gap-4 text-ink-soft hover:text-ink transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-ink text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-ink transition-colors">
                      <Mail size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">Email</p>
                      <p className="text-sm text-ink-soft break-all">email.framestudio@gmail.com</p>
                    </div>
                  </a>
                  <a
                    href="https://wa.me/254793302518"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-ink-soft hover:text-ink transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-ink text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-ink transition-colors">
                      <MessageCircle size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">WhatsApp</p>
                      <p className="text-sm text-ink-soft">Chat with us directly</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 text-ink-soft">
                    <div className="w-10 h-10 rounded-xl bg-ink text-accent flex items-center justify-center">
                      <MapPin size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">Location</p>
                      <p className="text-sm text-ink-soft">Nairobi, Kenya</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-cream border border-ink/10">
                <h4 className="font-display font-semibold text-ink mb-2">Prefer WhatsApp?</h4>
                <p className="text-sm text-ink-soft leading-relaxed mb-5">Most Kenyan businesses hear back fastest on WhatsApp. Tap the button below to start a chat.</p>
                <a
                  href="https://wa.me/254793302518"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-ink text-paper text-sm font-semibold px-5 py-3 rounded-full hover:bg-accent hover:text-ink transition-all"
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
