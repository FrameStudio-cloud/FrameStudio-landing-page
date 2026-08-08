import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const client =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
    : null

let cache = null
let inflight = null

function normalize(row) {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    date: row.date,
    tags: Array.isArray(row.tags) ? row.tags : [],
    liveUrl: row.live_url || '',
    coverPalette: row.cover_palette ?? 0,
    screenshots: Array.isArray(row.screenshots) ? row.screenshots : [],
    palette: Array.isArray(row.palette) ? row.palette : [],
    fonts: Array.isArray(row.fonts) ? row.fonts : [],
    stack: Array.isArray(row.stack) ? row.stack : [],
    story: Array.isArray(row.story) ? row.story : [],
  }
}

export async function fetchProjects() {
  if (cache) return cache
  if (inflight) return inflight
  inflight = (async () => {
    try {
      if (client) {
        const { data, error } = await client
          .from('portfolio_projects')
          .select('slug, title, category, excerpt, date, tags, live_url, cover_palette, screenshots, palette, fonts, stack, story, published, site')
          .eq('published', true)
          .in('site', ['framestudio', 'all'])
          .order('sort_order', { ascending: true })
          .order('date', { ascending: false })
        if (!error && data && data.length > 0) {
          cache = data.map(normalize)
          return cache
        }
      }
    } catch {
      // fall through to empty state
    }
    cache = []
    return cache
  })().finally(() => {
    inflight = null
  })
  return inflight
}

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchProjects().then((result) => {
      if (!cancelled) {
        setProjects(result)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { projects, loading }
}

export function categoriesOf(projects) {
  const order = ['Websites', 'Bots', 'Dashboards']
  const set = new Set((projects || []).map((p) => p.category))
  const cats = []
  order.forEach((c) => {
    if (set.has(c)) cats.push(c)
  })
  set.forEach((c) => {
    if (!order.includes(c)) cats.push(c)
  })
  return cats
}