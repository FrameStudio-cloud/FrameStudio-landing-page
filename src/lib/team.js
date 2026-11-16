import { useEffect, useState } from 'react'

/**
 * Who builds cite-ui.
 *
 * The dashboard owns the real roster. `team_members` is RLS-locked and
 * `get_team_roster()` is revoked from anon on purpose, so this site cannot read
 * names today. This list stands in until the dashboard publishes a safe subset
 * (name, role, links, and a `published` flag on the team row).
 *
 * The shape below is deliberately the shape a public view would return, so the
 * swap is a single query inside `fetchTeam()` — no page edits:
 *
 *   const { data } = await supabase
 *     .from('public_team')
 *     .select('id, name, role, focus, links')
 *     .order('sort_order')
 *   return data ?? FALLBACK
 *
 * Until then, edit this array. Keep it honest: a name here is a claim that the
 * person builds this library.
 */
const FALLBACK_TEAM = [
  {
    id: 'lewis-irungu',
    name: 'Lewis Irungu',
    role: 'Founder · design systems',
    focus: 'Writes the components, ships the docs, answers the issues.',
    initials: 'LI',
    links: [
      { label: 'npm', href: 'https://www.npmjs.com/~lewismugwe' },
      { label: 'GitHub', href: 'https://github.com/FrameStudio-cloud/cite-ui' },
    ],
  },
]

/**
 * Seats that are genuinely open. The page renders these as invitations, not as
 * teammates — nothing here claims a person exists.
 */
export const OPEN_SEATS = [
  {
    id: 'motion',
    title: 'Motion & interaction',
    desc: 'Someone who thinks a drawer should feel like it has weight.',
  },
  {
    id: 'a11y',
    title: 'Accessibility',
    desc: 'Someone who tests with a keyboard first and a screen reader second.',
  },
]

export async function fetchTeam() {
  return FALLBACK_TEAM
}

export function useTeam() {
  const [team, setTeam] = useState(FALLBACK_TEAM)

  useEffect(() => {
    let cancelled = false
    fetchTeam().then((list) => {
      if (!cancelled) setTeam(list)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return team
}
