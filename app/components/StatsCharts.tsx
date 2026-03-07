"use client"

interface StatsChartsProps {
  upvotes: number
  downvotes: number
}

export default function StatsCharts({ upvotes, downvotes }: StatsChartsProps) {
  const totalVotes = upvotes + downvotes
  const upvotePercent = totalVotes > 0 ? (upvotes / totalVotes) * 100 : 50

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Vote Distribution */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📊</span> Vote Distribution
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-green-400 font-semibold">👍 Upvotes</span>
              <span className="text-white font-bold">{upvotes} ({upvotePercent.toFixed(1)}%)</span>
            </div>
            <div className="h-8 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                style={{ width: `${upvotePercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-red-400 font-semibold">👎 Downvotes</span>
              <span className="text-white font-bold">{downvotes} ({(100 - upvotePercent).toFixed(1)}%)</span>
            </div>
            <div className="h-8 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-400"
                style={{ width: `${100 - upvotePercent}%` }}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Overall Sentiment</p>
              <p className={`text-3xl font-bold ${upvotePercent > 50 ? 'text-green-400' : 'text-red-400'}`}>
                {upvotePercent > 50 ? '😊 Positive' : upvotePercent < 50 ? '😞 Negative' : '😐 Neutral'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📈</span> Vote Activity
        </h3>
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Total Votes</p>
            <p className="text-3xl font-bold text-white">{totalVotes}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Engagement Rate</p>
            <p className="text-3xl font-bold text-yellow-400">
              {totalVotes > 0 ? '100%' : '0%'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}