/**
 * Scope-request rules — a deliberate mirror of
 * `framestudio-dashboard/src/lib/intake.js`.
 *
 * The two repos share no build, so the rules are copied, the same way
 * `lib/invoice.js` mirrors `invoiceDoc.js`. **Change both together.** What is
 * copied here is only what the client's page needs: how a form is normalised,
 * when an answer counts, and which questions came back "not sure yet". The
 * scoring rules live on the dashboard side too, and they agree because the
 * arithmetic is three lines, not because they share a module.
 *
 * The one thing that must never drift: `UNKNOWN`. It is the sentinel written to
 * `answers`, and the database keys `gaps` off the same string.
 */

export const UNKNOWN = "__unknown__";

export const EMPTY_ANSWER = {
  short: "",
  long: "",
  date: "",
  url: "",
};

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeField(raw, si, fi) {
  const field = raw && typeof raw === "object" ? raw : {};
  const type = ["short", "long", "choice", "multi", "date", "url", "links"].includes(field.type)
    ? field.type
    : "short";
  return {
    id: String(field.id || `f-${si}-${fi}`),
    type,
    label: String(field.label || "").trim(),
    help: String(field.help || "").trim(),
    required: Boolean(field.required),
    // Identity fields are never "not sure": a name is a name.
    allowUnknown: field.system ? false : field.allowUnknown !== false,
    system: field.system || null,
    options: type === "choice" || type === "multi" ? asArray(field.options).map(String) : [],
  };
}

/** Anything out of jsonb becomes safe to render. Never throws on the client. */
export function normalizeForm(form) {
  const source = form && typeof form === "object" ? form : {};
  return {
    version: Number(source.version) || 1,
    title: String(source.title || "").trim(),
    intro: String(source.intro || "").trim(),
    sections: asArray(source.sections).map((raw, si) => {
      const section = raw && typeof raw === "object" ? raw : {};
      return {
        id: String(section.id || `s-${si}`),
        title: String(section.title || "").trim(),
        intro: String(section.intro || "").trim(),
        fields: asArray(section.fields).map((field, fi) => normalizeField(field, si, fi)),
      };
    }),
  };
}

/** The value a field starts empty with, which depends on its type. */
export function emptyValue(field) {
  if (field?.type === "multi" || field?.type === "links") return [];
  return EMPTY_ANSWER[field?.type] ?? "";
}

function hasText(value) {
  if (value == null) return false;
  if (Array.isArray(value)) {
    return value.some((entry) => {
      if (entry && typeof entry === "object") return String(entry.url || "").trim().length > 0;
      return String(entry ?? "").trim().length > 0;
    });
  }
  return String(value).trim().length > 0;
}

/** `empty` is the only state that is a gap. `unknown` is an answer. */
export function answerState(value) {
  if (value === UNKNOWN) return "unknown";
  return hasText(value) ? "answered" : "empty";
}

/** Human text for an answer, including the sentinel. */
export function answerText(value) {
  if (value === UNKNOWN) return "Not sure yet";
  if (!hasText(value)) return "";
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (entry && typeof entry === "object") {
          const url = String(entry.url || "").trim();
          const note = String(entry.note || "").trim();
          if (!url) return "";
          return note ? `${url} — ${note}` : url;
        }
        return String(entry ?? "").trim();
      })
      .filter(Boolean)
      .join("; ");
  }
  return String(value).trim();
}

export function formCompleteness(form, answers = {}) {
  let total = 0;
  let answered = 0;
  for (const section of normalizeForm(form).sections) {
    for (const field of section.fields) {
      total += 1;
      const state = answerState(answers[field.id]);
      if (state === "answered" || state === "unknown") answered += 1;
    }
  }
  return { total, answered, score: total ? Math.round((answered / total) * 100) : 0 };
}

/** Every "not sure yet", in form order: what the call will be about. */
export function openQuestions(form, answers = {}) {
  const out = [];
  for (const section of normalizeForm(form).sections) {
    for (const field of section.fields) {
      if (answers[field.id] === UNKNOWN) {
        out.push({ id: field.id, label: field.label, section: section.title });
      }
    }
  }
  return out;
}

/** Required questions in one section that are still blank. */
export function sectionMissing(section, answers = {}) {
  return (section?.fields || []).filter(
    (field) => field.required && answerState(answers[field.id]) === "empty",
  );
}

/** Everything, grouped the way the client answered it. */
export function answerSummary(form, answers = {}) {
  return normalizeForm(form)
    .sections.map((section) => ({
      id: section.id,
      title: section.title,
      items: section.fields
        .map((field) => ({
          id: field.id,
          label: field.label,
          text: answerText(answers[field.id]),
          unknown: answers[field.id] === UNKNOWN,
        }))
        .filter((item) => item.text),
    }))
    .filter((section) => section.items.length > 0);
}
