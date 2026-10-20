import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Trophy, Medal, Clock, Search, RefreshCw, ArrowLeft, Users, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import { resultAPI } from '../services/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setRefreshing(true);
      const res = await resultAPI.getLeaderboard();
      setLeaderboard(res.data.leaderboard || []);
    } catch (err) {
      console.error('Fetch leaderboard error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filtered = leaderboard.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.studentId.toLowerCase().includes(search.toLowerCase())
  );

  const top3 = leaderboard.slice(0, 3);
  const displayList = showAll ? filtered : filtered.slice(0, 10);

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col text-slate-200">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 text-xs font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>LIVE STANDINGS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              GUSAC JAVA EXAM LEADERBOARD
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Top performers ranked by: 1) Highest score (out of 20), 2) Lowest completion time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchLeaderboard}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              to="/exam"
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exam Portal</span>
            </Link>
          </div>
        </div>

        {/* Podium for Top 3 */}
        {top3.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            {/* Rank 2 - Silver */}
            {top3[1] && (
              <div className="order-2 sm:order-1 bg-[#111827] border border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-lg hover:border-slate-700 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center mb-3">
                  <Medal className="w-6 h-6 text-slate-300" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full mb-1">
                  Rank #2 (Silver)
                </span>
                <h3 className="font-extrabold text-white text-base truncate max-w-[200px]">{top3[1].name}</h3>
                <div className="text-2xl font-black text-indigo-400 mt-1">{top3[1].score} / 20</div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{top3[1].time}</span>
                </div>
              </div>
            )}

            {/* Rank 1 - Champion Gold */}
            {top3[0] && (
              <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-950/40 via-[#111827] to-[#111827] border-2 border-amber-500/70 rounded-2xl p-6 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-xl shadow-amber-950/20 sm:-translate-y-2">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-3 shadow-inner">
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full mb-1 border border-amber-500/40">
                  Rank #1 (Champion)
                </span>
                <h3 className="font-extrabold text-white text-lg truncate max-w-[220px]">{top3[0].name}</h3>
                <div className="text-3xl font-black text-amber-400 mt-1">{top3[0].score} / 20</div>
                <div className="text-xs text-slate-300 mt-1 flex items-center gap-1 font-mono font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{top3[0].time}</span>
                </div>
              </div>
            )}

            {/* Rank 3 - Bronze */}
            {top3[2] && (
              <div className="order-3 bg-[#111827] border border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-lg hover:border-slate-700 transition-colors">
                <div className="w-12 h-12 rounded-full bg-amber-950/50 border-2 border-amber-700 flex items-center justify-center mb-3">
                  <Medal className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600/90 bg-slate-800 px-2 py-0.5 rounded-full mb-1">
                  Rank #3 (Bronze)
                </span>
                <h3 className="font-extrabold text-white text-base truncate max-w-[200px]">{top3[2].name}</h3>
                <div className="text-2xl font-black text-indigo-400 mt-1">{top3[2].score} / 20</div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{top3[2].time}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter, Search, and View All Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111827] text-slate-100 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-slate-400 font-medium">
              Showing {displayList.length} of {leaderboard.length} Candidates
            </span>

            {leaderboard.length > 10 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:text-white transition-colors cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>{showAll ? 'Show Top 10 Only' : 'View All Participants'}</span>
                {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Full Ranking Table */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0c121e] text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800 font-semibold">
                <tr>
                  <th className="px-5 py-3 text-center w-16">Rank</th>
                  <th className="px-5 py-3">Candidate Name</th>
                  <th className="px-5 py-3">Student ID</th>
                  <th className="px-5 py-3 text-right">Score (/20)</th>
                  <th className="px-5 py-3 text-right">Completion Time</th>
                  <th className="px-5 py-3 text-right">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-500">
                      Loading official leaderboard rankings...
                    </td>
                  </tr>
                ) : displayList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-500">
                      No participants found matching "{search}".
                    </td>
                  </tr>
                ) : (
                  displayList.map((entry) => (
                    <tr
                      key={entry.rank}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        entry.rank <= 3 ? 'bg-indigo-950/10' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5 text-center">
                        {entry.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs border border-amber-500/40">
                            1
                          </span>
                        ) : entry.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-700/50 text-slate-300 font-black text-xs border border-slate-500/40">
                            2
                          </span>
                        ) : entry.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-900/40 text-amber-600 font-black text-xs border border-amber-700/40">
                            3
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold">{entry.rank}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {entry.name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                        {entry.studentId}
                      </td>
                      <td className="px-5 py-3.5 text-right font-extrabold text-sm text-indigo-300">
                        {entry.score} <span className="text-slate-500 text-xs font-normal">/ 20</span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-semibold text-emerald-400">
                        {entry.time}
                      </td>
                      <td className="px-5 py-3.5 text-right text-slate-500 text-[11px]">
                        {entry.submittedAt ? new Date(entry.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
