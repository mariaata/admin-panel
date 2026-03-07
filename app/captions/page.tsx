import { createSupabaseServerClient } from "../../lib/supabase/server"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function CaptionsPage() {
  const supabase = await createSupabaseServerClient()
  
  const { data: captions } = await supabase
    .from('captions')
    .select('*, images(url)')
    .order('created_datetime_utc', { ascending: false })
    .limit(100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-gray-400 hover:text-white">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">Caption Viewer</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {captions?.map((caption) => (
            <div key={caption.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              {caption.images?.url && (
                <div className="aspect-video bg-black">
                  <img 
                    src={caption.images.url} 
                    alt="Caption"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="p-4">
                <p className="text-white mb-3">"{caption.content}"</p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">{caption.vote_count || 0} votes</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(caption.created_datetime_utc).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}