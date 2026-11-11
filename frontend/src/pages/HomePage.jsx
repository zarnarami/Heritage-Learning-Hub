import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Landmark,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  Users,
  Building,
  Palette,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { heritageAPI } from '../services/api';
import HeritageCard from '../components/heritage/HeritageCard';

const HomePage = () => {
  const [featuredHeritage, setFeaturedHeritage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await heritageAPI.getAll({ limit: 6, sort: 'popular' });
        setFeaturedHeritage(res.data.data);
      } catch (err) {
        console.error('Failed to load featured heritage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    {
      name: 'Monuments',
      icon: Landmark,
      count: 'Hundreds of Forts & Palaces',
      description: 'Explore royal citadels, majestic fortresses, and monumental architecture.',
      color: 'from-amber-600 to-amber-800',
    },
    {
      name: 'UNESCO Heritage Sites',
      icon: ShieldCheck,
      count: '42+ Inscribed Sites',
      description: 'World-recognized tangible monuments of outstanding universal value.',
      color: 'from-blue-600 to-blue-800',
    },
    {
      name: 'Architecture',
      icon: Building,
      count: 'Nagara & Dravidian',
      description: 'Discover sacred stone geometries, rock-cut caverns, and stepped wells.',
      color: 'from-purple-600 to-purple-800',
    },
    {
      name: 'Festivals',
      icon: Sparkles,
      count: 'Seasonal & Devotional',
      description: 'Celebrate living traditions like Garba, Durga Puja, and Deepavali.',
      color: 'from-orange-600 to-orange-800',
    },
    {
      name: 'Art and Crafts',
      icon: Palette,
      count: 'GI-Tagged Traditions',
      description: 'Ancient folk paintings, bronze castings, and timeless handlooms.',
      color: 'from-rose-600 to-rose-800',
    },
    {
      name: 'Traditions',
      icon: Award,
      count: 'Living Intangible Heritage',
      description: 'Classical dances like Bharatanatyam and ancient Vedic chanting.',
      color: 'from-emerald-600 to-emerald-800',
    },
  ];

  const stats = [
    { label: 'UNESCO World Heritage Sites', value: '42+' },
    { label: 'Years of Documented Civilization', value: '5,000+' },
    { label: 'Indian States & UTs Covered', value: '36' },
    { label: 'Official Authenticated Citations', value: '100%' },
  ];

  const testimonials = [
    {
      quote:
        'Heritage Learning Hub transformed how our students visualize ancient temple architecture. The direct citations from Archaeological Survey of India make it ideal for classroom curriculum.',
      author: 'Dr. Meenakshi Sundaram',
      role: 'Head of History Department, Central University',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
    {
      quote:
        'The interactive assessments and authentic historical fact sheets gave me deep insights into the water engineering of Dholavira and Rani ki Vav that standard textbooks missed.',
      author: 'Kavya Sharma',
      role: 'National Heritage Olympiad Gold Medalist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative min-h-[640px] flex items-center bg-royal-950 overflow-hidden">
        {/* Background Overlay Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1920&q=80"
            alt="Indian Heritage - Taj Mahal"
            className="w-full h-full object-cover object-center opacity-30 scale-105 animate-pulse duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-royal-950 via-royal-950/85 to-royal-950/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-royal-950 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-600/20 border border-saffron-500/40 text-saffron-400 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>National Digital Repository for Indian Culture & History</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Discover the Rich <span className="text-saffron-500">Heritage</span> of India
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed">
              Explore authentic historical monuments, UNESCO World Heritage Sites, living folk traditions,
              and classical arts through verified government archives, structured curriculum modules, and interactive assessments.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/explore"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-500 hover:to-saffron-600 text-white font-bold text-base shadow-lg shadow-saffron-900/30 hover:shadow-xl transition-all flex items-center gap-2 group"
              >
                <Compass className="w-5 h-5" />
                <span>Explore Heritage</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/learning"
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base backdrop-blur-md transition-all flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5 text-gold-400" />
                <span>Learning Modules</span>
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Archaeological Survey of India (ASI) Verified
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                UNESCO Tangible & Intangible Documentation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Browse by Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-saffron-600">Thematic Classification</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-royal-950 mt-1">Browse by Category</h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Structured domains encompassing five millennia of art, ritual, engineering, and architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group relative bg-white p-7 rounded-2xl border border-cream-200 hover:border-gold-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-gold-700 tracking-wide">{cat.count}</span>
                  <h3 className="font-serif text-xl font-bold text-royal-950 group-hover:text-saffron-600 transition-colors mt-1 mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{cat.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-cream-100 flex items-center justify-between text-xs font-bold text-royal-900 group-hover:text-saffron-600">
                  <span>Explore Catalog</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Heritage Sites */}
      <section className="bg-cream-100 py-16 border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-saffron-600">National Treasures</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-royal-950 mt-1">Featured Heritage Sites</h2>
              <p className="text-slate-600 text-sm mt-1">
                Curated monuments of outstanding universal significance with complete historical records.
              </p>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-royal-900 hover:text-saffron-600 transition-colors"
            >
              <span>View All Heritage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-96 bg-white rounded-2xl animate-pulse border border-cream-200"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHeritage.map(item => (
                <HeritageCard key={item._id} heritage={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Educational Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-royal-950 rounded-3xl text-white p-8 sm:p-14 relative overflow-hidden border border-gold-600/30">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Academic Excellence</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Why Heritage Education Matters
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              India’s cultural heritage is not merely a collection of ancient ruins—it is a living continuum of mathematics,
              ecological wisdom, acoustic physics, hydraulic engineering, and artistic philosophies.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-saffron-600/30 text-saffron-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-cream-100">Curriculum-Aligned Learning Modules</h4>
                  <p className="text-xs text-slate-400">Structured lessons with NCERT citations, architectural diagrams, and downloadable PDFs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-saffron-600/30 text-saffron-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-cream-100">Interactive Knowledge Assessments</h4>
                  <p className="text-xs text-slate-400">Timed quizzes with immediate scores, historical explanations, and verifiable badges.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-saffron-600/30 text-saffron-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-cream-100">Teacher & Student Portals</h4>
                  <p className="text-xs text-slate-400">Role-specific dashboards for tracking learning progress, bookmarks, and curriculum plans.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-sm shadow transition-all"
              >
                <span>Get Started as Student or Teacher</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Decorative Pattern / Accent */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none">
            <div className="w-full h-full bg-mandala-pattern"></div>
          </div>
        </div>
      </section>

      {/* 5. Statistics Section */}
      <section className="bg-white py-12 border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <span className="block font-serif text-4xl sm:text-5xl font-extrabold text-royal-950">{s.value}</span>
                <span className="block text-xs sm:text-sm font-semibold text-slate-600">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-saffron-600">Educational Impact</span>
          <h2 className="font-serif text-3xl font-bold text-royal-950 mt-1">Voices from Academia</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-cream-200 shadow-sm flex flex-col justify-between">
              <p className="text-slate-700 italic text-sm sm:text-base leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full object-cover border border-gold-amber" />
                <div>
                  <h4 className="font-bold text-royal-950 text-sm">{t.author}</h4>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
