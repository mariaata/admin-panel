"use client"
import { createSupabaseBrowserClient } from "../../lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Flavor {
  id: number
  slug: string
  description: string | null
}

export default function CreateMixButton({ flavors }: { flavors: Flavor[] }) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [isOpen, setIsOpen] = useState(false)
  const [flavorId, setFlavorId] = useState("")
  const [captionCount, setCaptionCount] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!flavorId) {
      setError("Please select a flavor")
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) {
        throw new Error("Not authenticated")
      }

      const { error: insertError } = await supabase
        .from('humor_flavor_mix')
        .insert({
          humor_flavor_id: parseInt(flavorId),
          caption_count: captionCount,
          created_by_user_id: session.user.id,
          modified_by_user_id: session.user.id,
          created_datetime_utc: new Date().toISOString(),
          modified_datetime_utc: new Date().toISOString()
        })

      if (insertError) throw insertError

      setIsOpen(false)
      setFlavorId("")
      setCaptionCount(1)
      router.refresh()
    } catch (err: any) {
      console.error("Create error:", err)
      setError(err.message || "Failed to add mix")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
      >
        + Add Mix
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Add Flavor Mix</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Flavor
              </label>
              <select
                value={flavorId}
                onChange={(e) => setFlavorId(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-500"
                disabled={isCreating}
              >
                <option value="">Choose a flavor...</option>
                {flavors.map((flavor) => (
                  <option key={flavor.id} value={flavor.id}>
                    {flavor.slug}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Caption Count
              </label>
              <input
                type="number"
                value={captionCount}
                onChange={(e) => setCaptionCount(parseInt(e.target.value))}
                min="1"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-500"
                disabled={isCreating}
              />
              <p className="text-xs text-gray-500 mt-1">Number of captions to generate for this flavor</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isCreating ? "Adding..." : "Add Mix"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isCreating}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold disabled:opacity-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}