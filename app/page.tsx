import { createSupabaseServerClient } from "../lib/supabase/server"
import Link from "next/link"
import StatsCharts from "./components/StatsCharts"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: totalImages } = await supabase
    .from('images')
    .select('*', { count: 'exact', head: true })

  const { count: totalCaptions } = await supabase
    .from('captions')
    .select('*', { count: 'exact', head: true })

  const { count: totalVotes } = await supabase
    .from('caption_votes')
    .select('*', { count: 'exact', head: true })

  // Get vote data
  const { data: voteData } = await supabase
    .from('caption_votes')
    .select('vote_value')

  const upvotes = voteData?.filter(v => v.vote_value === 1).length || 0
  const downvotes = voteData?.filter(v => v.vote_value === -1).length || 0

  // Get recent images
  const { data: recentImages } = await supabase
    .from('images')
    .select('url, created_datetime_utc')
    .order('created_datetime_utc', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-300 text-sm font-semibold">Total Users</p>
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-4xl font-bold text-white">{totalUsers || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-300 text-sm font-semibold">Total Images</p>
              <span className="text-3xl">🖼️</span>
            </div>
            <p className="text-4xl font-bold text-white">{totalImages || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-300 text-sm font-semibold">Total Captions</p>
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-4xl font-bold text-white">{totalCaptions || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-pink-300 text-sm font-semibold">Total Votes</p>
              <span className="text-3xl">⭐</span>
            </div>
            <p className="text-4xl font-bold text-white">{totalVotes || 0}</p>
          </div>
        </div>

        {/* Charts */}
        <StatsCharts upvotes={upvotes} downvotes={downvotes} />

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/users">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-2">Manage Users</h3>
              <p className="text-gray-400">View user profiles</p>
            </div>
          </Link>

          <Link href="/images">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-xl font-bold text-white mb-2">Manage Images</h3>
              <p className="text-gray-400">CRUD operations</p>
            </div>
          </Link>

          <Link href="/captions">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-white mb-2">View Captions</h3>
              <p className="text-gray-400">Browse captions</p>
            </div>
          </Link>
        </div>

        {/* Recent Images */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📸 Recent Images</h3>
          <div className="grid grid-cols-5 gap-4">
            {recentImages?.map((image, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-black border border-white/10">
                <img 
                  src={image.url} 
                  alt="Recent" 
                  className="w-full h-full object-cover hover:scale-110 transition" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}