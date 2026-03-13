import { createSupabaseServerClient } from "../../lib/supabase/server"
import Link from "next/link"
import DeleteExampleButton from "./DeleteExampleButton"

export const dynamic = "force-dynamic"

export default async function CaptionExamplesPage() {
  const supabase = await createSupabaseServerClient()
  
  const { data: examples } = await supabase
    .from('caption_examples')
    .select('*')
    .order('created_datetime_utc', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-gray-400 hover:text-white">
            ← Back to Dashboard
          </Link>
          <Link 
            href="/caption-examples/create"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            + Create Example
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">Caption Examples</h1>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Image Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Caption</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Explanation</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {examples?.map((example) => (
                <tr key={example.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-gray-400">{example.id}</td>
                  <td className="px-6 py-4 text-sm text-white">{example.image_description}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{example.caption}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{example.explanation}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(example.created_datetime_utc).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <DeleteExampleButton exampleId={example.id} />
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