"use client"
import { createSupabaseBrowserClient } from "../../lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DeleteProviderButton({ providerId }: { providerId: string }) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const handleDelete = async () => {
    if (!confirm('Delete this provider?')) return
    await supabase.from('llm_providers').delete().eq('id', providerId)
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