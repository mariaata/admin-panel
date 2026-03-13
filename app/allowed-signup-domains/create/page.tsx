"use client"
import { createSupabaseBrowserClient } from "../../../lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateAllowedDomainPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await supabase.from('allowed_signup_domains').insert({
      domain,
      created_datetime_utc: new Date().toISOString()
    })

    setLoading(false)
    router.push('/allowed-signup-domains')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/allowed-signup-domains" className="text-gray-400 hover:text-white mb-6 block">
          ← Back
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Add Allowed Domain</h1>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              placeholder="e.g., barnard.edu"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
          >
            {loading ? 'Adding...' : 'Add Domain'}
          </button>
        </form>
      </div>
    </div>
  )
}