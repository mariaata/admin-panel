"use client"
import { createSupabaseBrowserClient } from "../../lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteButton({ imageId }: { imageId: string }) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this image?')) return

    setIsDeleting(true)
    await supabase.from('images').delete().eq('id', imageId)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-full px-3 py-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 text-gray-400 hover:text-red-400 text-sm rounded-lg transition"
    >
      🗑️ {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}