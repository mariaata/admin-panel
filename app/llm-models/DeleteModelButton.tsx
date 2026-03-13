"use client"
import { createSupabaseBrowserClient } from "../../lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DeleteModelButton({ modelId }: { modelId: string }) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const handleDelete = async () => {
    if (!confirm('Delete this model?')) return
    await supabase.from('llm_models').delete().eq('id', modelId)
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