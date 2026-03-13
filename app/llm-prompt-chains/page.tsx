import { createSupabaseServerClient } from "../../lib/supabase/server"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function LLMPromptChainsPage() {
  const supabase = await createSupabaseServerClient()
  
  const { data: chains } = await supabase
    .from('llm_prompt_chains')
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

        <h1 className="text-4xl font-bold text-white mb-8">LLM Prompt Chains</h1>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Caption Request ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {chains?.map((chain) => (
                <tr key={chain.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-gray-400">{chain.id}</td>
                  <td className="px-6 py-4 text-sm text-white font-semibold">{chain.caption_request_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(chain.created_datetime_utc).toLocaleDateString()}
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