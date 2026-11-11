import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Landmark,
  Compass,
  BookOpen,
  Award,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  BookmarkCheck,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Heritage', path: '/explore' },
    { name: 'Learning Resources', path: '/learning' },
    { name: 'Quiz & Assessments', path: '/quizzes' },
    { name: 'About Us', path: '/about' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'teacher') return '/teacher';
    return '/student';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-cream-200 shadow-sm transition-all">
      {/* Top National Banner */}
      <div className="bg-royal-950 text-cream-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-saffron-500 animate-pulse"></span>
            <span className="font-medium tracking-wide">National Cultural Repository & Heritage Learning Platform</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <span>Official References: ASI • UNESCO • Ministry of Culture</span>
            <span className="text-gold-400 font-medium">Toll Free: 1800-11-2026</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-900 to-royal-800 text-gold-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-gold-600/30">
              <Landmark className="w-7 h-7" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-royal-950 group-hover:text-saffron-600 transition-colors">
                HERITAGE <span className="text-saffron-600">HUB</span>
              </span>
              <span className="block text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                India's Living Legacy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-saffron-600 bg-saffron-50/80 font-bold'
                      : 'text-slate-700 hover:text-royal-900 hover:bg-cream-100'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-gold-500 bg-white hover:bg-cream-50 transition-all shadow-sm"
                >
                  <img
                    src={user?.profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-royal-900"
                  />
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-royal-950 leading-tight max-w-[120px] truncate">{user.name}</p>
                    <p className="text-[10px] uppercase font-semibold text-saffron-600 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-cream-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-royal-950 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-saffron-100 text-saffron-700 capitalize">
                        {user.role} Account
                      </span>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-cream-100 hover:text-royal-900"
                    >
                      <LayoutDashboard className="w-4 h-4 text-saffron-600" />
                      <span>My Dashboard</span>
                    </Link>

                    {user.role === 'student' && (
                      <Link
                        to="/student"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-cream-100 hover:text-royal-900"
                      >
                        <BookmarkCheck className="w-4 h-4 text-gold-600" />
                        <span>Saved Bookmarks</span>
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-cream-100 hover:text-royal-900"
                      >
                        <ShieldCheck className="w-4 h-4 text-royal-800" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-royal-900 hover:text-saffron-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-saffron-600 hover:bg-saffron-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" />
                  <span>Join Platform</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-royal-900 hover:bg-cream-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-cream-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1 pb-4 border-b border-slate-100">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-base font-semibold ${
                    isActive ? 'text-saffron-600 bg-saffron-50 font-bold' : 'text-slate-700 hover:bg-cream-100'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-cream-50 rounded-lg">
                  <img
                    src={user?.profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-royal-950">{user.name}</p>
                    <p className="text-xs text-saffron-600 capitalize">{user.role} Account</p>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 px-4 rounded-lg bg-royal-900 text-white font-semibold text-sm"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 px-4 rounded-lg text-red-600 font-semibold text-sm hover:bg-red-50"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-4 rounded-lg border border-slate-300 font-semibold text-sm text-royal-950 hover:bg-cream-100"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-4 rounded-lg bg-saffron-600 text-white font-semibold text-sm hover:bg-saffron-700 shadow"
                >
                  Join Platform
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
