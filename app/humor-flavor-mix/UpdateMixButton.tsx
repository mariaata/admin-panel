"use client"
import { createSupabaseBrowserClient } from "../../lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Flavor {
  id: number
  slug: string
  description: string | null
}

export default function UpdateMixButton({ 
  mixId, 
  currentCaptionCount, 
  currentFlavorId,
  flavors 
}: { 
  mixId: string
  currentCaptionCount: number
  currentFlavorId: number
  flavors: Flavor[]
}) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [isEditing, setIsEditing] = useState(false)
  const [captionCount, setCaptionCount] = useState(currentCaptionCount)
  const [flavorId, setFlavorId] = useState(currentFlavorId)

  const handleUpdate = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) {
        throw new Error("Not authenticated")
      }

      await supabase
        .from('humor_flavor_mix')
        .update({ 
          humor_flavor_id: flavorId,
          caption_count: captionCount,
          modified_by_user_id: session.user.id,
          modified_datetime_utc: new Date().toISOString()
        })
        .eq('id', mixId)
      
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update mix')
    }
  }

  if (isEditing) {
    return (
      <div className="flex gap-2 items-center">
        <select
          value={flavorId}
          onChange={(e) => setFlavorId(parseInt(e.target.value))}
          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
        >
          {flavors.map((flavor) => (
            <option key={flavor.id} value={flavor.id}>
              {flavor.slug}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={captionCount}
          onChange={(e) => setCaptionCount(parseInt(e.target.value))}
          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
          min="1"
        />
        <button
          onClick={handleUpdate}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
        >
          Save
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
    >
      Edit
    </button>
  )
}