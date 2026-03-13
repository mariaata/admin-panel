import { createSupabaseServerClient } from "../../lib/supabase/server"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function CaptionRequestsPage() {
  const supabase = await createSupabaseServerClient()
  
  const { data: requests } = await supabase
    .from('caption_requests')
    .select('*')
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

        <h1 className="text-4xl font-bold text-white mb-8">Caption Requests</h1>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Image ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {requests?.map((request) => (
                <tr key={request.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-gray-400">{request.id}</td>
                  <td className="px-6 py-4 text-sm text-white">{request.image_id}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                      {request.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(request.created_datetime_utc).toLocaleDateString()}
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