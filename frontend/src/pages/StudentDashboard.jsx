import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Award,
  BookmarkCheck,
  Eye,
  Trophy,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { progressAPI, bookmarkAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import HeritageCard from '../components/heritage/HeritageCard';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [progRes, bMarkRes] = await Promise.all([
          progressAPI.getUserProgress(),
          bookmarkAPI.getAll(),
        ]);
        setProgress(progRes.data.data);
        setBookmarks(bMarkRes.data.data);
      } catch (err) {
        toast.error('Failed to load student dashboard records.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 font-serif">Compiling Academic Progress & Certifications...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data for quiz scores
  const quizChartData =
    progress?.quizScores?.map((qs, i) => ({
      name: qs.quizTitle ? qs.quizTitle.substring(0, 15) + '...' : `Quiz ${i + 1}`,
      score: qs.percentage || 0,
    })) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Student Profile Header */}
      <div className="bg-gradient-to-r from-royal-950 via-royal-900 to-royal-800 rounded-3xl p-6 sm:p-8 text-white border border-gold-600/30 shadow-lg flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={user?.profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
          alt={user?.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-gold-amber shadow-md"
        />

        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">{user?.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-saffron-600 text-white uppercase tracking-wider">
              Student Scholar
            </span>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">{user?.profile?.bio}</p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gold-300 pt-2 font-medium">
            <span>🏫 {user?.profile?.institution || 'Indian Heritage Academy'}</span>
            <span>📚 {user?.profile?.grade || 'Grade 10 / Undergraduate'}</span>
            <span>📅 Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* 2. Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-royal-950">{progress?.stats?.totalModulesCompleted || 0}</span>
            <span className="block text-xs font-semibold text-slate-500 uppercase">Completed Modules</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center shrink-0 font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-royal-950">{progress?.stats?.totalQuizzesTaken || 0}</span>
            <span className="block text-xs font-semibold text-slate-500 uppercase">Quizzes Taken</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-royal-950">{progress?.stats?.averageQuizScore || 0}%</span>
            <span className="block text-xs font-semibold text-slate-500 uppercase">Average Score</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-royal-950">{bookmarks.length}</span>
            <span className="block text-xs font-semibold text-slate-500 uppercase">Saved Bookmarks</span>
          </div>
        </div>
      </div>

      {/* 3. Analytics Chart & Badges Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recharts Performance Visualizer */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cream-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-royal-950">Quiz Accuracy Trends</h3>
              <p className="text-xs text-slate-500">Historical performance across completed assessments</p>
            </div>
            <span className="text-xs font-bold text-saffron-600 bg-saffron-50 px-2.5 py-1 rounded-full border border-saffron-200">
              Performance Analytics
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            {quizChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quizChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1ede2" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f2c59',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={val => [`${val}%`, 'Accuracy']}
                  />
                  <Bar dataKey="score" fill="#ea580c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Take your first quiz to see historical visual accuracy trends!
              </div>
            )}
          </div>
        </div>

        {/* Achievement Badges Showcase */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cream-100">
            <h3 className="font-serif text-lg font-bold text-royal-950">Earned Badges</h3>
            <span className="text-xs font-bold text-gold-700 bg-gold-100 px-2.5 py-1 rounded-full">
              {user?.profile?.badges?.length || 0} Badges
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
            {user?.profile?.badges?.map((badge, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-cream-50 border border-cream-200 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gold-amber text-royal-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-xs text-royal-950 truncate">{badge.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Recently Viewed Heritage */}
      {progress?.recentlyViewed && progress.recentlyViewed.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-royal-950">Recently Explored Heritage</h3>
              <p className="text-xs text-slate-500">Pick up where you left off</p>
            </div>
            <Link to="/explore" className="text-xs font-bold text-saffron-600 hover:underline">
              Browse More →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {progress.recentlyViewed.map(item => (
              <Link
                key={item.heritageId}
                to={`/heritage/${item.heritageId}`}
                className="group p-3 rounded-2xl border border-cream-200 hover:border-gold-400 hover:shadow-md transition-all flex items-center gap-3 bg-cream-50/50"
              >
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=200&q=80'}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover group-hover:scale-105 transition-transform shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-xs text-royal-950 group-hover:text-saffron-600 truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{item.state}</p>
                  <span className="text-[9px] font-bold text-saffron-600 uppercase">{item.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 5. Saved Bookmarks Grid */}
      <div id="bookmarks" className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-royal-950">Your Bookmarked Heritage</h3>
            <p className="text-xs text-slate-500">Curated sites and traditions saved for revision</p>
          </div>
          <span className="text-xs font-bold text-royal-950 bg-cream-100 px-3 py-1 rounded-full">
            {bookmarks.length} Saved Items
          </span>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <BookmarkCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>You haven't bookmarked any heritage records yet.</p>
            <Link to="/explore" className="text-saffron-600 font-bold hover:underline mt-1 inline-block">
              Explore Monuments & Traditions →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map(b => (
              b.heritageId && <HeritageCard key={b._id} heritage={b.heritageId} isBookmarked={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
