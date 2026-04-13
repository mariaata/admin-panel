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

  const { data: voteData } = await supabase
    .from('caption_votes')
    .select('vote_value')

  const upvotes = voteData?.filter(v => v.vote_value === 1).length || 0
  const downvotes = voteData?.filter(v => v.vote_value === -1).length || 0

  // ✅ NEW: Get top-rated captions
  const { data: topCaptions } = await supabase
    .from('captions')
    .select(`
      id,
      content,
      caption_votes (vote_value)
    `)
    .limit(100)

  const captionsWithScores = topCaptions?.map(caption => {
    const votes = caption.caption_votes || []
    const score = votes.reduce((sum: number, v: any) => sum + (v.vote_value || 0), 0)
    const totalVotes = votes.length
    return {
      id: caption.id,
      content: caption.content,
      score,
      totalVotes,
      upvotes: votes.filter((v: any) => v.vote_value === 1).length,
      downvotes: votes.filter((v: any) => v.vote_value === -1).length
    }
  }).sort((a, b) => b.score - a.score).slice(0, 10) || []

  // ✅ FIXED: Get most active users
const { data: activeUsersData } = await supabase
.from('caption_votes')
.select('profile_id')

const userVoteCount: Record<string, number> = {}
activeUsersData?.forEach(vote => {
if (vote.profile_id) {
  userVoteCount[vote.profile_id] = (userVoteCount[vote.profile_id] || 0) + 1
}
})

const topUserIds = Object.entries(userVoteCount)
.sort(([, a], [, b]) => b - a)
.slice(0, 5)
.map(([userId, count]) => ({ userId, voteCount: count }))

// Get user emails for display
const { data: topUsersWithEmails } = await supabase
.from('profiles')
.select('id, email')
.in('id', topUserIds.map(u => u.userId))

const topUsers = topUserIds.map(user => {
const profile = topUsersWithEmails?.find(p => p.id === user.userId)
return {
  userId: user.userId,
  email: profile?.email || 'Unknown',
  voteCount: user.voteCount
}
})

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

        <StatsCharts upvotes={upvotes} downvotes={downvotes} />

        {/* ✅ NEW: Top Rated Captions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">🏆 Top Rated Captions</h3>
          <div className="space-y-3">
            {captionsWithScores.map((caption, index) => (
              <div key={caption.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-yellow-400">#{index + 1}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 font-semibold">👍 {caption.upvotes}</span>
                        <span className="text-red-400 font-semibold">👎 {caption.downvotes}</span>
                        <span className="text-blue-400 font-semibold">Score: {caption.score}</span>
                      </div>
                    </div>
                    <p className="text-gray-300">{caption.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ UPDATED: Most Active Voters */}
<div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
  <h3 className="text-2xl font-bold text-white mb-4">🔥 Most Active Voters</h3>
  {topUsers.length > 0 ? (
    <div className="space-y-2">
      {topUsers.map((user, index) => (
        <div key={user.userId} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-yellow-400">#{index + 1}</span>
            <span className="text-gray-300">{user.email}</span>
          </div>
          <span className="text-white font-semibold">{user.voteCount} votes</span>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-400">No votes yet</p>
  )}
</div>

        {/* Main Navigation */}
        <h2 className="text-2xl font-bold text-white mb-4 mt-8">Content Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/users">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-2">Users</h3>
              <p className="text-gray-400 text-sm">View user profiles</p>
            </div>
          </Link>

          <Link href="/images">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-xl font-bold text-white mb-2">Images</h3>
              <p className="text-gray-400 text-sm">CRUD operations</p>
            </div>
          </Link>

          <Link href="/captions">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-white mb-2">Captions</h3>
              <p className="text-gray-400 text-sm">Browse captions</p>
            </div>
          </Link>
        </div>

        {/* Humor System */}
        <h2 className="text-2xl font-bold text-white mb-4 mt-8">Humor System</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/humor-flavors">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-xl font-bold text-white mb-2">Humor Flavors</h3>
              <p className="text-gray-400 text-sm">Read flavors</p>
            </div>
          </Link>

          <Link href="/humor-flavor-steps">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">Flavor Steps</h3>
              <p className="text-gray-400 text-sm">Read steps</p>
            </div>
          </Link>

          <Link href="/humor-flavor-mix">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-white mb-2">Humor Mix</h3>
              <p className="text-gray-400 text-sm">Read/Update mix</p>
            </div>
          </Link>
        </div>

        {/* Caption System */}
        <h2 className="text-2xl font-bold text-white mb-4 mt-8">Caption System</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/caption-requests">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-white mb-2">Caption Requests</h3>
              <p className="text-gray-400 text-sm">Read requests</p>
            </div>
          </Link>

          <Link href="/caption-examples">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-white mb-2">Caption Examples</h3>
              <p className="text-gray-400 text-sm">CRUD examples</p>
            </div>
          </Link>

          <Link href="/terms">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-white mb-2">Terms</h3>
              <p className="text-gray-400 text-sm">CRUD terms</p>
            </div>
          </Link>
        </div>

        {/* LLM System */}
        <h2 className="text-2xl font-bold text-white mb-4 mt-8">LLM System</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link href="/llm-models">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-white mb-2">LLM Models</h3>
              <p className="text-gray-400 text-sm">CRUD models</p>
            </div>
          </Link>

          <Link href="/llm-providers">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-white mb-2">LLM Providers</h3>
              <p className="text-gray-400 text-sm">CRUD providers</p>
            </div>
          </Link>

          <Link href="/llm-prompt-chains">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold text-white mb-2">Prompt Chains</h3>
              <p className="text-gray-400 text-sm">Read chains</p>
            </div>
          </Link>

          <Link href="/llm-model-responses">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-white mb-2">Model Responses</h3>
              <p className="text-gray-400 text-sm">Read responses</p>
            </div>
          </Link>
        </div>

        {/* Access Control */}
        <h2 className="text-2xl font-bold text-white mb-4 mt-8">Access Control</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/allowed-signup-domains">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold text-white mb-2">Allowed Domains</h3>
              <p className="text-gray-400 text-sm">CRUD signup domains</p>
            </div>
          </Link>

          <Link href="/whitelisted-emails">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer hover:scale-105">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="text-xl font-bold text-white mb-2">Whitelisted Emails</h3>
              <p className="text-gray-400 text-sm">CRUD email addresses</p>
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