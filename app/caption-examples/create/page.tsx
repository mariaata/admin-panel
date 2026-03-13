"use client"
import { createSupabaseBrowserClient } from "../../../lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateCaptionExamplePage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [imageDescription, setImageDescription] = useState("")
  const [caption, setCaption] = useState("")
  const [explanation, setExplanation] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await supabase.from('caption_examples').insert({
      image_description: imageDescription,
      caption: caption,
      explanation: explanation,
      created_datetime_utc: new Date().toISOString()
    })

    setLoading(false)
    router.push('/caption-examples')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/caption-examples" className="text-gray-400 hover:text-white mb-6 block">
          ← Back
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Create Caption Example</h1>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Image Description</label>
            <textarea
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              required
              rows={3}
              placeholder="Describe the image..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              rows={2}
              placeholder="Enter caption..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Explanation</label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              placeholder="Explain why this is funny..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
          >
            {loading ? 'Creating...' : 'Create Example'}
          </button>
        </form>
      </div>
    </div>
  )
}