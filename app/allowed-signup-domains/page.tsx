import { createSupabaseServerClient } from "../../lib/supabase/server"
import Link from "next/link"
import DeleteDomainButton from "./DeleteDomainButton"

export const dynamic = "force-dynamic"

export default async function AllowedDomainsPage() {
  const supabase = await createSupabaseServerClient()
  
  const { data: domains } = await supabase
    .from('allowed_signup_domains')
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
            href="/allowed-signup-domains/create"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            + Add Domain
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">Allowed Signup Domains</h1>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Domain</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {domains && domains.length > 0 ? (
                domains.map((domain) => (
                  <tr key={domain.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 text-sm text-gray-400">{domain.id}</td>
                    <td className="px-6 py-4 text-sm text-white font-semibold">{domain.domain}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(domain.created_datetime_utc).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <DeleteDomainButton domainId={domain.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    No allowed domains yet. Click "Add Domain" to create one.
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