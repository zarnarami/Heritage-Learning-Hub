import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Award,
  FileText,
  Download,
  PlusCircle,
  CheckCircle2,
  Calendar,
  Users,
  Compass,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { moduleAPI, quizAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lesson Plan Creator Modal
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planTitle, setPlanTitle] = useState('');
  const [planCategory, setPlanCategory] = useState('Architecture');
  const [planDuration, setPlanDuration] = useState('2 Weeks');
  const [planObjectives, setPlanObjectives] = useState('');
  const [learningPlans, setLearningPlans] = useState([
    {
      id: 'lp-1',
      title: 'Dravidian vs Nagara Architectural Styles',
      category: 'Architecture',
      duration: '2 Weeks',
      grade: 'Grade 10-12',
      objectives: 'Understand structural distinctions of Vimanas, Gopurams, Amalakas, and Kalashas with NCERT Class XI Fine Arts alignment.',
      status: 'Active Teaching Plan',
    },
    {
      id: 'lp-2',
      title: 'UNESCO Intangible Living Traditions of India',
      category: 'Traditions',
      duration: '1 Week',
      grade: 'Undergraduate',
      objectives: 'Examine 2003 UNESCO ICH Convention, exploring Garba of Gujarat (2023) and Durga Puja of Kolkata (2021).',
      status: 'Published for Class',
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modRes, quizRes] = await Promise.all([
          moduleAPI.getAll(),
          quizAPI.getAll(),
        ]);
        setModules(modRes.data.data);
        setQuizzes(quizRes.data.data);
      } catch (err) {
        toast.error('Failed to load teaching dashboard records.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreatePlan = e => {
    e.preventDefault();
    if (!planTitle.trim()) {
      toast.error('Please enter a learning plan title.');
      return;
    }

    const newPlan = {
      id: `lp-${Date.now()}`,
      title: planTitle,
      category: planCategory,
      duration: planDuration,
      grade: 'Humanities & Cultural Studies',
      objectives: planObjectives || 'Curriculum aligned heritage module for interactive academic sessions.',
      status: 'Custom Teacher Plan',
    };

    setLearningPlans(prev => [newPlan, ...prev]);
    setIsPlanModalOpen(false);
    setPlanTitle('');
    setPlanObjectives('');
    toast.success('Educational learning plan created and saved!');
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 font-serif">Loading Teacher Pedagogical Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-royal-950 via-royal-900 to-royal-800 rounded-3xl p-6 sm:p-8 text-white border border-gold-600/30 shadow-lg flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={user?.profile?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
          alt={user?.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-gold-amber shadow-md"
        />

        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">{user?.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold-amber text-royal-950 uppercase tracking-wider">
              Faculty / Educator
            </span>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">{user?.profile?.bio}</p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gold-300 pt-2 font-medium">
            <span>🏛️ Faculty Department: {user?.profile?.institution || 'Indian Cultural Studies & History'}</span>
            <span>🎓 Academic Grade: {user?.profile?.grade || 'Senior Faculty Advisor'}</span>
            <span>Verified ASI Pedagogical Partner</span>
          </div>
        </div>

        <button
          onClick={() => setIsPlanModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow flex items-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Learning Plan</span>
        </button>
      </div>

      {/* 2. Educator Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-royal-950">{modules.length}</span>
            <span className="block text-xs font-semibold text-slate-500 uppercase">Available Modules</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-royal-950">{quizzes.length}</span>
            <span className="block text-xs font-semibold text-slate-500 uppercase">Quiz Question Banks</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-royal-950">{learningPlans.length}</span>
            <span className="block text-xs font-semibold text-slate-500 uppercase">Active Curriculums</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-royal-950">100%</span>
            <span className="block text-xs font-semibold text-slate-500 uppercase">Govt Verified Data</span>
          </div>
        </div>
      </div>

      {/* 3. Educational Learning Plans */}
      <div id="planner" className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-royal-950">Educational Learning Plans</h3>
            <p className="text-xs text-slate-500">Structured academic guides designed for school and university classrooms</p>
          </div>
          <button
            onClick={() => setIsPlanModalOpen(true)}
            className="text-xs font-bold text-saffron-600 hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Plan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learningPlans.map(plan => (
            <div
              key={plan.id}
              className="p-6 rounded-2xl border border-cream-200 bg-cream-50/50 hover:border-gold-400 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-royal-100 text-royal-900 px-2.5 py-1 rounded-full border border-royal-200">
                  {plan.category}
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {plan.status}
                </span>
              </div>

              <h4 className="font-serif text-lg font-bold text-royal-950">{plan.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{plan.objectives}</p>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-cream-200">
                <span>⏱️ Duration: {plan.duration}</span>
                <span>🎓 Target: {plan.grade}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Downloadable Teaching Materials */}
      <div id="curriculum" className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-royal-950">Teaching Guides & NCERT Documents</h3>
            <p className="text-xs text-slate-500">Official syllabi, architectural blueprints, and classroom handouts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'NCERT Class XI: Introduction to Indian Art Chapter 6',
              type: 'Pedagogical Guide',
              size: '3.8 MB',
              url: 'https://ncert.nic.in/textbook/pdf/kefa106.pdf',
            },
            {
              title: 'ASI Teachers Handbook: Field Trip to Konark & Puri',
              type: 'Field Study Guide',
              size: '2.1 MB',
              url: 'https://asi.nic.in',
            },
            {
              title: 'UNESCO Living Traditions of India Teacher Toolkit',
              type: 'Classroom Dossier',
              size: '4.5 MB',
              url: 'https://ich.unesco.org',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-cream-200 bg-white hover:border-saffron-500 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded">
                  {item.type}
                </span>
                <h4 className="font-bold text-xs text-royal-950 mt-2">{item.title}</h4>
                <p className="text-[11px] text-slate-500">File Size: {item.size} • Verified PDF</p>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-cream-100 hover:bg-saffron-600 hover:text-white text-royal-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Curriculum PDF</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Creator Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-cream-200 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h3 className="font-serif text-xl font-bold text-royal-950">Create Educational Learning Plan</h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Learning Plan Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bronze Casting in the Chola Dynasty"
                  value={planTitle}
                  onChange={e => setPlanTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-saffron-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Category</label>
                  <select
                    value={planCategory}
                    onChange={e => setPlanCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="Monuments">Monuments</option>
                    <option value="Traditions">Traditions</option>
                    <option value="Festivals">Festivals</option>
                    <option value="Art and Crafts">Art and Crafts</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={planDuration}
                    onChange={e => setPlanDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pedagogical Objectives & Curriculum Alignment</label>
                <textarea
                  rows={3}
                  placeholder="Describe student learning outcomes and NCERT chapter references..."
                  value={planObjectives}
                  onChange={e => setPlanObjectives(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow"
                >
                  Save Learning Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
