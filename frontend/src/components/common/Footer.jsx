import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ExternalLink, ShieldCheck, Heart, Sparkles, BookOpen, Compass } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-royal-950 text-cream-100 border-t-4 border-gold-amber pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-royal-800">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-900 to-royal-800 text-gold-400 flex items-center justify-center border border-gold-600/40">
                <Landmark className="w-7 h-7" />
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold tracking-tight text-white">
                  HERITAGE <span className="text-saffron-500">HUB</span>
                </span>
                <span className="block text-xs font-semibold tracking-widest text-gold-400 uppercase">
                  Discover. Learn. Preserve.
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              Heritage Learning Hub is a centralized digital educational platform designed to safeguard, celebrate,
              and teach Indian cultural history, monuments, intangible traditions, and architecture for students,
              teachers, and global heritage enthusiasts.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-gold-300">
              <ShieldCheck className="w-4 h-4 text-saffron-500" />
              <span>Aligned with National Curriculum & UNESCO Preservation Standards</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide border-b border-royal-800 pb-2">
              Platform Pages
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/" className="hover:text-saffron-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-saffron-400 transition-colors">
                  Explore Heritage Catalog
                </Link>
              </li>
              <li>
                <Link to="/learning" className="hover:text-saffron-400 transition-colors">
                  Learning Modules & Lessons
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="hover:text-saffron-400 transition-colors">
                  Interactive Quizzes & Tests
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-saffron-400 transition-colors">
                  About the Heritage Initiative
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Heritage Categories */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide border-b border-royal-800 pb-2">
              Heritage Topics
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/explore?category=UNESCO Heritage Sites" className="hover:text-gold-400 transition-colors">
                  UNESCO World Heritage Sites
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Monuments" className="hover:text-gold-400 transition-colors">
                  Historical Monuments & Forts
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Architecture" className="hover:text-gold-400 transition-colors">
                  Nagara & Dravidian Architecture
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Festivals" className="hover:text-gold-400 transition-colors">
                  Festivals & Living Traditions
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Art and Crafts" className="hover:text-gold-400 transition-colors">
                  Traditional Art, GI Crafts & Murals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Authentic Official Sources */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide border-b border-royal-800 pb-2">
              Official Reference Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a
                  href="https://indiaculture.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-saffron-400 flex items-center justify-between group"
                >
                  <span>Ministry of Culture, GoI</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://asi.nic.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-saffron-400 flex items-center justify-between group"
                >
                  <span>Archaeological Survey of India</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://whc.unesco.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-saffron-400 flex items-center justify-between group"
                >
                  <span>UNESCO World Heritage Centre</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.incredibleindia.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-saffron-400 flex items-center justify-between group"
                >
                  <span>Incredible India Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.indianculture.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-saffron-400 flex items-center justify-between group"
                >
                  <span>Indian Culture Digital Repository</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Heritage Learning Hub. Built for Academic and Cultural Excellence.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              Preserving Indian Heritage with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Future Generations
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
