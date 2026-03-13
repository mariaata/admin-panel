"use client"
import { createSupabaseBrowserClient } from "../../../lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateWhitelistedEmailPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await supabase.from('whitelisted_email_addresses').insert({
      email_address: email,
      created_datetime_utc: new Date().toISOString()
    })

    setLoading(false)
    router.push('/whitelisted-emails')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/whitelisted-emails" className="text-gray-400 hover:text-white mb-6 block">
          ← Back
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Add Whitelisted Email</h1>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@example.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
          >
            {loading ? 'Adding...' : 'Add Email'}
          </button>
        </form>
      </div>
    </div>
  )
}