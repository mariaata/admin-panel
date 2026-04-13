import { createSupabaseServerClient } from "../../lib/supabase/server"
import Link from "next/link"
import DuplicateFlavorButton from "./DuplicateFlavorButton"

export const dynamic = "force-dynamic"

export default async function HumorFlavorsPage() {
  const supabase = await createSupabaseServerClient()
  
  const { data: flavors } = await supabase
    .from('humor_flavors')
    .select('*')
    .order('created_datetime_utc', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-gray-400 hover:text-white">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">Humor Flavors</h1>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {flavors?.map((flavor) => (
                <tr key={flavor.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-gray-400">{flavor.id}</td>
                  <td className="px-6 py-4 text-sm text-white font-semibold">{flavor.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{flavor.description || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(flavor.created_datetime_utc).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <DuplicateFlavorButton 
                      flavorId={flavor.id} 
                      flavorName={flavor.name}
                      flavorDescription={flavor.description}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}