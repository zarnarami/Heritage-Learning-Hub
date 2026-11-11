import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Landmark, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname;

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (from) {
        navigate(from, { replace: true });
      } else if (res.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (res.user.role === 'teacher') {
        navigate('/teacher', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
    }
  };

  const setDemoCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-md p-8 sm:p-10 rounded-3xl border border-cream-200 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-royal-950 text-gold-amber mx-auto flex items-center justify-center font-bold shadow-md border border-gold-600/30">
            <Landmark className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-royal-950">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to your Heritage Learning Hub account</p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
          <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center">
            Quick Academic Test Accounts
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('student@heritagehub.in', 'Student@123')}
              className="py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:border-saffron-500 text-[11px] font-bold text-slate-700 transition-colors shadow-2xs"
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('teacher@heritagehub.in', 'Teacher@123')}
              className="py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:border-saffron-500 text-[11px] font-bold text-slate-700 transition-colors shadow-2xs"
            >
              👨‍🏫 Teacher
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin@heritagehub.in', 'Admin@12345')}
              className="py-1.5 px-2 rounded-lg bg-royal-900 border border-royal-950 text-gold-400 hover:text-white text-[11px] font-bold transition-colors shadow-2xs"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@heritagehub.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-saffron-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-saffron-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Hub</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-cream-200">
          <p className="text-xs text-slate-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-royal-950 hover:text-saffron-600 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
