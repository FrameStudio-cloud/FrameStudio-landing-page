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
    date: row.date,
    author: row.author,
    excerpt: row.excerpt,
    tags: Array.isArray(row.tags) ? row.tags : [],
    content: Array.isArray(row.content) ? row.content : [],
    coverPalette: row.cover_palette ?? 0,
  }
}

export async function fetchBlogPosts() {
  if (cache) return cache
  if (inflight) return inflight
  inflight = (async () => {
    try {
      if (client) {
        const { data, error } = await client
          .from('blogs')
          .select('slug, title, date, author, excerpt, tags, content, cover_palette, published, site')
          .eq('published', true)
          .in('site', ['framestudio', 'all'])
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

export function useBlogPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchBlogPosts().then((result) => {
      if (!cancelled) {
        setPosts(result)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { posts, loading }
}

export function formatBlogDate(date) {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function readingTime(post) {
  const words = post.content.reduce((acc, b) => acc + (b.text ? b.text.split(/\s+/).length : 0), 0)
  return Math.max(1, Math.round(words / 200))
}

export function kicker(tags) {
  if (!tags || !tags.length) return 'Journal'
  return tags[0]
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
