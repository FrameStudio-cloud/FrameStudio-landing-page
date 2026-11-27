/**
 * The only script left in the site chat.
 *
 * The four-step questionnaire that used to live here has moved to the agent's
 * knowledge (`agent_knowledge` in the dashboard), where the owner can edit it
 * without a deploy. What remains is the opening line and four suggestions: a
 * visitor with no idea what to type should not be faced with an empty box.
 */
export const WHATSAPP_NUMBER = '254793302518';

export const OPENING =
  "Hi — I'm the FrameStudio assistant. What are you after?";

export const SUGGESTIONS = [
  'Website',
  'WhatsApp bot',
  'How much does it cost?',
  'Something else',
];

export function whatsappHref(text) {
  const seed = String(text || '').trim().slice(0, 300);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi FrameStudio — ${seed}`
  )}`;
}
