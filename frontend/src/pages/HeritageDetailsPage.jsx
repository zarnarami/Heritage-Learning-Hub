import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ArrowLeft,
  Building2,
  Sparkles,
  Info,
  CheckCircle,
  Video,
  Share2,
} from 'lucide-react';
import { heritageAPI, bookmarkAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import HeritageCard from '../components/heritage/HeritageCard';
import toast from 'react-hot-toast';

const HeritageDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [heritage, setHeritage] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await heritageAPI.getById(id);
        setHeritage(res.data.data);
        setRelated(res.data.related || []);
        setSelectedImage(0);

        // Record recent view if authenticated
        if (isAuthenticated) {
          progressAPI.recordView(id).catch(e => console.warn('Record view failed', e));

          // Check if bookmarked
          const bRes = await bookmarkAPI.getAll();
          const isMarked = bRes.data.data.some(b => String(b.heritageId?._id || b.heritageId) === String(id));
          setBookmarked(isMarked);
        }
      } catch (err) {
        toast.error('Failed to load heritage details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, isAuthenticated]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save this item to your personal bookmarks.');
      return;
    }

    setLoadingBookmark(true);
    try {
      if (bookmarked) {
        await bookmarkAPI.remove(id);
        setBookmarked(false);
        toast.success(`Removed "${heritage.name}" from bookmarks.`);
      } else {
        await bookmarkAPI.add(id);
        setBookmarked(true);
        toast.success(`Saved "${heritage.name}" to your bookmarks!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating bookmark.');
    } finally {
      setLoadingBookmark(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: heritage.name,
        text: `Explore ${heritage.name} on Heritage Learning Hub!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 font-serif font-medium">Retrieving Authenticated Archaeological Archive...</p>
        </div>
      </div>
    );
  }

  if (!heritage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-royal-950 mb-4">Heritage Entry Not Found</h2>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-royal-950 text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <Link
            to="/explore"
            className="flex items-center gap-1.5 text-slate-600 hover:text-royal-950 font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Heritage Catalog</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-cream-100 font-semibold text-slate-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={handleBookmark}
              disabled={loadingBookmark}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold transition-all shadow-sm ${
                bookmarked
                  ? 'bg-saffron-600 text-white hover:bg-saffron-700'
                  : 'bg-cream-100 hover:bg-cream-200 text-royal-950 border border-cream-300'
              }`}
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 fill-white" />
                  <span>Bookmarked</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save Bookmark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Gallery & Header Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Image Viewer */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative h-[360px] sm:h-[480px] rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-cream-200">
              <img
                src={
                  heritage.images?.[selectedImage] ||
                  'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'
                }
                alt={heritage.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-royal-950/85 text-gold-400 backdrop-blur-md border border-gold-400/30">
                  {heritage.category}
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {heritage.images && heritage.images.length > 1 && (
              <div className="flex items-center gap-3">
                {heritage.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`h-20 w-28 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-saffron-600 scale-105 shadow-md' : 'border-cream-300 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info Sidebar */}
          <div className="lg:col-span-5 bg-white p-7 sm:p-9 rounded-3xl border border-cream-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-600">
                Official Heritage Record
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-royal-950 mt-1">
                {heritage.name}
              </h1>
            </div>

            <div className="space-y-3 pt-2 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-cream-50 border border-cream-200">
                <MapPin className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase">Location & Jurisdiction</span>
                  <span className="font-bold text-royal-950">{heritage.location}, {heritage.state}, India</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-cream-50 border border-cream-200">
                <Calendar className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase">Historical Time Period</span>
                  <span className="font-bold text-royal-950">{heritage.historicalPeriod}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-cream-50 border border-cream-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase">Preservation Status</span>
                  <span className="font-bold text-emerald-800">Protected by Archaeological Survey of India (ASI)</span>
                </div>
              </div>
            </div>

            {/* Source References Box */}
            <div className="pt-4 border-t border-cream-200 space-y-3">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Authentic Source References
              </span>
              <div className="space-y-2">
                {heritage.sourceReferences?.map((ref, i) => (
                  <a
                    key={i}
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-gold-500 hover:bg-cream-50 text-xs transition-colors group"
                  >
                    <div>
                      <p className="font-bold text-royal-950 group-hover:text-saffron-600">{ref.title}</p>
                      <p className="text-[11px] text-slate-500">{ref.organization}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-saffron-600" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description & Historical Background */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Historical Background */}
            <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-royal-950 flex items-center gap-2">
                <Info className="w-6 h-6 text-saffron-600" />
                <span>Historical Background & Overview</span>
              </h2>
              <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
                {heritage.description}
              </p>
            </div>

            {/* Cultural Significance */}
            <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-royal-950 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-gold-600" />
                <span>Cultural & Philosophical Significance</span>
              </h2>
              <p className="text-slate-700 leading-relaxed text-base">
                {heritage.culturalSignificance}
              </p>
            </div>

            {/* Architectural & Structural Details */}
            {heritage.architecturalDetails && (
              <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-sm space-y-4">
                <h2 className="font-serif text-2xl font-bold text-royal-950 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-royal-800" />
                  <span>Architectural Details & Craftsmanship</span>
                </h2>
                <p className="text-slate-700 leading-relaxed text-base">
                  {heritage.architecturalDetails}
                </p>
              </div>
            )}
          </div>

          {/* Important Facts Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-royal-950 to-royal-900 text-white p-8 rounded-3xl shadow-lg border border-gold-600/30 space-y-6">
              <h3 className="font-serif text-xl font-bold text-gold-amber flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-saffron-500" />
                <span>Essential Archaeological Facts</span>
              </h3>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-200">
                {heritage.importantFacts?.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-saffron-600/30 text-saffron-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Take Quiz Callout */}
            <div className="bg-saffron-50 border border-saffron-200 p-6 rounded-3xl space-y-3">
              <h4 className="font-serif text-lg font-bold text-royal-950">Test Your Heritage Knowledge</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take an interactive assessment covering this monument and related historical dynasties.
              </p>
              <Link
                to="/quizzes"
                className="inline-block w-full text-center py-2.5 px-4 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow"
              >
                Start Heritage Quiz →
              </Link>
            </div>
          </div>
        </div>

        {/* Related Heritage Content */}
        {related.length > 0 && (
          <div className="pt-8 border-t border-cream-200 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-royal-950">
              Related Heritage in {heritage.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(item => (
                <HeritageCard key={item._id} heritage={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeritageDetailsPage;
