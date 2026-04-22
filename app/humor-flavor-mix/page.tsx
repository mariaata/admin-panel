import { createSupabaseServerClient } from "../../lib/supabase/server"
import Link from "next/link"
import UpdateMixButton from "./UpdateMixButton"
import CreateMixButton from "./CreateMixButton"

export const dynamic = "force-dynamic"

export default async function HumorFlavorMixPage() {
  const supabase = await createSupabaseServerClient()
  
  const { data: mixes } = await supabase
    .from('humor_flavor_mix')
    .select(`
      *,
      humor_flavors (
        id,
        slug,
        description
      )
    `)
    .order('created_datetime_utc', { ascending: false })

  const { data: allFlavors } = await supabase
    .from('humor_flavors')
    .select('id, slug, description')
    .order('slug', { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-gray-400 hover:text-white">
            ← Back to Dashboard
          </Link>
          <CreateMixButton flavors={allFlavors || []} />
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">Humor Flavor Mix</h1>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Flavor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Caption Count</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {mixes && mixes.length > 0 ? (
                mixes.map((mix) => (
                  <tr key={mix.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 text-sm text-gray-400">{mix.id}</td>
                    <td className="px-6 py-4 text-sm text-white font-semibold">
                      {mix.humor_flavors?.slug || `Flavor ID: ${mix.humor_flavor_id}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{mix.caption_count || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(mix.created_datetime_utc).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <UpdateMixButton 
                        mixId={mix.id} 
                        currentCaptionCount={mix.caption_count || 0}
                        currentFlavorId={mix.humor_flavor_id}
                        flavors={allFlavors || []}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No flavor mixes yet. Click "Add Mix" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}