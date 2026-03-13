"use client"
import { createSupabaseBrowserClient } from "../../lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DeleteTermButton({ termId }: { termId: string }) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const handleDelete = async () => {
    if (!confirm('Delete this term?')) return
    await supabase.from('terms').delete().eq('id', termId)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
    >
      Delete
    </button>
  )
}