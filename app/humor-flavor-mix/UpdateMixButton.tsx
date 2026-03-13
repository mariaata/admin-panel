"use client"
import { createSupabaseBrowserClient } from "../../lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function UpdateMixButton({ mixId, currentWeight }: { mixId: string, currentWeight: number }) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [isEditing, setIsEditing] = useState(false)
  const [weight, setWeight] = useState(currentWeight)

  const handleUpdate = async () => {
    await supabase
      .from('humor_flavor_mix')
      .update({ 
        weight,
        modified_datetime_utc: new Date().toISOString()
      })
      .eq('id', mixId)
    
    setIsEditing(false)
    router.refresh()
  }

  if (isEditing) {
    return (
      <div className="flex gap-2">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(parseFloat(e.target.value))}
          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
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