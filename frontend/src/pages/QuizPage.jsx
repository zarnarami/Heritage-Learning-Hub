import React, { useState, useEffect } from 'react';
import { Award, Clock, HelpCircle, CheckCircle2, SlidersHorizontal, Sparkles } from 'lucide-react';
import { quizAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import QuizCard from '../components/quiz/QuizCard';
import QuizPlayer from '../components/quiz/QuizPlayer';
import toast from 'react-hot-toast';

const QuizPage = () => {
  const { isAuthenticated } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [userScoresMap, setUserScoresMap] = useState({});

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const params = {};
        if (categoryFilter !== 'All') params.category = categoryFilter;
        if (difficultyFilter !== 'All') params.difficulty = difficultyFilter;

        const res = await quizAPI.getAll(params);
        setQuizzes(res.data.data);

        // Fetch user's previous quiz scores if logged in
        if (isAuthenticated) {
          const pRes = await progressAPI.getUserProgress();
          const scores = {};
          if (pRes.data?.data?.quizScores) {
            pRes.data.data.quizScores.forEach(s => {
              // Store highest score per quizId
              if (!scores[s.quizId] || scores[s.quizId].percentage < s.percentage) {
                scores[s.quizId] = s;
              }
            });
          }
          setUserScoresMap(scores);
        }
      } catch (err) {
        toast.error('Failed to load quizzes.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [categoryFilter, difficultyFilter, isAuthenticated, activeQuizId]);

  const categories = ['All', 'UNESCO Heritage Sites', 'Architecture', 'Festivals', 'Traditions'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // If a quiz is active, render QuizPlayer
  if (activeQuizId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <QuizPlayer quizId={activeQuizId} onBackToList={() => setActiveQuizId(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-saffron-600">Knowledge Assessment</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-royal-950">
          Indian Heritage & History Quizzes
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Validate your understanding of temple architecture, UNESCO landmarks, dynasties, and cultural rituals.
          Scores are saved directly to your academic profile.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <SlidersHorizontal className="w-4 h-4 text-saffron-600" />
          <span>Filter Assessments:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 bg-white font-semibold outline-none cursor-pointer"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-semibold">Difficulty:</span>
            <select
              value={difficultyFilter}
              onChange={e => setDifficultyFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 bg-white font-semibold outline-none cursor-pointer"
            >
              {difficulties.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-72 bg-white rounded-2xl animate-pulse border border-cream-200"></div>
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-cream-200">
          <Award className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-royal-950">No Quizzes Found</h3>
          <p className="text-slate-500 text-sm">No quizzes match your selected filter. Please select "All".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              userScore={userScoresMap[quiz._id] || null}
              onStartQuiz={qId => setActiveQuizId(qId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
