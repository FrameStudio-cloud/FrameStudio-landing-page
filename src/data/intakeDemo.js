/**
 * The demo request behind `/start/demo`.
 *
 * Same job as `invoiceDemo.js`: let the page be reviewed — on a phone, with the
 * real components — without creating a row or knowing a token. It says "Demo"
 * on screen so a fixture can never be mistaken for a real client's answers.
 *
 *   /start/demo            → the form, as a client would first get it
 *   /start/demo-answered   → the answered state, including the call agenda
 *
 * The form is deliberately shorter than a starter: this page exists to show the
 * shape of a question, not to be a second copy of `intakeTemplates.js` that
 * drifts from it.
 */

const field = (over) => ({
  type: 'short',
  label: '',
  help: '',
  required: false,
  allowUnknown: true,
  role: null,
  system: null,
  options: [],
  ...over,
})

export const demoForm = {
  version: 1,
  title: 'Tell us what you need built',
  intro:
    'Six minutes here saves a week of phone calls. Where you are not sure, say so — that is a real answer, and it is what the call is for.',
  sections: [
    {
      id: 'you',
      title: 'You',
      intro: '',
      fields: [
        field({ id: 'f-name', label: 'Your name', required: true, allowUnknown: false, system: 'client_name' }),
        field({ id: 'f-email', label: 'Email', allowUnknown: false, system: 'client_email' }),
        field({ id: 'f-business', label: 'What is the business called?', required: true }),
      ],
    },
    {
      id: 'what',
      title: 'What this is',
      intro: '',
      fields: [
        field({
          id: 'f-kind',
          type: 'choice',
          label: 'Which of these is it?',
          required: true,
          options: ['Something new', 'An upgrade to something that already exists', 'Something broken'],
        }),
        field({
          id: 'f-one',
          type: 'long',
          label: 'In one sentence, what should it do?',
          help: 'Who it is for, and the one action you want someone to take.',
          required: true,
          role: 'oneLiner',
        }),
        field({
          id: 'f-device',
          type: 'choice',
          label: 'Phone or laptop first?',
          options: ['Phone', 'Laptop', 'Both, equally'],
        }),
      ],
    },
    {
      id: 'scope',
      title: 'What it has to do',
      intro: '',
      fields: [
        field({
          id: 'f-must',
          type: 'multi',
          label: 'What must work on day one?',
          options: ['Take bookings', 'Show prices', 'Take payments', 'A gallery'],
          role: 'mustHave',
        }),
        field({
          id: 'f-not',
          type: 'long',
          label: 'What should this NOT do?',
          help: 'The most useful question on this form.',
          role: 'notDo',
        }),
        field({
          id: 'f-budget',
          type: 'choice',
          label: 'Roughly what have you set aside?',
          help: 'A band, not a quote.',
          options: ['Under KES 25,000', 'KES 25,000 – 60,000', 'KES 60,000 – 150,000', 'Over KES 150,000'],
        }),
      ],
    },
  ],
}

const base = {
  reference: 'IN-0042',
  title: 'New website',
  form: demoForm,
}

const sentAt = new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString()

export const demoIntakes = {
  demo: {
    ...base,
    id: 'demo',
    token: 'demo',
    status: 'sent',
    client_name: 'Njeri Kamau',
    sent_at: sentAt,
    submitted_at: null,
    answers: {},
  },
  'demo-answered': {
    ...base,
    id: 'demo-answered',
    token: 'demo-answered',
    status: 'submitted',
    client_name: 'Njeri Kamau',
    sent_at: sentAt,
    submitted_at: new Date().toISOString(),
    answers: {
      'f-name': 'Njeri Kamau',
      'f-email': 'njeri@kitchen.test',
      'f-business': "Njeri's Kitchen",
      'f-kind': 'Something new',
      'f-one': 'Take catering bookings online instead of over the phone.',
      'f-device': 'Phone',
      'f-must': ['Take bookings', 'Show prices'],
      'f-not': 'No online payments — we take M-Pesa by hand for now.',
      'f-budget': '__unknown__',
    },
  },
}

export function isDemoToken(token) {
  return typeof token === 'string' && token.startsWith('demo')
}
