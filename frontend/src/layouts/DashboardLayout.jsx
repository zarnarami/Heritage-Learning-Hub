import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Landmark,
  LayoutDashboard,
  BookOpen,
  Award,
  BookmarkCheck,
  Users,
  Settings,
  PlusCircle,
  FileText,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Compass,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react';

const DashboardLayout = ({ roleTitle }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItems = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Heritage Management', path: '/admin#heritage-table', icon: Landmark },
        { name: 'User Management', path: '/admin#users-table', icon: Users },
        { name: 'Learning Modules', path: '/learning', icon: BookOpen },
        { name: 'Quiz Assessments', path: '/quizzes', icon: Award },
      ];
    }
    if (user?.role === 'teacher') {
      return [
        { name: 'Teacher Overview', path: '/teacher', icon: LayoutDashboard },
        { name: 'Teaching Curriculum', path: '/teacher#curriculum', icon: BookOpen },
        { name: 'Lesson Planner', path: '/teacher#planner', icon: FileText },
        { name: 'Quiz Resources', path: '/quizzes', icon: Award },
        { name: 'Heritage Catalog', path: '/explore', icon: Compass },
      ];
    }
    // Student
    return [
      { name: 'Student Overview', path: '/student', icon: LayoutDashboard },
      { name: 'Active Modules', path: '/learning', icon: BookOpen },
      { name: 'Quiz Assessments', path: '/quizzes', icon: Award },
      { name: 'Saved Bookmarks', path: '/student#bookmarks', icon: BookmarkCheck },
      { name: 'Explore Heritage', path: '/explore', icon: Compass },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-royal-950 text-white sticky top-0 z-40 border-b border-royal-800">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-royal-900"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gold-amber text-royal-950 flex items-center justify-center font-bold">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-white hidden sm:inline">
                  HERITAGE <span className="text-saffron-500">HUB</span>
                </span>
                <span className="text-xs px-2 py-0.5 ml-2 rounded-full bg-saffron-600/30 text-saffron-400 font-bold border border-saffron-600/40 uppercase">
                  {user?.role} Portal
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-royal-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Main Website</span>
            </Link>

            <div className="flex items-center gap-3 border-l border-royal-800 pl-4">
              <img
                src={user?.profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border border-gold-amber"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-white leading-tight truncate max-w-[140px]">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.profile?.institution || 'Heritage Academy'}</p>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-royal-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-royal-950 text-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? 'translate-x-0 pt-16' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col justify-between py-6 px-4">
            <div className="space-y-6">
              {/* User badge */}
              <div className="p-3.5 rounded-xl bg-royal-900/60 border border-royal-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-saffron-500/20 text-saffron-400 flex items-center justify-center font-bold">
                  {user?.role === 'admin' ? (
                    <LayoutDashboard className="w-5 h-5" />
                  ) : user?.role === 'teacher' ? (
                    <GraduationCap className="w-5 h-5" />
                  ) : (
                    <Award className="w-5 h-5" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-gold-400 capitalize">{user?.role} Workspace</p>
                  <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-royal-900 transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-gold-400 transition-colors" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Support Info */}
            <div className="p-3.5 rounded-xl bg-royal-900/40 border border-royal-800 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">Need Guidance?</p>
              <p className="text-[11px] leading-tight">Access official curriculum guides and archaeological research archives.</p>
              <a
                href="https://asi.nic.in"
                target="_blank"
                rel="noreferrer"
                className="inline-block pt-1 text-gold-400 hover:underline font-medium"
              >
                Visit ASI Portal →
              </a>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
