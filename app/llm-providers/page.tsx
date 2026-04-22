import { createSupabaseServerClient } from "../../lib/supabase/server"
import Link from "next/link"
import DeleteProviderButton from "./DeleteProviderButton"

export const dynamic = "force-dynamic"

export default async function LLMProvidersPage() {
  const supabase = await createSupabaseServerClient()
  
  const { data: providers } = await supabase
    .from('llm_providers')
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
            href="/llm-providers/create"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            + Add Provider
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">LLM Providers</h1>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">API Endpoint</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {providers && providers.length > 0 ? (
                providers.map((provider) => (
                  <tr key={provider.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 text-sm text-gray-400">{provider.id}</td>
                    <td className="px-6 py-4 text-sm text-white font-semibold">{provider.name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 font-mono text-xs">
                      {provider.api_endpoint || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(provider.created_datetime_utc).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <DeleteProviderButton providerId={provider.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No providers yet. Click "Add Provider" to create one.
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