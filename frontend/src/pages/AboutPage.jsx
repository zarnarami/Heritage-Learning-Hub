import React from 'react';
import { Landmark, ShieldCheck, BookOpen, GraduationCap, Users, Heart, Award, CheckCircle2, ExternalLink } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Header */}
      <section className="bg-royal-950 text-white py-20 border-b-4 border-gold-amber">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-saffron-500">Academic & Cultural Mission</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight mt-2 mb-4">
            Preserving India's Eternal Heritage Through Digital Education
          </h1>
          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            Heritage Learning Hub bridges centuries of classical history with modern interactive learning,
            providing students, scholars, and teachers with an authoritative digital gateway to India's cultural genius.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-cream-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-saffron-500/10 text-saffron-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-royal-950">Our Vision</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              To establish a world-class digital repository where India's architectural marvels, living intangible
              traditions, and ancient scientific heritage are preserved with academic rigor, making cultural literacy
              an engaging, accessible component of everyday education for millions of learners globally.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-cream-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-royal-900/10 text-royal-900 flex items-center justify-center font-bold">
              <Landmark className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-royal-950">Our Mission</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              To systematically organize verified information from official government agencies like the
              Archaeological Survey of India (ASI) and UNESCO, providing interactive curricula, downloadable guides,
              and standardized assessments that empower students and educators.
            </p>
          </div>
        </div>
      </section>

      {/* Core Objectives */}
      <section className="bg-cream-100 py-16 border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron-600">Strategic Pillars</span>
            <h2 className="font-serif text-3xl font-bold text-royal-950 mt-1">Platform Objectives</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Authentic Data Preservation',
                desc: 'Strict reliance on verifiable records from ASI, UNESCO, and the Ministry of Culture to eliminate historical misinformation.',
              },
              {
                title: 'Interactive Pedagogy',
                desc: 'Transforming passive memorization into engaging discovery through quizzes, diagrams, and digital modules.',
              },
              {
                title: 'Tangible & Intangible Inclusivity',
                desc: 'Equally celebrating rock-cut architecture alongside living folk dances, crafts, and festive traditions.',
              },
              {
                title: 'Academic Empowerment',
                desc: 'Equipping teachers with classroom lesson plans, downloadable resources, and measurable student progress tracking.',
              },
            ].map((obj, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-cream-200 shadow-sm space-y-2">
                <span className="text-saffron-600 font-serif font-bold text-lg">0{i + 1}.</span>
                <h3 className="font-serif text-lg font-bold text-royal-950">{obj.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How the Platform Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-saffron-600">Step-by-Step Experience</span>
          <h2 className="font-serif text-3xl font-bold text-royal-950 mt-1">How Heritage Hub Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-cream-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-royal-900 text-gold-400 mx-auto flex items-center justify-center font-serif text-2xl font-bold">
              1
            </div>
            <h3 className="font-serif text-xl font-bold text-royal-950">Explore & Discover</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Search by monument, dynasty, category, or Indian state. Browse curated high-resolution photography,
              architectural blueprints, and authenticated facts.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-cream-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-saffron-600 text-white mx-auto flex items-center justify-center font-serif text-2xl font-bold">
              2
            </div>
            <h3 className="font-serif text-xl font-bold text-royal-950">Study Learning Modules</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Read curriculum-oriented lessons, download official NCERT & ASI PDF guides, and watch verified educational documentaries.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-cream-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gold-amber text-royal-950 mx-auto flex items-center justify-center font-serif text-2xl font-bold">
              3
            </div>
            <h3 className="font-serif text-xl font-bold text-royal-950">Assess & Certify</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Take timed interactive quizzes, review instant answer breakdowns with historical context, earn achievement badges, and track mastery.
            </p>
          </div>
        </div>
      </section>

      {/* Official Acknowledgement Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-royal-950 rounded-3xl p-8 sm:p-12 text-white border border-gold-600/40">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-saffron-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Reference Sources & Acknowledgements</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">Rooted in Authentic National Archives</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Every heritage entry, historical date, architectural analysis, and intangible classification on Heritage
              Learning Hub strictly derives from documented publications by the Archaeological Survey of India (ASI),
              the Ministry of Culture (Government of India), the Sangeet Natak Akademi, and the UNESCO World Heritage Centre.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold">
              <a
                href="https://indiaculture.gov.in"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-royal-900 hover:bg-royal-800 text-gold-300 flex items-center gap-1.5 border border-royal-700"
              >
                <span>Ministry of Culture, GoI</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://asi.nic.in"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-royal-900 hover:bg-royal-800 text-gold-300 flex items-center gap-1.5 border border-royal-700"
              >
                <span>Archaeological Survey of India</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://whc.unesco.org"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-royal-900 hover:bg-royal-800 text-gold-300 flex items-center gap-1.5 border border-royal-700"
              >
                <span>UNESCO World Heritage Centre</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
