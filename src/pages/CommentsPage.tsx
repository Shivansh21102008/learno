import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CommentItem, CommentCategory, CommentChannel } from '../types';
import {
  verifyAdminPassword,
  changeAdminPassword,
  hasCustomAdminPassword,
  DEFAULT_INITIAL_ADMIN_PASSWORD,
} from '../utils/adminSecurity';
import {
  MessageSquare,
  Send,
  Star,
  CheckCircle2,
  Shield,
  ShieldCheck,
  ThumbsUp,
  Search,
  Lock,
  Unlock,
  Clock,
  Calendar,
  Trash2,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  KeyRound,
  Eye,
  EyeOff,
  Key,
  X,
  Cpu,
  Layers,
} from 'lucide-react';

const STORAGE_KEY = 'learno_community_comments';
const ADMIN_SESSION_KEY = 'learno_admin_unlocked_session';

// Helper to format date and time in Indian Standard Format
const getCurrentDate = (): string => {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }); // e.g. "02 Oct 2026"
};

const getCurrentTime = (): string => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }); // e.g. "09:05 PM"
};

export const CommentsPage: React.FC = () => {
  const { user } = useAuth();

  // Mode: 'user' (Community Board) or 'admin' (Admin Announcements)
  const [activeChannel, setActiveChannel] = useState<CommentChannel>('user');

  // Filter Category: 'all' | 'accepted' | 'experience' | 'problem'
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 100-Layer Cryptographic Admin State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });

  // Password Unlock Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Change Password Modal State
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [currentPwdInput, setCurrentPwdInput] = useState('');
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [changePwdError, setChangePwdError] = useState<string | null>(null);
  const [changePwdSuccess, setChangePwdSuccess] = useState<string | null>(null);
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [changePwdProgress, setChangePwdProgress] = useState(0);

  // Load genuine messages only (clean out any old demo/mock comments)
  const [comments, setComments] = useState<CommentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out previous fake mock messages
          return parsed.filter(
            (c: any) =>
              c &&
              c.id &&
              !c.id.startsWith('admin_broadcast_01') &&
              !c.id.startsWith('user_comment_01') &&
              !c.id.startsWith('user_comment_02') &&
              !c.id.startsWith('user_comment_03')
          );
        }
      }
    } catch {
      // ignore parse error
    }
    return [];
  });

  // User message form state
  const [newCategory, setNewCategory] = useState<CommentCategory>('experience');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newRating, setNewRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Admin announcement form state (Admin only)
  const [adminTitle, setAdminTitle] = useState('');
  const [adminContent, setAdminContent] = useState('');
  const [adminNotePromptId, setAdminNotePromptId] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Persist genuine comments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch {
      // ignore storage errors
    }
  }, [comments]);

  // Handle switching to Admin channel (Requires Password Unlock)
  const handleSelectAdminChannel = () => {
    if (isAdminUnlocked) {
      setActiveChannel('admin');
      setSelectedFilter('all');
    } else {
      setIsPasswordModalOpen(true);
      setPasswordError(null);
      setPasswordInput('');
    }
  };

  // Lock Admin session
  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setActiveChannel('user');
  };

  // Authenticate Admin with 100-layer verification
  const handleUnlockAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setPasswordError('Please enter the administrator password.');
      return;
    }

    setIsVerifyingPassword(true);
    setPasswordError(null);
    setVerificationProgress(0);

    try {
      const isValid = await verifyAdminPassword(passwordInput, (layer) => {
        setVerificationProgress(layer);
      });

      if (isValid) {
        setIsAdminUnlocked(true);
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
        setIsPasswordModalOpen(false);
        setPasswordInput('');
        setActiveChannel('admin');
        setSelectedFilter('all');
      } else {
        setPasswordError('Access Denied: Incorrect password. 100-layer cryptographic check failed.');
      }
    } catch (err) {
      setPasswordError('Verification failed due to cryptographic error. Please retry.');
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  // Change Admin Password (requires current password first)
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPwdInput) {
      setChangePwdError('Current admin password is required.');
      return;
    }
    if (newPwdInput.length < 6) {
      setChangePwdError('New password must be at least 6 characters long.');
      return;
    }
    if (newPwdInput !== confirmPwdInput) {
      setChangePwdError('New passwords do not match.');
      return;
    }

    setIsChangingPwd(true);
    setChangePwdError(null);
    setChangePwdSuccess(null);
    setChangePwdProgress(0);

    try {
      const res = await changeAdminPassword(currentPwdInput, newPwdInput, (layer) => {
        setChangePwdProgress(layer);
      });

      if (res.success) {
        setChangePwdSuccess(res.message);
        setTimeout(() => {
          setIsChangePasswordModalOpen(false);
          setCurrentPwdInput('');
          setNewPwdInput('');
          setConfirmPwdInput('');
          setChangePwdSuccess(null);
        }, 1600);
      } else {
        setChangePwdError(res.message);
      }
    } catch {
      setChangePwdError('Failed to process 100-layer password update.');
    } finally {
      setIsChangingPwd(false);
    }
  };

  // Submit new user comment
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    const dateStr = getCurrentDate();
    const timeStr = getCurrentTime();

    const newComment: CommentItem = {
      id: `comment_${Date.now()}`,
      channel: 'user',
      authorName: user.name || 'Learno Student',
      authorEmail: user.email || 'student@learno.edu',
      authorAvatar: user.avatar || '👨‍🎓',
      authorClass: user.class || 'Class 8',
      isAdmin: isAdminUnlocked,
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      rating: newCategory === 'experience' ? newRating : undefined,
      date: dateStr,
      time: timeStr,
      timestamp: `${dateStr} at ${timeStr}`,
      likes: 0,
      isAccepted: false,
    };

    setComments((prev) => [newComment, ...prev]);
    setNewTitle('');
    setNewContent('');
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  // Submit new Admin Announcement (Strictly Administrator only)
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminUnlocked) {
      alert('Access Denied: Only authenticated Administrator can publish announcements.');
      setIsPasswordModalOpen(true);
      return;
    }
    if (!adminTitle.trim() || !adminContent.trim()) return;

    const dateStr = getCurrentDate();
    const timeStr = getCurrentTime();

    const adminAnnouncement: CommentItem = {
      id: `admin_announcement_${Date.now()}`,
      channel: 'admin',
      authorName: 'Shivansh Giri',
      authorEmail: 'shivanshgiri.official@gmail.com',
      authorAvatar: '👨‍💻',
      authorClass: 'Platform Administrator',
      isAdmin: true,
      category: 'suggestion',
      title: adminTitle.trim(),
      content: adminContent.trim(),
      date: dateStr,
      time: timeStr,
      timestamp: `${dateStr} at ${timeStr}`,
      likes: 0,
      isAccepted: true,
      acceptedAt: `Verified on ${dateStr}`,
      adminNote: 'Official Learno Platform Announcement',
    };

    setComments((prev) => [adminAnnouncement, ...prev]);
    setAdminTitle('');
    setAdminContent('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  // Toggle Accept status on comment (Only Admin with password can perform this)
  const handleToggleAccept = (id: string) => {
    if (!isAdminUnlocked) {
      setIsPasswordModalOpen(true);
      setPasswordError('Admin Password Required: Only the administrator can accept student messages.');
      return;
    }

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextAccepted = !c.isAccepted;
          const dateStr = getCurrentDate();
          return {
            ...c,
            isAccepted: nextAccepted,
            acceptedAt: nextAccepted ? `Verified by Admin on ${dateStr}` : undefined,
            adminNote: nextAccepted ? c.adminNote || 'Verified and approved by Administrator.' : undefined,
          };
        }
        return c;
      })
    );
  };

  // Save Admin Note
  const handleSaveAdminNote = (id: string) => {
    if (!isAdminUnlocked) return;
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

  // Like comment
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
    if (!isAdminUnlocked) return;
    if (window.confirm('Delete this message permanently?')) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Filter comments for current channel
  const channelComments = comments.filter((c) => c.channel === activeChannel);

  const filteredComments = channelComments.filter((item) => {
    // Search query filter
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Category filter
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'accepted') return item.isAccepted;
    return item.category === selectedFilter;
  });

  const userCount = comments.filter((c) => c.channel === 'user').length;
  const adminCount = comments.filter((c) => c.channel === 'admin').length;

  return (
    <div className="space-y-6 py-4 max-w-5xl mx-auto font-sans">
      {/* UNIFIED CLEAN HEADER WITH 100-LAYER SECURITY STATUS */}
      <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-6 sm:p-7 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF66] font-bold">
                COMMUNITY HUB
              </span>
              {isAdminUnlocked ? (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  100-Layer Admin Active (Shivansh Giri)
                </span>
              ) : (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-neutral-400" />
                  Admin Protected (100-Layer Shield)
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wide">
              Learno Messages & Announcements
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              Share real experiences, report problems, and read official updates from the administrator.
            </p>
          </div>

          {/* TWO MAIN MODES: USER MESSAGES vs ADMIN ANNOUNCEMENTS + ADMIN CONTROLS */}
          <div className="flex flex-wrap items-center gap-2 bg-[#050505] p-1.5 rounded-xl border border-white/10 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveChannel('user');
                setSelectedFilter('all');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                activeChannel === 'user'
                  ? 'bg-[#00FF66] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>User Messages</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  activeChannel === 'user' ? 'bg-black text-[#00FF66]' : 'bg-white/10 text-neutral-400'
                }`}
              >
                {userCount}
              </span>
            </button>

            <button
              type="button"
              onClick={handleSelectAdminChannel}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                activeChannel === 'admin'
                  ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isAdminUnlocked ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>Admin Messages</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  activeChannel === 'admin' ? 'bg-black text-amber-400' : 'bg-white/10 text-neutral-400'
                }`}
              >
                {adminCount}
              </span>
            </button>

            {/* If Admin is unlocked: Provide Change Password and Lock buttons */}
            {isAdminUnlocked && (
              <div className="flex items-center gap-1.5 pl-1 border-l border-white/10">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-amber-300 border border-white/10 transition-colors"
                  title="Change Admin Password (100-Layer Cryptographic Shield)"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleLockAdmin}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold transition-colors flex items-center gap-1"
                  title="Lock Admin Mode"
                >
                  <Lock className="w-3 h-3" />
                  <span>LOCK</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODE 1: USER MESSAGES COMPOSING FORM (Open to all students & users) */}
      {activeChannel === 'user' && (
        <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-card">
          <div className="mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF66] font-bold">
                POST USER MESSAGE
              </span>
              <h2 className="text-base font-display font-bold text-white mt-0.5">
                Share Your Experience or Problem
              </h2>
            </div>
            {submitSuccess && (
              <span className="font-mono text-xs text-[#00FF66] flex items-center gap-1 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Message published!
              </span>
            )}
          </div>

          <form onSubmit={handleUserSubmit} className="space-y-4">
            {/* Category selection */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Select Message Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setNewCategory('experience')}
                  className={`px-3 py-2 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    newCategory === 'experience'
                      ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] font-bold'
                      : 'border-white/10 bg-[#050505] text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Experience</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewCategory('problem')}
                  className={`px-3 py-2 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    newCategory === 'problem'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold'
                      : 'border-white/10 bg-[#050505] text-neutral-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Problem / Bug</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewCategory('question')}
                  className={`px-3 py-2 rounded-xl border flex items-center justify-center gap-2 transition-all col-span-2 sm:col-span-1 ${
                    newCategory === 'question'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold'
                      : 'border-white/10 bg-[#050505] text-neutral-400 hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Question</span>
                </button>
              </div>
            </div>

            {/* Star rating for Experience */}
            {newCategory === 'experience' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Rate Your Experience
                </label>
                <div className="flex items-center gap-1">
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
                  <span className="text-neutral-400 text-xs pl-2 font-bold font-mono">
                    {newRating} / 5 Stars
                  </span>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Headline / Topic
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Mathematics chapter tests are very helpful! or Mic voice input doubt..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white focus:border-[#00FF66] outline-none transition-all"
              />
            </div>

            {/* Message Content */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Message Description
              </label>
              <textarea
                required
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your study experience, test feedback, or the problem you faced in detail..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white focus:border-[#00FF66] outline-none transition-all resize-y"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-neutral-500 font-mono">
                Posting as {user.name} ({user.class})
              </span>
              <button
                type="submit"
                disabled={isSubmitting || !newTitle.trim() || !newContent.trim()}
                className="px-5 py-2.5 bg-[#00FF66] hover:bg-[#00FF66]/90 disabled:opacity-40 text-black rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] flex items-center gap-2 font-mono"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SEND MESSAGE</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODE 2: ADMIN ANNOUNCEMENTS CHANNEL (Strictly Authenticated Administrator) */}
      {activeChannel === 'admin' && (
        <>
          {isAdminUnlocked ? (
            <div className="bg-[#0A0D14]/90 border border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-card">
              <div className="mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 font-bold">
                      ADMINISTRATOR CHANNEL (100-LAYER VERIFIED)
                    </span>
                    <h2 className="text-base font-display font-bold text-white mt-0.5">
                      Publish Official Announcement
                    </h2>
                  </div>
                </div>
                {submitSuccess && (
                  <span className="font-mono text-xs text-amber-400 flex items-center gap-1 font-bold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" /> Announcement broadcasted!
                  </span>
                )}
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Announcement Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={adminTitle}
                    onChange={(e) => setAdminTitle(e.target.value)}
                    placeholder="e.g., Update: New Science Chapter Tests & Exam Schedules..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white focus:border-amber-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Announcement Content
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={adminContent}
                    onChange={(e) => setAdminContent(e.target.value)}
                    placeholder="Enter the official broadcast message for all students..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#050505] text-white focus:border-amber-400 outline-none transition-all resize-y"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-amber-400/80 font-mono">
                    Broadcasting as Platform Administrator (Shivansh Giri)
                  </span>
                  <button
                    type="submit"
                    disabled={!adminTitle.trim() || !adminContent.trim()}
                    className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-2 font-mono"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>BROADCAST ANNOUNCEMENT</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Non-authenticated students: Read-only notice */
            <div className="bg-[#0A0D14]/90 border border-amber-500/20 rounded-2xl p-5 shadow-card flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Official Admin Announcements Channel (Protected)
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Only the Administrator (<span className="text-amber-400 font-bold">Shivansh Giri</span>) can publish announcements in this category using the 100-layer admin key. Students can share their experiences and report problems in the{' '}
                  <button
                    type="button"
                    onClick={() => setActiveChannel('user')}
                    className="text-[#00FF66] underline font-bold"
                  >
                    User Messages
                  </button>{' '}
                  mode.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="px-3 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Unlock Admin Mode (Password Required)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* FILTER BAR & SEARCH */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
        {/* Category Filter Pills (Only for User Messages) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
              selectedFilter === 'all'
                ? 'bg-white/15 border-white/30 text-white font-bold'
                : 'border-white/10 bg-[#0A0D14] text-neutral-400 hover:text-white'
            }`}
          >
            All ({channelComments.length})
          </button>

          {activeChannel === 'user' && (
            <>
              <button
                type="button"
                onClick={() => setSelectedFilter('accepted')}
                className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
                  selectedFilter === 'accepted'
                    ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] font-bold'
                    : 'border-white/10 bg-[#0A0D14] text-neutral-400 hover:text-white'
                }`}
              >
                ✓ Accepted by Admin
              </button>

              <button
                type="button"
                onClick={() => setSelectedFilter('experience')}
                className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
                  selectedFilter === 'experience'
                    ? 'bg-[#00FF66]/15 border-[#00FF66]/40 text-[#00FF66] font-bold'
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

        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0A0D14] text-white placeholder-neutral-500 focus:border-[#00FF66] outline-none transition-all"
          />
        </div>
      </div>

      {/* FEED / LIST OF MESSAGES */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="bg-[#0A0D14]/90 border border-white/10 rounded-2xl p-10 text-center font-mono">
            <MessageSquare className="w-8 h-8 text-neutral-500 mx-auto mb-2 opacity-60" />
            <h3 className="text-base font-bold text-white">
              {activeChannel === 'user' ? 'No User Messages Yet' : 'No Admin Announcements Yet'}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              {activeChannel === 'user'
                ? 'Be the first student to share your genuine experience or report a problem above.'
                : 'No official announcements have been published by the administrator yet.'}
            </p>
          </div>
        ) : (
          filteredComments.map((item) => (
            <div
              key={item.id}
              className={`bg-[#0A0D14]/90 border rounded-2xl p-5 sm:p-6 shadow-card transition-all ${
                item.channel === 'admin'
                  ? 'border-amber-500/40 bg-gradient-to-r from-amber-500/[0.04] to-transparent'
                  : item.isAccepted
                  ? 'border-[#00FF66]/40 shadow-[0_0_20px_rgba(0,255,102,0.08)]'
                  : 'border-white/10'
              }`}
            >
              {/* Card Header: Author info, Date & Time (Both User & Admin mode) */}
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

                    {/* PROMINENT DATE & TIME DISPLAY FOR BOTH USER AND ADMIN MODE */}
                    <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400 mt-1">
                      <div className="flex items-center gap-1 text-[#00FF66]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-bold text-neutral-300">Date:</span>
                        <span>{item.date || item.timestamp}</span>
                      </div>
                      {item.time && (
                        <>
                          <span className="text-neutral-600">•</span>
                          <div className="flex items-center gap-1 text-neutral-400">
                            <Clock className="w-3 h-3" />
                            <span>{item.time}</span>
                          </div>
                        </>
                      )}
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
                        : item.category === 'suggestion'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {item.category === 'experience'
                      ? '✨ EXPERIENCE'
                      : item.category === 'problem'
                      ? '⚠️ PROBLEM REPORT'
                      : item.category === 'suggestion'
                      ? '📢 ANNOUNCEMENT'
                      : '❓ QUESTION'}
                  </span>

                  {/* Rating */}
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

              {/* Message Content */}
              <div className="py-3.5 space-y-1.5">
                <h3 className="text-sm sm:text-base font-display font-bold text-white tracking-wide">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>

              {/* Admin Note if present */}
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

              {/* Card Footer: ACCEPT Option with Required Text + Upvote + Delete */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                {/* Accept Box with Required Notice */}
                {item.channel === 'user' ? (
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleAccept(item.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                        item.isAccepted
                          ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] hover:bg-rose-500/20 hover:border-rose-500 hover:text-rose-400'
                          : isAdminUnlocked
                          ? 'bg-white/10 hover:bg-[#00FF66] hover:text-black border-white/20 text-neutral-300'
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:border-amber-400/50'
                      }`}
                      title={
                        isAdminUnlocked
                          ? item.isAccepted
                            ? 'Revoke accepted status'
                            : 'Accept this student message'
                          : 'Admin password required to accept message'
                      }
                    >
                      {item.isAccepted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF66]" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-neutral-400" />
                      )}
                      <span>{item.isAccepted ? 'ACCEPTED' : 'ACCEPT'}</span>
                    </button>

                    {/* REQUIRED EXPLICIT TEXT ON EVERY COMMENT */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                      <span className="text-neutral-400 font-semibold">
                        Only admin can accept your message
                      </span>
                      {item.isAccepted && (
                        <span className="text-[#00FF66] font-bold">
                          • Verified
                        </span>
                      )}
                    </div>

                    {/* Edit Admin Note for Admin */}
                    {isAdminUnlocked && item.isAccepted && (
                      <button
                        type="button"
                        onClick={() => {
                          setAdminNotePromptId(item.id);
                          setAdminNoteInput(item.adminNote || '');
                        }}
                        className="text-[10px] text-amber-400 hover:underline ml-1"
                      >
                        [ Edit Admin Note ]
                      </button>
                    )}
                  </div>
                ) : (
                  /* Admin channel card tag */
                  <div className="flex items-center gap-1.5 text-amber-400 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Official Broadcast by Platform Admin</span>
                  </div>
                )}

                {/* Right controls: Upvote & Admin Delete */}
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

                  {isAdminUnlocked && (
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

              {/* Inline Admin Note Editor */}
              {adminNotePromptId === item.id && (
                <div className="mt-3 pt-3 border-t border-white/10 font-mono text-xs">
                  <label className="block text-[10px] uppercase tracking-wider text-amber-400 font-bold mb-1">
                    Add or Edit Admin Verification Note:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      placeholder="e.g., Thank you! This problem has been resolved in the latest update."
                      className="flex-1 px-3 py-1.5 bg-[#050505] border border-white/10 rounded-lg text-white focus:border-amber-400 outline-none text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveAdminNote(item.id)}
                      className="px-3 py-1.5 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-300"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminNotePromptId(null)}
                      className="px-3 py-1.5 bg-white/10 text-neutral-400 rounded-lg hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* 100-LAYER ADMIN AUTHENTICATION PASSWORD MODAL                             */}
      {/* ========================================================================= */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0A0D14] border border-amber-500/40 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 font-bold">
                    SECURITY ACCESS GATE
                  </span>
                  <h3 className="text-base font-display font-bold text-white">
                    Unlock Admin Category
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordError(null);
                }}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 100-layer cryptographic badge */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 font-mono text-[11px] text-neutral-300 flex items-start gap-2">
              <Layers className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-amber-400 font-bold">100-Layer Cryptographic Shield:</span>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  Protected by 100 sequential SHA-256 digest layers with salt & pepper. Only the platform administrator can unlock access.
                </p>
              </div>
            </div>

            <form onSubmit={handleUnlockAdmin} className="space-y-3.5 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  Enter Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password..."
                    autoFocus
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-white/15 bg-[#050505] text-white focus:border-amber-400 outline-none text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Progress Bar when computing 100 layers */}
              {isVerifyingPassword && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-amber-400">
                    <span>Cryptographic Verification:</span>
                    <span>Layer {verificationProgress} / 100</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-amber-500/30">
                    <div
                      className="h-full bg-amber-400 transition-all duration-75"
                      style={{ width: `${Math.max(5, verificationProgress)}%` }}
                    />
                  </div>
                </div>
              )}

              {passwordError && (
                <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">
                  Default initial: <code className="text-amber-400">shivansh@admin</code>
                </span>
                <button
                  type="submit"
                  disabled={isVerifyingPassword || !passwordInput.trim()}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>{isVerifyingPassword ? 'VERIFYING...' : 'VERIFY & UNLOCK'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHANGE ADMIN PASSWORD MODAL (Strictly requires current password)          */}
      {/* ========================================================================= */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0A0D14] border border-[#00FF66]/40 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00FF66]/20 border border-[#00FF66]/40 text-[#00FF66] flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF66] font-bold">
                    SECURITY SETTINGS
                  </span>
                  <h3 className="text-base font-display font-bold text-white">
                    Change Admin Password
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsChangePasswordModalOpen(false);
                  setChangePwdError(null);
                  setChangePwdSuccess(null);
                }}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              To change your password, you must enter your current password first. The new password will be locked with 100 cryptographic layers.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-3 font-mono text-xs">
              {/* Current Password */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  1. Current Admin Password (Required)
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPwd ? 'text' : 'password'}
                    required
                    value={currentPwdInput}
                    onChange={(e) => setCurrentPwdInput(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-white/15 bg-[#050505] text-white focus:border-[#00FF66] outline-none text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                    className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                  >
                    {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  2. New Admin Password (Min. 6 chars)
                </label>
                <div className="relative">
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    required
                    value={newPwdInput}
                    onChange={(e) => setNewPwdInput(e.target.value)}
                    placeholder="Enter new secret password..."
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-white/15 bg-[#050505] text-white focus:border-[#00FF66] outline-none text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                  >
                    {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  3. Confirm New Password
                </label>
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  required
                  value={confirmPwdInput}
                  onChange={(e) => setConfirmPwdInput(e.target.value)}
                  placeholder="Re-enter new secret password..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#050505] text-white focus:border-[#00FF66] outline-none text-sm transition-all"
                />
              </div>

              {/* Progress Bar when hashing 100 layers */}
              {isChangingPwd && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[#00FF66]">
                    <span>Encrypting 100 Cryptographic Layers:</span>
                    <span>Layer {changePwdProgress} / 100</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-[#00FF66]/30">
                    <div
                      className="h-full bg-[#00FF66] transition-all duration-75"
                      style={{ width: `${Math.max(5, changePwdProgress)}%` }}
                    />
                  </div>
                </div>
              )}

              {changePwdError && (
                <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{changePwdError}</span>
                </div>
              )}

              {changePwdSuccess && (
                <div className="p-2.5 rounded-lg bg-[#00FF66]/15 border border-[#00FF66]/40 text-[#00FF66] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{changePwdSuccess}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-400 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPwd || !currentPwdInput || !newPwdInput || !confirmPwdInput}
                  className="px-5 py-2.5 bg-[#00FF66] hover:bg-[#00FF66]/90 disabled:opacity-40 text-black font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{isChangingPwd ? 'ENCRYPTING...' : 'SAVE NEW PASSWORD'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
