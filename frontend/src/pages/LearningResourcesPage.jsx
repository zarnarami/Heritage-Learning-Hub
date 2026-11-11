import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  Video,
  Download,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Sparkles,
  GraduationCap,
  X,
  Play,
} from 'lucide-react';
import { moduleAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LearningResourcesPage = () => {
  const { isAuthenticated } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  // Active Lesson Reader Modal
  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedLevel !== 'All') params.level = selectedLevel;
        if (search.trim()) params.search = search.trim();

        const res = await moduleAPI.getAll(params);
        setModules(res.data.data);
      } catch (err) {
        toast.error('Failed to load learning resources.');
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, [selectedCategory, selectedLevel, search]);

  const handleOpenModule = mod => {
    setActiveModule(mod);
    setActiveLesson(mod.lessons?.[0] || null);
  };

  const handleCompleteModule = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to record module completion in your academic progress.');
      return;
    }

    setCompleting(true);
    try {
      await progressAPI.completeModule(activeModule._id);
      toast.success(`Module "${activeModule.title}" marked as completed! Check your student dashboard.`);
      setActiveModule(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error recording module completion.');
    } finally {
      setCompleting(false);
    }
  };

  const categories = ['All', 'Architecture', 'Traditions', 'Historical Events', 'Monuments', 'Festivals'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-saffron-600">Curriculum & Pedagogy</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-royal-950">
          Indian Heritage Learning Resources
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Subject-wise modules, topic-wise lessons, authentic NCERT and ASI research papers, and curated documentary archives.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search learning modules & notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-saffron-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
          >
            {levels.map(l => (
              <option key={l} value={l}>
                Level: {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Learning Modules Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-80 bg-white rounded-2xl animate-pulse border border-cream-200"></div>
          ))}
        </div>
      ) : modules.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-cream-200">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-royal-950">No Modules Found</h3>
          <p className="text-slate-500 text-sm">Try choosing another category or clearing your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(mod => (
            <div
              key={mod._id}
              className="bg-white rounded-2xl overflow-hidden border border-cream-200 hover:border-gold-400 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={mod.thumbnail || 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=600&q=80'}
                    alt={mod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-royal-950/80 text-white backdrop-blur-sm">
                      {mod.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-amber text-royal-950">
                      {mod.level}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration: {mod.duration || '45 mins'}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-royal-950 group-hover:text-saffron-600 transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="flex items-center gap-4 pt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-royal-800" />
                      {mod.lessons?.length || 0} Lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-saffron-600" />
                      {mod.pdfResources?.length || 0} PDFs
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-red-600" />
                      {mod.videoResources?.length || 0} Video
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => handleOpenModule(mod)}
                  className="w-full py-2.5 px-4 rounded-xl bg-royal-950 hover:bg-saffron-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Start Module Lessons</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Lesson Reader Modal */}
      {activeModule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-cream-200">
            {/* Modal Header */}
            <div className="p-6 bg-royal-950 text-white flex items-center justify-between border-b border-royal-800">
              <div>
                <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">
                  {activeModule.category} • {activeModule.level}
                </span>
                <h2 className="font-serif text-2xl font-bold truncate max-w-xl">{activeModule.title}</h2>
              </div>
              <button
                onClick={() => setActiveModule(null)}
                className="p-2 rounded-full hover:bg-royal-900 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Lesson Tabs */}
              {activeModule.lessons?.length > 1 && (
                <div className="flex gap-2 border-b border-cream-200 pb-3 overflow-x-auto">
                  {activeModule.lessons.map((les, i) => (
                    <button
                      key={les.id}
                      onClick={() => setActiveLesson(les)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        activeLesson?.id === les.id
                          ? 'bg-saffron-600 text-white shadow-sm'
                          : 'bg-cream-100 text-slate-700 hover:bg-cream-200'
                      }`}
                    >
                      Lesson {i + 1}: {les.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Active Lesson Content */}
              {activeLesson ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-royal-950">{activeLesson.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Estimated Reading Time: {activeLesson.readingTime || '10 mins'}</p>
                  </div>

                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base bg-cream-50/60 p-6 rounded-2xl border border-cream-200">
                    {activeLesson.content}
                  </div>

                  {/* Key Takeaways */}
                  {activeLesson.keyTakeaways && activeLesson.keyTakeaways.length > 0 && (
                    <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-3">
                      <h4 className="font-bold text-sm text-royal-950 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Curriculum Key Takeaways</span>
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                        {activeLesson.keyTakeaways.map((takeaway, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-500">No lessons available for this module.</p>
              )}

              {/* Downloadable PDF Resources */}
              {activeModule.pdfResources && activeModule.pdfResources.length > 0 && (
                <div className="pt-4 border-t border-cream-200 space-y-3">
                  <h4 className="font-serif text-lg font-bold text-royal-950 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-saffron-600" />
                    <span>Downloadable Study Material & NCERT Guides</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeModule.pdfResources.map((pdf, idx) => (
                      <a
                        key={idx}
                        href={pdf.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-saffron-500 hover:bg-cream-50 transition-colors group"
                      >
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-royal-950 group-hover:text-saffron-600 truncate">{pdf.title}</p>
                          <p className="text-[11px] text-slate-500">File Size: {pdf.fileSize} • Official Document</p>
                        </div>
                        <Download className="w-4 h-4 text-slate-400 group-hover:text-saffron-600 shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-cream-50 border-t border-cream-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Logged-in completion records into Student Academic Progress.
              </span>
              <button
                onClick={handleCompleteModule}
                disabled={completing}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{completing ? 'Recording...' : 'Mark Module as Completed'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningResourcesPage;
