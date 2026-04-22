"use client"
import { createSupabaseBrowserClient } from "../../../lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateImagePage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [url, setUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) {
        throw new Error("Not authenticated")
      }

      let imageUrl = url

      // If uploading a file, upload to Cloudflare first
      if (uploadMethod === "file" && file) {
        // Step 1: Get presigned URL
        const presignedResponse = await fetch('https://api.almostcrackd.ai/pipeline/generate-presigned-url', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contentType: file.type
          })
        })

        if (!presignedResponse.ok) {
          throw new Error('Failed to generate presigned URL')
        }

        const { presignedUrl, cdnUrl } = await presignedResponse.json()

        // Step 2: Upload file
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type
          },
          body: file
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        imageUrl = cdnUrl
      }

      // Insert into database
      await supabase.from('images').insert({
        url: imageUrl,
        is_public: isPublic,
        created_by_user_id: session.user.id,
        modified_by_user_id: session.user.id,
        created_datetime_utc: new Date().toISOString(),
        modified_datetime_utc: new Date().toISOString()
      })

      router.push('/images')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/images" className="text-gray-400 hover:text-white mb-6 block">
          ← Back
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Add Image</h1>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8">
          
          {/* Upload Method Toggle */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">Upload Method</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setUploadMethod("url")}
                className={`flex-1 py-2 px-4 rounded-lg transition ${
                  uploadMethod === "url"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                From URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod("file")}
                className={`flex-1 py-2 px-4 rounded-lg transition ${
                  uploadMethod === "file"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                Upload File
              </button>
            </div>
          </div>

          {/* URL Input */}
          {uploadMethod === "url" && (
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Image URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required={uploadMethod === "url"}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
          )}

          {/* File Upload */}
          {uploadMethod === "file" && (
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Choose Image File</label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                required={uploadMethod === "file"}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
              
              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-96 object-contain rounded-lg bg-black border border-white/10"
                  />
                </div>
              )}
            </div>
          )}

          {/* Public Toggle */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-white font-semibold">Make this image public</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Image'}
          </button>
        </form>
      </div>
    </div>
  )
}