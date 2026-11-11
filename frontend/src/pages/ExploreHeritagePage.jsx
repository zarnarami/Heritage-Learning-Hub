import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, MapPin, Landmark, RotateCcw, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { heritageAPI, bookmarkAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import HeritageCard from '../components/heritage/HeritageCard';

const ExploreHeritagePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters state
  const initialCategory = searchParams.get('category') || 'All';
  const [category, setCategory] = useState(initialCategory);
  const [stateFilter, setStateFilter] = useState('All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('popular');
  const [page, setPage] = useState(1);

  // Filter options from backend
  const [categoriesList, setCategoriesList] = useState([
    'All',
    'UNESCO Heritage Sites',
    'Monuments',
    'Festivals',
    'Traditions',
    'Art and Crafts',
    'Architecture',
    'Historical Events',
  ]);
  const [statesList, setStatesList] = useState(['All']);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  // Fetch filter options (states & categories)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await heritageAPI.getFilterOptions();
        if (res.data?.data) {
          if (res.data.data.categories) setCategoriesList(res.data.data.categories);
          if (res.data.data.states) setStatesList(res.data.data.states);
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch bookmarks if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchBookmarks = async () => {
        try {
          const res = await bookmarkAPI.getAll();
          const ids = new Set(res.data.data.map(b => b.heritageId?._id || b.heritageId));
          setBookmarkedIds(ids);
        } catch (err) {
          console.error('Error loading bookmarks:', err);
        }
      };
      fetchBookmarks();
    }
  }, [isAuthenticated]);

  // Sync category from URL search params
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && urlCategory !== category) {
      setCategory(urlCategory);
      setPage(1);
    }
  }, [searchParams]);

  // Main data fetch
  useEffect(() => {
    const fetchHeritage = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 9,
          sort: sortBy,
        };
        if (category && category !== 'All') params.category = category;
        if (stateFilter && stateFilter !== 'All') params.state = stateFilter;
        if (search.trim()) params.search = search.trim();

        const res = await heritageAPI.getAll(params);
        setItems(res.data.data);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Failed to load heritage items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeritage();
  }, [category, stateFilter, search, sortBy, page]);

  const handleSearchSubmit = e => {
    e.preventDefault();
    setPage(1);
  };

  const handleResetFilters = () => {
    setCategory('All');
    setStateFilter('All');
    setSearch('');
    setSortBy('popular');
    setPage(1);
    setSearchParams({});
  };

  const handleBookmarkToggle = (heritageId, isAdded) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (isAdded) next.add(heritageId);
      else next.delete(heritageId);
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-saffron-600">Central Heritage Catalog</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-royal-950">Explore India's Living Heritage</h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Browse authenticated monuments, temple architecture, intangible folk rituals, and historic civilizations.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm space-y-4">
        {/* Top row: search & sorting */}
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, state, location, or historical period..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 text-sm outline-none transition-all"
            />
          </form>

          <div className="flex items-center gap-3">
            {/* State filter */}
            <div className="relative min-w-[160px]">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={stateFilter}
                onChange={e => {
                  setStateFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:border-saffron-500 bg-white text-sm outline-none cursor-pointer appearance-none"
              >
                <option value="All">All States</option>
                {statesList
                  .filter(s => s !== 'All')
                  .map(st => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
              </select>
            </div>

            {/* Sort order */}
            <div className="relative min-w-[150px]">
              <SlidersHorizontal className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={e => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:border-saffron-500 bg-white text-sm outline-none cursor-pointer appearance-none"
              >
                <option value="popular">Most Popular</option>
                <option value="name">Alphabetical (A-Z)</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>

            {(category !== 'All' || stateFilter !== 'All' || search || sortBy !== 'popular') && (
              <button
                onClick={handleResetFilters}
                title="Reset Filters"
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-cream-100 text-slate-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all border ${
                category === cat
                  ? 'bg-royal-950 text-white border-royal-950 shadow-sm'
                  : 'bg-cream-50 hover:bg-cream-100 text-slate-700 border-cream-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 font-semibold px-1">
        <span>
          Showing <span className="text-royal-950 font-bold">{items.length}</span> of{' '}
          <span className="text-royal-950 font-bold">{total}</span> authenticated heritage records
        </span>
        {category !== 'All' && (
          <span className="text-saffron-600 bg-saffron-50 px-2.5 py-1 rounded-full border border-saffron-200 text-xs font-bold">
            Category: {category}
          </span>
        )}
      </div>

      {/* Heritage Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-96 bg-white rounded-2xl animate-pulse border border-cream-200"></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-royal-950">No Heritage Records Found</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            We couldn't find any heritage items matching your active search or filter criteria. Try resetting your filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-royal-950 text-white font-bold text-sm shadow hover:bg-saffron-600 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <HeritageCard
              key={item._id}
              heritage={item}
              isBookmarked={bookmarkedIds.has(item._id)}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-cream-100 text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1 text-sm font-bold">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl transition-all ${
                  page === p
                    ? 'bg-saffron-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-cream-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-cream-100 text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreHeritagePage;
