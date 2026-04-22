"use client"
import { createSupabaseBrowserClient } from "../../lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteEmailButton({ emailId }: { emailId: number }) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this email?")) {
      return
    }

    setIsDeleting(true)

    try {
      const { error } = await supabase
        .from('whitelisted_emails')
        .delete()
        .eq('id', emailId)

      if (error) throw error

      router.refresh()
    } catch (err: any) {
      console.error("Delete error:", err)
      alert(`Failed to delete email: ${err.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  )
}