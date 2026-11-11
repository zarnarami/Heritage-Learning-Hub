import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Bookmark, BookmarkCheck, ArrowRight, ShieldCheck, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookmarkAPI } from '../../services/api';
import toast from 'react-hot-toast';

const HeritageCard = ({ heritage, isBookmarked = false, onBookmarkToggle }) => {
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const handleBookmarkClick = async e => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please log in to save items to your personal bookmarks.');
      return;
    }

    setLoadingBookmark(true);
    try {
      if (bookmarked) {
        await bookmarkAPI.remove(heritage._id);
        setBookmarked(false);
        toast.success(`Removed "${heritage.name}" from bookmarks.`);
      } else {
        await bookmarkAPI.add(heritage._id);
        setBookmarked(true);
        toast.success(`Saved "${heritage.name}" to your bookmarks!`);
      }
      if (onBookmarkToggle) onBookmarkToggle(heritage._id, !bookmarked);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating bookmark.');
    } finally {
      setLoadingBookmark(false);
    }
  };

  const categoryColorMap = {
    'UNESCO Heritage Sites': 'bg-amber-100 text-amber-900 border-amber-300',
    Monuments: 'bg-blue-100 text-blue-900 border-blue-300',
    Festivals: 'bg-orange-100 text-orange-900 border-orange-300',
    Traditions: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    'Art and Crafts': 'bg-rose-100 text-rose-900 border-rose-300',
    Architecture: 'bg-purple-100 text-purple-900 border-purple-300',
    'Historical Events': 'bg-red-100 text-red-900 border-red-300',
  };

  const badgeClass =
    categoryColorMap[heritage.category] || 'bg-slate-100 text-slate-800 border-slate-300';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-cream-200 hover:border-gold-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-slate-900">
        <img
          src={heritage.images?.[0] || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'}
          alt={heritage.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-950/80 via-transparent to-transparent"></div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${badgeClass}`}>
            {heritage.category}
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          disabled={loadingBookmark}
          title={bookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-royal-950 hover:text-saffron-600 shadow-md backdrop-blur-sm transition-all"
        >
          {bookmarked ? (
            <BookmarkCheck className="w-4 h-4 text-saffron-600 fill-saffron-600" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>

        {/* Location tag on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-saffron-400" />
            <span className="truncate max-w-[170px]">{heritage.location}, {heritage.state}</span>
          </div>
          {heritage.viewsCount !== undefined && (
            <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded backdrop-blur-sm text-slate-300">
              <Eye className="w-3 h-3" />
              <span>{heritage.viewsCount}</span>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs text-gold-700 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-gold-600" />
            <span className="truncate">{heritage.historicalPeriod}</span>
          </div>

          <h3 className="font-serif text-xl font-bold text-royal-950 group-hover:text-saffron-600 transition-colors line-clamp-1">
            {heritage.name}
          </h3>

          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
            {heritage.description}
          </p>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Official Reference Verified</span>
            </span>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 mt-4 border-t border-cream-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            {heritage.state} Heritage
          </span>
          <Link
            to={`/heritage/${heritage._id}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-royal-900 group-hover:text-saffron-600 transition-colors"
          >
            <span>Explore Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeritageCard;
