import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CommentItem, CommentCategory, CommentChannel } from '../types';
import {
  MessageSquare,
  Send,
  Star,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Shield,
  ShieldCheck,
  ThumbsUp,
  Search,
  Filter,
  Lock,
  Unlock,
  Radio,
  Clock,
  Pin,
  Trash2,
} from 'lucide-react';

const STORAGE_KEY = 'learno_community_comments';
const ADMIN_MODE_KEY = 'learno_admin_mode_active';

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'admin_broadcast_01',
    channel: 'admin',
    authorName: 'Shivansh Giri',
    authorEmail: 'shivanshgiri.official@gmail.com',
    authorAvatar: '👨‍💻',
    authorClass: 'Admin Rig',
    isAdmin: true,
    category: 'suggestion',
    title: '📢 Official Welcome to Learno Community & Comments Hub',
    content:
      'Welcome everyone! This is the official Learno Community space. You can post your experiences, revision milestones, study routines, and report any problems or bugs on the platform. All student reports are reviewed and verified here. Keep practicing and aim for the 200 Tests trophy!',
    timestamp: 'Just now',
    likes: 24,
    isAccepted: true,
    acceptedAt: 'Verified by Admin',
    adminNote: 'Founder & Platform Director',
  },
  {
    id: 'user_comment_01',
    channel: 'user',
    authorName: 'Aarav Sharma',
    authorEmail: 'aarav.sharma@gmail.com',
    authorAvatar: '🚀',
    authorClass: 'Class 8',
    isAdmin: false,
    category: 'experience',
    title: '20 unique questions per test are phenomenal!',
    content:
      'I just practiced Mathematics Chapter 1 and Science Chapter 2. Every single question in the 20-problem set was completely distinct and realistic with step-by-step solutions. This helped me clear my doubt in Linear Equations!',
    rating: 5,
    timestamp: '2 hours ago',
    likes: 18,
    isAccepted: true,
    acceptedAt: 'Verified by Admin',
    adminNote: 'Thank you Aarav! The new question engine ensures zero repetition.',
  },
  {
    id: 'user_comment_02',
    channel: 'user',
    authorName: 'Priya Patel',
    authorEmail: 'priya.patel@gmail.com',
    authorAvatar: '👩‍🎓',
    authorClass: 'Class 7',
    isAdmin: false,
    category: 'problem',
    title: 'Report: Suggestion for Hindi Voice Input on mobile',
    content:
      'I was trying to use the AI Tutor microphone in Hindi mode while studying Sanskrit and Hindi grammar. Please ensure the voice recognition picks up Hindi accents smoothly!',
    timestamp: '5 hours ago',
    likes: 9,
    isAccepted: true,
    acceptedAt: 'Verified by Admin',
    adminNote: 'Resolved in today’s update! Hindi speech recognition (hi-IN) and Jarvis mode are now active.',
  },
  {
    id: 'user_comment_03',
    channel: 'user',
    authorName: 'Kavya Verma',
    authorEmail: 'kavya.v@gmail.com',
    authorAvatar: '📚',
    authorClass: 'Class 9',
    isAdmin: false,
    category: 'experience',
    title: 'Love the Light and Dark Mode option in Settings',
    content:
      'The Obsidian Cyber dark mode is great for nighttime revision, and the clean Light Studio mode is super clear for bright classrooms during daytime study. Great work team!',
    rating: 5,
    timestamp: '1 day ago',
    likes: 14,
    isAccepted: false,
  },
];

export const CommentsPage: React.FC = () => {
  const { user } = useAuth();

  // Mode: 'user' (Community Board where all users can post) or 'admin' (Official Admin Broadcasts)
  const [activeChannel, setActiveChannel] = useState<CommentChannel>('user');

  // Filter Category: 'all' | 'accepted' | 'experience' | 'problem' | 'question'
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Mode detection: Auto-detect if user is Shivansh Giri or admin email, or manual toggle
  const isDefaultAdminUser =
    user.email === 'shivanshgiri.official@gmail.com' ||
    user.name.toLowerCase().includes('shivansh') ||
    (user as any).role === 'admin';

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(ADMIN_MODE_KEY);
    if (saved !== null) return saved === 'true';
    return isDefaultAdminUser;
  });

  // Comments state
  const [comments, setComments] = useState<CommentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_COMMENTS;
  });

  // New Comment Form State (User Mode)
  const [newCategory, setNewCategory] = useState<CommentCategory>('experience');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newRating, setNewRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Admin Response modal / inline state
  const [adminNotePromptId, setAdminNotePromptId] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Save comments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch {
      // ignore
    }
  }, [comments]);

  // Persist admin mode toggle
  const toggleAdminMode = () => {
    const next = !isAdminMode;
    setIsAdminMode(next);
    localStorage.setItem(ADMIN_MODE_KEY, String(next));
  };

  // Submit new user message
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);

    const newComment: CommentItem = {
      id: `comment_${Date.now()}`,
      channel: 'user',
      authorName: user.name || 'Learno Student',
      authorEmail: user.email || 'student@learno.edu',
      authorAvatar: user.avatar || '👨‍🎓',
      authorClass: user.class || 'Class 8',
      isAdmin: false,
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      rating: newCategory === 'experience' ? newRating : undefined,
      timestamp: 'Just now',
      likes: 1,
      isAccepted: false,
    };

    setComments((prev) => [newComment, ...prev]);
    setNewTitle('');
    setNewContent('');
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  // Submit new Admin Broadcast (Admin Mode only)
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminMode || !newTitle.trim() || !newContent.trim()) return;

    const adminBroadcast: CommentItem = {
      id: `admin_broadcast_${Date.now()}`,
      channel: 'admin',
      authorName: user.name || 'Shivansh Giri (Admin)',
      authorEmail: user.email || 'shivanshgiri.official@gmail.com',
      authorAvatar: '👨‍💻',
      authorClass: 'Founder & Admin',
      isAdmin: true,
      category: 'suggestion',
      title: `📢 ${newTitle.trim()}`,
      content: newContent.trim(),
      timestamp: 'Just now',
      likes: 1,
      isAccepted: true,
      acceptedAt: 'Official Admin Broadcast',
      adminNote: 'Published by Learno Administration',
    };

    setComments((prev) => [adminBroadcast, ...prev]);
    setNewTitle('');
    setNewContent('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  // Toggle Accept / Verified status on a comment (Admin only)
  const handleToggleAccept = (id: string) => {
    if (!isAdminMode) {
      alert('Permission Denied: Only Admin (Shivansh Giri) can accept your message.');
      return;
    }

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextAccepted = !c.isAccepted;
          return {
            ...c,
            isAccepted: nextAccepted,
            acceptedAt: nextAccepted ? new Date().toLocaleDateString() : undefined,
            adminNote: nextAccepted ? c.adminNote || 'Verified and approved by Admin.' : undefined,
          };
        }
        return c;
      })
    );
  };

  // Add or edit Admin Note on an accepted message
  const handleSaveAdminNote = (id: string) => {
    if (!isAdminMode) return;
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            adminNote: adminNoteInput.trim() || c.adminNote,
          };
        }
        return c;
      })
    );
    setAdminNotePromptId(null);
    setAdminNoteInput('');
  };

  // Like / Upvote comment
  const handleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const liked = c.likedByMe;
          return {
            ...c,
            likes: liked ? c.likes - 1 : c.likes + 1,
            likedByMe: !liked,
          };
        }
        return c;
      })
    );
  };

  // Delete comment (Admin only)
  const handleDelete = (id: string) => {
    if (!isAdminMode) return;
    if (confirm('Are you sure you want to remove this message?')) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Filtered comments based on channel and user filters
  const filteredComments = comments.filter((c) => {
    // Channel check: 'user' or 'admin'
    if (c.channel !== activeChannel) return false;

    // Category / Accepted filter
    if (selectedFilter === 'accepted' && !c.isAccepted) return false;
    if (selectedFilter === 'experience' && c.category !== 'experience') return false;
    if (selectedFilter === 'problem' && c.category !== 'problem') return false;
    if (selectedFilter === 'question' && c.category !== 'question') return false;

    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchContent = c.content.toLowerCase().includes(q);
      const matchAuthor = c.authorName.toLowerCase().includes(q);
      return matchTitle || matchContent || matchAuthor;
    }

    return true;
  });

  const acceptedCount = comments.filter((c) => c.channel === 'user' && c.isAccepted).length;
  const userCommentsCount = comments.filter((c) => c.channel === 'user').length;
  const adminBroadcastsCount = comments.filter((c) => c.channel === 'admin').length;

  return (
    <div className="space-y-6 py-4 max-w-6xl mx-auto font-sans">
      {/* Top Header Card */}
      <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF66] font-bold">
              COMMUNITY TELEMETRY & FEEDBACK
            </span>
            <span className="font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 text-[10px] font-bold">
              {activeChannel === 'user' ? `${userCommentsCount} User Messages` : `${adminBroadcastsCount} Broadcasts`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wide">
            Student Comments & Experience Hub
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
            Share your exam preparation stories, rate your experience, and report bugs or website issues.
            Every message is publicly visible to all students, and verified by the Administration.
          </p>
        </div>

        {/* Admin Access Toggle Pill */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 font-mono text-xs w-full md:w-auto">
          <div
            className={`px-3.5 py-2 rounded-xl border flex items-center justify-between gap-2.5 transition-all ${
              isAdminMode
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-white/5 border-white/10 text-neutral-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {isAdminMode ? (
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              ) : (
                <Shield className="w-4 h-4 text-neutral-500 flex-shrink-0" />
              )}
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {isAdminMode ? 'ADMIN ACTIVE (SHIVANSH)' : 'STUDENT VIEW'}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleAdminMode}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                isAdminMode
                  ? 'bg-amber-400 text-black hover:bg-amber-300 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title="Toggle between Administrator rights and Student view"
            >
              {isAdminMode ? '[ SWITCH TO STUDENT ]' : '[ ACTIVATE ADMIN ]'}
            </button>
          </div>
        </div>
      </div>

      {/* Channel Switcher Strip: USER MESSAGES vs ADMIN MESSAGES */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 bg-[#0A0D14]/90 border border-white/10 rounded-2xl shadow-sm font-mono text-xs">
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveChannel('user')}
            className={`px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeChannel === 'user'
                ? 'bg-[#00FF66] text-black shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>USER MESSAGES</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                activeChannel === 'user' ? 'bg-black text-[#00FF66]' : 'bg-white/10 text-neutral-300'
              }`}
            >
              {userCommentsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveChannel('admin')}
            className={`px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeChannel === 'admin'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ADMIN MESSAGES</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                activeChannel === 'admin' ? 'bg-black text-amber-400' : 'bg-white/10 text-neutral-300'
              }`}
            >
              {adminBroadcastsCount}
            </span>
          </button>
        </div>

        <div className="text-[11px] text-neutral-400 px-3 hidden md:block">
          {activeChannel === 'user'
            ? '👥 All registered students can post experiences and report bugs'
            : '🛡️ Official verified broadcasts posted strictly by Administration'}
        </div>
      </div>

      {/* CHANNEL 1: USER MESSAGES COMPOSING FORM */}
      {activeChannel === 'user' && (
        <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-6 shadow-card">
          <div className="mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF66] font-bold">
                POST YOUR TELEMETRY
              </span>
              <h3 className="text-base font-display font-bold text-white mt-0.5">
                Send Your Experience or Problem Report
              </h3>
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              Posting as: <strong className="text-white">{user.name}</strong> ({user.class})
            </div>
          </div>

          {submitSuccess && (
            <div className="mb-4 p-3 bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] text-xs font-mono font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>YOUR MESSAGE HAS BEEN PUBLISHED SUCCESSFULLY TO THE COMMUNITY FEED!</span>
            </div>
          )}

          <form onSubmit={handleUserSubmit} className="space-y-4 font-mono text-xs">
            {/* Category selection */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Message Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setNewCategory('experience')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    newCategory === 'experience'
                      ? 'bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66]'
                      : 'border-white/10 bg-[#050505] text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✨ EXPERIENCE / REVIEW</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewCategory('problem')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    newCategory === 'problem'
                      ? 'bg-rose-500/15 border-rose-500 text-rose-400'
                      : 'border-white/10 bg-[#050505] text-neutral-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>⚠️ PROBLEM / BUG REPORT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewCategory('question')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    newCategory === 'question'
                      ? 'bg-blue-500/15 border-blue-500 text-blue-400'
                      : 'border-white/10 bg-[#050505] text-neutral-400 hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>❓ QUESTION / HELP</span>
                </button>
              </div>
            </div>

            {/* Star rating for Experience */}
            {newCategory === 'experience' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Overall Platform Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-lg transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-neutral-400 text-xs pl-2 font-bold">{newRating} / 5 Stars</span>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Headline / Subject
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Loved the new Science questions! or Found an issue on mobile screen..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white focus:border-[#00FF66] outline-none transition-all"
              />
            </div>

            {/* Message Content */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Detailed Feedback / Problem Description
              </label>
              <textarea
                required
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Describe your learning experience, test feedback, or the exact steps to reproduce any issue you encountered..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white focus:border-[#00FF66] outline-none transition-all resize-y"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-neutral-500">
                Notice: All submitted messages are visible to the community.
              </span>
              <button
                type="submit"
                disabled={isSubmitting || !newTitle.trim() || !newContent.trim()}
                className="px-6 py-2.5 bg-[#00FF66] hover:bg-[#00FF66]/90 disabled:opacity-40 text-black rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>PUBLISH MESSAGE</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CHANNEL 2: ADMIN MESSAGES COMPOSING FORM (ADMIN ONLY) */}
      {activeChannel === 'admin' && (
        <div className="bg-[#0A0D14]/90 border border-amber-500/30 rounded-2xl p-6 shadow-card">
          <div className="mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 font-bold">
                  ADMIN CONTROL CHANNEL
                </span>
                <h3 className="text-base font-display font-bold text-white mt-0.5">
                  Publish Official Admin Announcement
                </h3>
              </div>
            </div>

            <span className="font-mono text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
              {isAdminMode ? 'AUTHORIZATION GRANTED' : 'RESTRICTED TO ADMIN'}
            </span>
          </div>

          {isAdminMode ? (
            <form onSubmit={handleAdminSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Scheduled Maintenance / New Term 2 Question Bank Added..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white focus:border-amber-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Official Message Content
                </label>
                <textarea
                  required
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter the official administrative notice for all Learno users..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white focus:border-amber-400 outline-none transition-all resize-y"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-amber-400/80 font-bold">
                  * Only you (Admin) can send messages in this mode.
                </span>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || !newContent.trim()}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>BROADCAST AS ADMIN</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20 text-neutral-300 font-mono text-xs flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-400 uppercase tracking-wide block">
                  RESTRICTED ADMIN BROADCAST CHANNEL
                </span>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  In this mode, only the website administrator (Shivansh Giri) has access to post official notices and updates.
                  All students can read the verified administrative broadcasts below.
                  To post your own thoughts or questions, switch to <strong>User Messages</strong> mode.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FILTER & SEARCH STRIP */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
              selectedFilter === 'all'
                ? 'bg-white/15 border-white text-white font-bold'
                : 'border-white/10 bg-[#0A0D14] text-neutral-400 hover:text-white'
            }`}
          >
            All Messages ({comments.filter((c) => c.channel === activeChannel).length})
          </button>

          {activeChannel === 'user' && (
            <>
              <button
                type="button"
                onClick={() => setSelectedFilter('accepted')}
                className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedFilter === 'accepted'
                    ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] font-bold'
                    : 'border-white/10 bg-[#0A0D14] text-neutral-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-[#00FF66]" />
                <span>✓ Accepted Only ({acceptedCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFilter('experience')}
                className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
                  selectedFilter === 'experience'
                    ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] font-bold'
                    : 'border-white/10 bg-[#0A0D14] text-neutral-400 hover:text-white'
                }`}
              >
                ✨ Experiences
              </button>

              <button
                type="button"
                onClick={() => setSelectedFilter('problem')}
                className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
                  selectedFilter === 'problem'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                    : 'border-white/10 bg-[#0A0D14] text-neutral-400 hover:text-white'
                }`}
              >
                ⚠️ Problems & Bugs
              </button>
            </>
          )}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search comments..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0A0D14] text-white placeholder-neutral-500 focus:border-[#00FF66] outline-none transition-all"
          />
        </div>
      </div>

      {/* COMMENTS LIST / CARDS FEED */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-12 text-center font-mono">
            <MessageSquare className="w-8 h-8 text-neutral-500 mx-auto mb-2 opacity-60" />
            <h4 className="text-base font-bold text-white">No Messages Found</h4>
            <p className="text-xs text-neutral-400 mt-1">
              {searchQuery ? 'No results matched your search term.' : 'Be the first student to post your experience!'}
            </p>
          </div>
        ) : (
          filteredComments.map((item) => (
            <div
              key={item.id}
              className={`bg-[#0A0D14]/90 border rounded-2xl p-5 sm:p-6 shadow-card transition-all ${
                item.channel === 'admin'
                  ? 'border-amber-500/40 bg-gradient-to-r from-amber-500/[0.03] to-transparent'
                  : item.isAccepted
                  ? 'border-[#00FF66]/40 shadow-[0_0_20px_rgba(0,255,102,0.08)]'
                  : 'border-white/10'
              }`}
            >
              {/* Card Header: Author info, badge, accept status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#050505] border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                    {item.authorAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white leading-tight">{item.authorName}</h4>
                      {item.isAdmin && (
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                          ADMIN
                        </span>
                      )}
                      {item.authorClass && (
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10 uppercase">
                          {item.authorClass}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Badges: Category & Acceptance Status */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                  {/* Category Pill */}
                  <span
                    className={`px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border ${
                      item.category === 'experience'
                        ? 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/30'
                        : item.category === 'problem'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {item.category === 'experience'
                      ? '✨ EXPERIENCE'
                      : item.category === 'problem'
                      ? '⚠️ PROBLEM REPORT'
                      : '❓ QUESTION'}
                  </span>

                  {/* Star Rating Display */}
                  {item.rating && (
                    <div className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{item.rating}.0</span>
                    </div>
                  )}

                  {/* Accepted Badge */}
                  {item.isAccepted && (
                    <span className="px-2.5 py-1 rounded-md bg-[#00FF66]/15 border border-[#00FF66]/50 text-[#00FF66] font-bold shadow-[0_0_10px_rgba(0,255,102,0.2)] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>✓ ACCEPTED BY ADMIN</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div className="py-3.5 space-y-1.5">
                <h3 className="text-sm sm:text-base font-display font-bold text-white tracking-wide">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>

              {/* Official Admin Note / Verification Note */}
              {item.adminNote && (
                <div className="my-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 font-mono text-xs text-amber-300 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-amber-400">
                      ADMIN VERIFICATION NOTE:
                    </span>
                    <p className="text-neutral-300 text-xs">{item.adminNote}</p>
                  </div>
                </div>
              )}

              {/* Card Footer: ACCEPT Option (with required text) + Upvote & Admin Controls */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                {/* Accept Box with Required Label */}
                <div className="flex items-center gap-2">
                  {item.channel === 'user' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleAccept(item.id)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                          item.isAccepted
                            ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] hover:bg-rose-500/20 hover:border-rose-500 hover:text-rose-400'
                            : isAdminMode
                            ? 'bg-white/10 hover:bg-[#00FF66] hover:text-black border-white/20 text-neutral-300'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/20'
                        }`}
                        title={
                          isAdminMode
                            ? item.isAccepted
                              ? 'Click to revoke accepted status'
                              : 'Click to Accept this message as Admin'
                            : 'Only Admin can accept your message'
                        }
                      >
                        {item.isAccepted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF66]" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-neutral-400" />
                        )}
                        <span>{item.isAccepted ? 'ACCEPTED' : 'ACCEPT'}</span>
                      </button>

                      {/* Required Text: "Only admin can accept your message" */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                        <span className="text-neutral-400">
                          Only admin can accept your message
                        </span>
                        {item.isAccepted && (
                          <span className="text-[#00FF66] font-bold">
                            • Verified
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Add Admin Note Button for Admin */}
                  {isAdminMode && item.channel === 'user' && item.isAccepted && (
                    <button
                      type="button"
                      onClick={() => {
                        setAdminNotePromptId(item.id);
                        setAdminNoteInput(item.adminNote || '');
                      }}
                      className="text-[10px] text-amber-400 hover:underline ml-2"
                    >
                      [ Edit Admin Note ]
                    </button>
                  )}
                </div>

                {/* Right side: Likes & Delete */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold ${
                      item.likedByMe
                        ? 'bg-[#00FF66]/15 border-[#00FF66]/50 text-[#00FF66]'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{item.likes}</span>
                  </button>

                  {isAdminMode && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete message as Admin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Admin Note Prompt if opened */}
              {adminNotePromptId === item.id && (
                <div className="mt-3 p-3 bg-black/60 rounded-xl border border-amber-500/40 space-y-2 font-mono text-xs">
                  <label className="block text-[10px] font-bold text-amber-400 uppercase">
                    Add Official Admin Verification Note:
                  </label>
                  <input
                    type="text"
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="e.g., Thank you! This has been resolved in the latest update."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-white/10 bg-[#050505] text-white outline-none focus:border-amber-400"
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setAdminNotePromptId(null)}
                      className="px-3 py-1 rounded bg-white/10 text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveAdminNote(item.id)}
                      className="px-3 py-1 rounded bg-amber-400 text-black font-bold hover:bg-amber-300"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
