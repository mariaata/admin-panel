"use client"
import { createSupabaseBrowserClient } from "../../lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DeleteEmailButton({ emailId }: { emailId: string }) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const handleDelete = async () => {
    if (!confirm('Delete this email?')) return
    await supabase.from('whitelisted_email_addresses').delete().eq('id', emailId)
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