import React, { useState, useEffect } from 'react';
import {
  Users,
  Landmark,
  BookOpen,
  Award,
  ShieldCheck,
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BookmarkCheck,
  Building,
  Save,
  X,
  Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { adminAPI, heritageAPI } from '../services/api';
import toast from 'react-hot-toast';

const COLORS = ['#ea580c', '#0f2c59', '#ca8a04', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [heritageList, setHeritageList] = useState([]);
  const [loading, setLoading] = useState(true);

  // User search/filter
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  // Content Modal (Add / Edit Heritage)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Monuments',
    state: 'Uttar Pradesh',
    location: '',
    historicalPeriod: '',
    description: '',
    culturalSignificance: '',
    architecturalDetails: '',
    importantFacts: '',
    images: '',
    sourceUrl: 'https://asi.nic.in',
    sourceOrg: 'Archaeological Survey of India',
    featured: false,
  });

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, heritageRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllUsers(),
        heritageAPI.getAll({ limit: 100 }),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setHeritageList(heritageRes.data.data);
    } catch (err) {
      toast.error('Failed to load admin management dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Monuments',
      state: 'Uttar Pradesh',
      location: '',
      historicalPeriod: '',
      description: '',
      culturalSignificance: '',
      architecturalDetails: '',
      importantFacts: '',
      images: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      sourceUrl: 'https://asi.nic.in',
      sourceOrg: 'Archaeological Survey of India',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = item => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      state: item.state,
      location: item.location,
      historicalPeriod: item.historicalPeriod,
      description: item.description,
      culturalSignificance: item.culturalSignificance,
      architecturalDetails: item.architecturalDetails || '',
      importantFacts: Array.isArray(item.importantFacts) ? item.importantFacts.join('\n') : '',
      images: Array.isArray(item.images) ? item.images.join(', ') : '',
      sourceUrl: item.sourceReferences?.[0]?.url || 'https://asi.nic.in',
      sourceOrg: item.sourceReferences?.[0]?.organization || 'Archaeological Survey of India',
      featured: Boolean(item.featured),
    });
    setIsModalOpen(true);
  };

  const handleDeleteHeritage = async id => {
    if (!window.confirm('Are you sure you want to delete this authentic heritage entry from the national repository?')) {
      return;
    }
    try {
      await heritageAPI.delete(id);
      toast.success('Heritage record deleted.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete heritage item.');
    }
  };

  const handleSaveHeritage = async e => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        state: formData.state,
        location: formData.location,
        historicalPeriod: formData.historicalPeriod,
        description: formData.description,
        culturalSignificance: formData.culturalSignificance,
        architecturalDetails: formData.architecturalDetails,
        importantFacts: formData.importantFacts.split('\n').filter(Boolean),
        images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
        sourceReferences: [
          {
            title: `${formData.name} Verification Archive`,
            url: formData.sourceUrl,
            organization: formData.sourceOrg,
          },
        ],
        featured: formData.featured,
      };

      if (editingItem) {
        await heritageAPI.update(editingItem._id, payload);
        toast.success(`Updated "${formData.name}" successfully.`);
      } else {
        await heritageAPI.create(payload);
        toast.success(`Created "${formData.name}" with official source verification.`);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving heritage entry.');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUser(userId, { role: newRole });
      toast.success('User role updated successfully.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating user role.');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminAPI.updateUser(userId, { isActive: !currentStatus });
      toast.success(`Account ${!currentStatus ? 'activated' : 'deactivated'}.`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating status.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 font-serif">Loading Administrator Central Console...</p>
        </div>
      </div>
    );
  }

  // Filter users
  const filteredUsers = users.filter(u => {
    if (userRoleFilter !== 'All' && u.role !== userRoleFilter) return false;
    if (userSearch.trim()) {
      const term = userSearch.toLowerCase();
      return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* 1. Admin Header */}
      <div className="bg-gradient-to-r from-royal-950 via-royal-900 to-royal-800 rounded-3xl p-6 sm:p-8 text-white border border-gold-600/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-saffron-600 text-white uppercase tracking-wider">
              Executive Administration
            </span>
            <span className="text-xs text-gold-400 font-mono">Platform v1.0 Live</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1">National Heritage Central Console</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
            Manage authentic archaeological content, approve educational modules, and oversee user access roles.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow flex items-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Heritage Entry</span>
        </button>
      </div>

      {/* 2. Platform KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center">
          <span className="block text-2xl font-extrabold text-royal-950">{stats?.counts?.totalUsers || 0}</span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Users</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center">
          <span className="block text-2xl font-extrabold text-saffron-600">{stats?.counts?.totalStudents || 0}</span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Students</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center">
          <span className="block text-2xl font-extrabold text-royal-800">{stats?.counts?.totalTeachers || 0}</span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Teachers</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center">
          <span className="block text-2xl font-extrabold text-gold-700">{stats?.counts?.totalHeritage || 0}</span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Heritage Records</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center">
          <span className="block text-2xl font-extrabold text-emerald-700">{stats?.counts?.totalModules || 0}</span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Learning Modules</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center">
          <span className="block text-2xl font-extrabold text-purple-700">{stats?.counts?.totalQuizzes || 0}</span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Quizzes</span>
        </div>
      </div>

      {/* 3. Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cream-100">
            <div>
              <h3 className="font-serif text-base font-bold text-royal-950">Heritage Content by Domain</h3>
              <p className="text-xs text-slate-500">Distribution across categories</p>
            </div>
            <span className="text-xs font-bold text-royal-950 bg-cream-100 px-2.5 py-1 rounded-full">
              {stats?.categoryData?.length || 0} Categories
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.categoryData || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1ede2" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f2c59',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#ea580c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State Geographic Distribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cream-100">
            <div>
              <h3 className="font-serif text-base font-bold text-royal-950">Top Represented States</h3>
              <p className="text-xs text-slate-500">Geographic cultural coverage</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.stateData || []}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {(stats?.stateData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Heritage Content Management Table */}
      <div id="heritage-table" className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-royal-950">Heritage Content Repository</h3>
            <p className="text-xs text-slate-500">Add, inspect, edit, or archive national monument records</p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-royal-950 hover:bg-saffron-600 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Heritage Record</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100 text-royal-950 font-serif border-b border-cream-200">
              <tr>
                <th className="p-3">Monument / Tradition</th>
                <th className="p-3">Category</th>
                <th className="p-3">State & Location</th>
                <th className="p-3">Period</th>
                <th className="p-3">Views</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {heritageList.map(item => (
                <tr key={item._id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="p-3 font-bold text-royal-950 flex items-center gap-2">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=100&q=80'}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span className="truncate max-w-[200px]">{item.name}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-royal-100 text-royal-900">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 truncate max-w-[150px]">
                    {item.location}, {item.state}
                  </td>
                  <td className="p-3 text-gold-700 font-medium truncate max-w-[160px]">
                    {item.historicalPeriod}
                  </td>
                  <td className="p-3 text-slate-500 font-mono">{item.viewsCount || 0}</td>
                  <td className="p-3 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      title="Edit Entry"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-royal-950 hover:bg-cream-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteHeritage(item._id)}
                      title="Delete Entry"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. User Management Table */}
      <div id="users-table" className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-royal-950">User Role & Account Management</h3>
            <p className="text-xs text-slate-500">Assign roles, inspect registration profiles, and toggle account activation</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>

            <select
              value={userRoleFilter}
              onChange={e => setUserRoleFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs bg-white cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100 text-royal-950 font-serif border-b border-cream-200">
              <tr>
                <th className="p-3">User Profile</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Account Status</th>
                <th className="p-3">Registered Date</th>
                <th className="p-3 text-right">Role Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredUsers.map(userItem => (
                <tr key={userItem._id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="p-3 font-bold text-royal-950 flex items-center gap-2">
                    <img
                      src={userItem.profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{userItem.name}</span>
                  </td>
                  <td className="p-3 text-slate-600 font-mono">{userItem.email}</td>
                  <td className="p-3">
                    <select
                      value={userItem.role}
                      onChange={e => handleUpdateUserRole(userItem._id, e.target.value)}
                      className="p-1 rounded-lg border border-slate-200 text-xs font-bold uppercase cursor-pointer bg-white"
                    >
                      <option value="student">student</option>
                      <option value="teacher">teacher</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleUserStatus(userItem._id, userItem.isActive)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        userItem.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {userItem.isActive ? 'Active' : 'Deactivated'}
                    </button>
                  </td>
                  <td className="p-3 text-slate-500">
                    {new Date(userItem.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleUserStatus(userItem._id, userItem.isActive)}
                      className="text-[11px] font-bold text-slate-600 hover:text-royal-950 hover:underline"
                    >
                      {userItem.isActive ? 'Suspend' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit Heritage */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-cream-200">
            <div className="p-6 bg-royal-950 text-white flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold">
                {editingItem ? 'Edit Heritage Entry' : 'Create New Heritage Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHeritage} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monument / Heritage Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Monuments">Monuments</option>
                    <option value="UNESCO Heritage Sites">UNESCO Heritage Sites</option>
                    <option value="Festivals">Festivals</option>
                    <option value="Traditions">Traditions</option>
                    <option value="Art and Crafts">Art and Crafts</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Historical Events">Historical Events</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Indian State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Historical Time Period *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 13th Century (c. 1250 CE, Eastern Ganga Dynasty)"
                  value={formData.historicalPeriod}
                  onChange={e => setFormData({ ...formData, historicalPeriod: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Historical Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cultural Significance *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.culturalSignificance}
                  onChange={e => setFormData({ ...formData, culturalSignificance: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Architectural Details</label>
                <textarea
                  rows={2}
                  value={formData.architecturalDetails}
                  onChange={e => setFormData({ ...formData, architecturalDetails: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Important Facts (one per line)</label>
                <textarea
                  rows={3}
                  value={formData.importantFacts}
                  onChange={e => setFormData({ ...formData, importantFacts: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URLs (comma separated)</label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={e => setFormData({ ...formData, images: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Reference URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.sourceUrl}
                    onChange={e => setFormData({ ...formData, sourceUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reference Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.sourceOrg}
                    onChange={e => setFormData({ ...formData, sourceOrg: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-cream-50 border-t border-cream-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold shadow"
                >
                  Save Heritage Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
