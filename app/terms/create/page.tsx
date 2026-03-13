"use client"
import { createSupabaseBrowserClient } from "../../../lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateTermPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [term, setTerm] = useState("")
  const [definition, setDefinition] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await supabase.from('terms').insert({
      term,
      definition,
      created_datetime_utc: new Date().toISOString()
    })

    setLoading(false)
    router.push('/terms')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/terms" className="text-gray-400 hover:text-white mb-6 block">
          ← Back
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Create Term</h1>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Term</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
              placeholder="Enter term..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Definition</label>
            <textarea
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              rows={4}
              placeholder="Enter definition..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
          >
            {loading ? 'Creating...' : 'Create Term'}
          </button>
        </form>
      </div>
    </div>
  )
}