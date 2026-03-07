import { createSupabaseServerClient } from "../../lib/supabase/server"
import Link from "next/link"
import DeleteButton from "./DeleteButton"

export const dynamic = "force-dynamic"

export default async function ImagesPage() {
  const supabase = await createSupabaseServerClient()
  
  const { data: images } = await supabase
    .from('images')
    .select('*')
    .order('created_datetime_utc', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-gray-400 hover:text-white">
            ← Back to Dashboard
          </Link>
          <Link 
            href="/images/create"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            + Create Image
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">Image Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images?.map((image) => (
            <div key={image.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="aspect-video bg-black">
                <img 
                  src={image.url} 
                  alt="Image"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  image.is_public 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {image.is_public ? 'Public' : 'Private'}
                </span>
                <p className="text-gray-400 text-xs mt-3 mb-4">
                  {new Date(image.created_datetime_utc).toLocaleDateString()}
                </p>
                <DeleteButton imageId={image.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}