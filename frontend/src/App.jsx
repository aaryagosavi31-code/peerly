import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  X, 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Camera, 
  ChevronRight,
  Play,
  UserCheck,
  Globe,
  Info,
  Moon,
  Sun,
  Bookmark,
  Calendar as CalendarIcon,
  Settings,
  Edit3,
  CheckCircle2,
  Lock,
  Mail,
  User,
  LogOut,
  ArrowRight,
  Shield
} from 'lucide-react';
import AdminPortal from './admin';
import axiosInstance from './api/axiosInstance';

const getApiError = (error, fallback) => error.response?.data?.error || fallback;

const INITIAL_POSTS = [
  {
    id: 1,
    committee: 'Circuit Society',
    tagline: 'Technical',
    avatar: 'CS',
    time: '2 hours ago',
    badge: 'Recruiting',
    badgeColor: 'bg-[#FDE8E1] text-[#C87D55] dark:bg-[#3D251E] dark:text-[#FFB74D]',
    caption: 'Build night #41. Four teams, one working quadcopter, zero fire alarms. Recruitment desk opens Monday outside the central canteen!',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000',
    likes: 142,
    isLiked: false,
    comments: [
      { id: 101, user: 'Dev R.', text: 'Is the workshop open for 1st years?', time: '1h ago' },
      { id: 102, user: 'Circuit Society', text: 'Yes! All years welcome.', time: '45m ago' }
    ]
  },
  {
    id: 2,
    committee: 'Aperture',
    tagline: 'Media',
    avatar: 'AP',
    time: '5 hours ago',
    badge: 'Featured Video',
    badgeColor: 'bg-[#E1F3E6] text-[#2D6A4F] dark:bg-[#1C3A27] dark:text-[#81C784]',
    caption: 'Golden hour at the main quad. Teaser reel for our upcoming monsoon photowalk.',
    mediaType: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-campus-41539-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
    likes: 89,
    isLiked: false,
    comments: [
      { id: 201, user: 'Ananya S.', text: 'The grading on this is crazy good!', time: '3h ago' }
    ]
  }
];

const INITIAL_COMMITTEES = [
  { 
    id: 'cs', 
    rank: 1, 
    name: 'Circuit Society', 
    category: 'Technical', 
    desc: 'Robotics, drones and embedded hardware systems.', 
    fullDetails: 'Circuit Society is the official hardware and robotics wing on campus. We host weekly build sessions, competitive hackathons, and drone-racing championships.',
    rating: 4.6, 
    reviewsCount: 212, 
    members: 148, 
    isRecruiting: true, 
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    website: 'https://example.com/circuitsociety',
    lead: 'Vikramaditya S. (President)',
    departments: ['Robotics', 'Embedded Systems', 'Drones & UAV', 'Sponsorship & Outreach']
  },
  { 
    id: 'mq', 
    rank: 2, 
    name: 'Masquerade', 
    category: 'Cultural', 
    desc: 'The campus theatre collective for stage and street play.', 
    fullDetails: 'Masquerade brings dramatics and theatrical arts to life.',
    rating: 4.4, 
    reviewsCount: 168, 
    members: 92, 
    isRecruiting: true, 
    image: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&q=80&w=600',
    website: 'https://example.com/masquerade',
    lead: 'Rhea Kapoor (Creative Director)',
    departments: ['Nukkad Natak', 'Stage Play', 'Scriptwriting', 'Set & Props Design']
  },
  { 
    id: 'ap', 
    rank: 3, 
    name: 'Aperture', 
    category: 'Media', 
    desc: 'Visual storytelling, photography, cinematics & films.', 
    fullDetails: 'Aperture documents the heartbeat of campus life.',
    rating: 4.2, 
    reviewsCount: 97, 
    members: 64, 
    isRecruiting: false, 
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
    website: 'https://example.com/aperture',
    lead: 'Karan Joshi (Head of Media)',
    departments: ['Still Photography', 'Cinematography', 'Post-Production', 'Event Coverage']
  }
];

const INITIAL_EVENTS = [
  { id: 1, day: 3, dateStr: '3 SEP', title: 'Build Night: Line Followers', committee: 'Circuit Society', time: '18:00', venue: 'Lab C', going: 64, tag: 'Workshop', tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  { id: 2, day: 6, dateStr: '6 SEP', title: 'Open Mic — Monsoon Edition', committee: 'Masquerade', time: '19:30', venue: 'Amphitheatre', going: 210, tag: 'Cultural', tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  { id: 3, day: 9, dateStr: '9 SEP', title: 'Film Walk: Old Quarter', committee: 'Aperture', time: '06:30', venue: 'North Gate', going: 41, tag: 'Social', tagColor: 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300' },
  { id: 4, day: 12, dateStr: '12 SEP', title: 'Hack the Campus — 36h', committee: 'Circuit Society', time: '09:00', venue: 'Innovation Hall', going: 480, tag: 'Tech', tagColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' }
];

const INITIAL_LOST_FOUND = [
  { id: 1, type: 'Found', title: 'Black wired earphones', desc: 'Left under a chair after the closing ceremony.', location: 'Innovation Hall, row 4', time: 'Yesterday', event: 'Hackathon', contact: 'Ira M.' },
  { id: 2, type: 'Lost', title: 'Steel water bottle', desc: 'Dented near base with brass keyring.', location: 'Amphitheatre steps', time: 'Sep 6', event: 'Open Mic', contact: 'Reeva K.' }
];

export default function App() {
  const [viewMode, setViewMode] = useState('auth'); // 'user' | 'admin' | 'auth'
  const [authRole, setAuthRole] = useState('student'); // 'student' | 'admin'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState({ name: 'Aaditya J.', email: 'aaditya@peerly.edu', loggedIn: false, role: 'student' });

  // Auth Form State
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  // Active Tab
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'committees' | 'calendar' | 'lostfound' | 'rankings' | 'profile'
  const [profileSubTab, setProfileSubTab] = useState('saved');

  // App Data State
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [committees, setCommittees] = useState(INITIAL_COMMITTEES);
  const [events] = useState(INITIAL_EVENTS);
  const [lostFoundList, setLostFoundList] = useState(INITIAL_LOST_FOUND);

  // Dynamic UI States
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
  const [selectedCommitteeDetails, setSelectedCommitteeDetails] = useState(null);
  const [activeModalMedia, setActiveModalMedia] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  // Profile Specific State
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('Tech enthusiast, drone tinkerer, and 3rd-year CS undergrad at Peerly.');

  // Filters & Submissions
  const [committeeFilter, setCommitteeFilter] = useState('All');
  const [lostFoundFilter] = useState('Everything');
  const [lostForm, setLostForm] = useState({ type: 'Lost', title: '', desc: '', location: '', contact: '' });
  
  const [anonymousReviews, setAnonymousReviews] = useState([
    { id: 1, committee: 'Circuit Society', comment: 'Great hands-on projects, heavy workload during intake.', score: 4.5, time: '2 days ago' }
  ]);
  const [reviewInput, setReviewInput] = useState({ committee: 'cs', score: '5', comment: '' });

  useEffect(() => {
    const loadCommittees = async () => {
      try {
        const response = await axiosInstance.get('/committees');
        const loadedCommittees = response.data.data || [];
        if (loadedCommittees.length) {
          setCommittees((current) => loadedCommittees.map((committee, index) => ({
            ...committee,
            id: committee.id,
            rank: index + 1,
            desc: committee.description || 'Campus committee.',
            fullDetails: committee.description || 'Campus committee.',
            rating: committee.rating || 0,
            reviewsCount: committee.reviews_count || 0,
            members: committee.members || 0,
            isRecruiting: committee.is_recruiting,
            image: committee.logo_url || current[index]?.image || INITIAL_COMMITTEES[0].image,
            website: committee.website || '#',
            lead: committee.lead || 'Committee Executive',
            departments: committee.departments || ['General']
          })));
          setReviewInput((current) => ({ ...current, committee: loadedCommittees[0].id }));
        }
      } catch (error) {
        window.alert(getApiError(error, 'Unable to load committees for reviews.'));
      }
    };

    const loadLostFound = async () => {
      try {
        const response = await axiosInstance.get('/lost-found?type=LOST&page=1&limit=10');
        const items = response.data.data || [];
        setLostFoundList(items.map((item) => ({
          id: item.id,
          type: 'Lost',
          title: item.title,
          desc: item.description || 'No description provided.',
          location: item.location_lost || 'Location unavailable',
          time: item.date_lost || item.created_at,
          event: 'General Campus',
          contact: item.reporter_id || 'Campus user'
        })));
      } catch (error) {
        window.alert(getApiError(error, 'Unable to load lost and found notices.'));
      }
    };

    const loadFeed = async () => {
      try {
        const response = await axiosInstance.get('/feed/posts?page=1&limit=6');
        if (Array.isArray(response.data.data)) setPosts(response.data.data);
      } catch (error) {
        console.warn('Campus feed unavailable:', getApiError(error, 'Unable to load the campus feed.'));
      }
    };

    loadCommittees();
    loadLostFound();
    loadFeed();
  }, []);

  useEffect(() => {
    const loadSelectedCommitteeReviews = async () => {
      if (!reviewInput.committee || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(reviewInput.committee)) return;
      try {
        const response = await axiosInstance.get(`/reviews/committee/${reviewInput.committee}`);
        const committee = committees.find((item) => item.id === reviewInput.committee);
        setAnonymousReviews((response.data.data || []).map((review) => ({
          id: review.id,
          committee: committee?.name || 'Committee',
          comment: review.comment,
          score: review.ratings?.score || 0,
          time: review.created_at
        })));
      } catch (error) {
        console.warn('Saved reviews unavailable:', getApiError(error, 'Unable to load saved reviews.'));
      }
    };

    loadSelectedCommitteeReviews();
  }, [reviewInput.committee, committees]);

  // Post Actions
  const toggleLike = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    try {
      const response = await axiosInstance.post(`/feed/posts/${postId}/comments`, { comment: text });
      setPosts((current) => current.map((post) => post.id === postId
        ? { ...post, comments: [...post.comments, response.data.data] }
        : post));
      setCommentInputs((current) => ({ ...current, [postId]: '' }));
    } catch (error) {
      window.alert(getApiError(error, 'Unable to save your comment. Please sign in and try again.'));
    }
  };

  const handleAddLostFound = async (e) => {
    e.preventDefault();
    if (!lostForm.title || !lostForm.location) return;
    try {
      const response = await axiosInstance.post('/lost-found', {
        title: lostForm.title,
        description: lostForm.desc,
        category: 'General',
        location: lostForm.location,
        type: lostForm.type.toUpperCase(),
        date_lost: new Date().toISOString(),
        image_url: null
      });
      const item = response.data.data;
      setLostFoundList((current) => [{
        id: item.id,
        type: lostForm.type,
        title: item.title,
        desc: item.description || 'No description provided.',
        location: item.location_lost || item.location_found || lostForm.location,
        time: 'Just now',
        event: 'General Campus',
        contact: lostForm.contact || user.name
      }, ...current]);
      setLostForm({ type: 'Lost', title: '', desc: '', location: '', contact: '' });
    } catch (error) {
      window.alert(getApiError(error, 'Unable to submit this notice. Please sign in and try again.'));
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewInput.comment) return;
    try {
      const selectedCommittee = committees.find((committee) => committee.id === reviewInput.committee);
      if (!selectedCommittee || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(reviewInput.committee)) {
        window.alert('Please wait for the real committee list to load, then try again.');
        return;
      }
      const response = await axiosInstance.post('/reviews', {
        committee_id: reviewInput.committee,
        ratings: { score: Number(reviewInput.score) },
        review_text: reviewInput.comment
      });
      setAnonymousReviews((current) => [{
        id: response.data.data?.id || Date.now(),
        committee: selectedCommittee?.name || reviewInput.committee,
        comment: reviewInput.comment,
        score: Number(reviewInput.score),
        time: 'Just now'
      }, ...current]);
      setReviewInput({ committee: committees[0]?.id || 'cs', score: '5', comment: '' });
    } catch (error) {
      window.alert(getApiError(error, 'Unable to submit your review. Please try again.'));
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
      const response = await axiosInstance.post(endpoint, {
        ...authForm,
        role: authRole === 'admin' ? 'ADMIN' : 'STUDENT'
      });
      const account = response.data.user;
      localStorage.setItem('token', response.data.token);
      setUser({
        name: account.name || authForm.email.split('@')[0],
        email: account.email || authForm.email,
        loggedIn: true,
        role: account.role || authRole
      });
      setViewMode(authRole === 'admin' ? 'admin' : 'user');
    } catch (error) {
      window.alert(getApiError(error, 'Authentication failed. Check your details and try again.'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({ name: '', email: '', loggedIn: false, role: 'student' });
    setViewMode('auth');
  };

  if (viewMode === 'admin') {
    return (
      <AdminPortal 
        onBackToApp={() => {
          setViewMode('auth');
          setUser({ name: '', email: '', loggedIn: false, role: 'student' });
        }}
        onAddNewCommittee={(newComm) => setCommittees(prev => [...prev, newComm])}
        onAddPostToFeed={(newPost) => setPosts(prev => [newPost, ...prev])}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    );
  }

  // SIGN IN / AUTH VIEW
  if (viewMode === 'auth') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212] text-[#E0E0E0]' : 'bg-[#FBF9F4] text-[#2D2825]'}`}>
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-[#2A2A2A] text-amber-400 hover:bg-[#333]' : 'bg-[#F3ECE0] text-[#1A1615] hover:bg-[#EAE1D3]'}`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md p-8 rounded-3xl border shadow-lg ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}
        >
          <div className="text-center mb-6">
            <span className="font-serif text-4xl font-bold tracking-tight block">Peerly</span>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>
              Select your account type to access the portal
            </p>
          </div>

          {/* Role Selection Switch */}
          <div className={`grid grid-cols-2 p-1 rounded-xl mb-6 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-[#F3ECE0]'}`}>
            <button
              type="button"
              onClick={() => { setAuthRole('student'); setAuthMode('login'); }}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                authRole === 'student' 
                  ? isDarkMode ? 'bg-[#1E1E1E] text-white shadow-sm' : 'bg-white text-[#1A1615] shadow-sm' 
                  : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-[#6E645E] hover:text-[#1A1615]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthRole('admin'); setAuthMode('login'); }}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                authRole === 'admin' 
                  ? isDarkMode ? 'bg-amber-600 text-white shadow-sm' : 'bg-[#1A1615] text-white shadow-sm' 
                  : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-[#6E645E] hover:text-[#1A1615]'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#C87D55]" />
              <span>Admin</span>
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authRole === 'student' && authMode === 'register' && (
              <div>
                <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}`}>Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Aaditya Joshi" 
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white focus:border-amber-500' : 'bg-[#FBF9F4] border-[#EAE1D3] text-[#2D2825] focus:border-[#C87D55]'}`}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}`}>
                {authRole === 'admin' ? 'Admin Email' : 'Campus Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input 
                  type="email" 
                  placeholder={authRole === 'admin' ? 'admin@peerly.edu' : 'student@peerly.edu'} 
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white focus:border-amber-500' : 'bg-[#FBF9F4] border-[#EAE1D3] text-[#2D2825] focus:border-[#C87D55]'}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}`}>Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white focus:border-amber-500' : 'bg-[#FBF9F4] border-[#EAE1D3] text-[#2D2825] focus:border-[#C87D55]'}`}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${isDarkMode ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-[#1A1615] text-white hover:bg-[#332D2A]'}`}
            >
              <span>{authRole === 'admin' ? 'Sign In as Admin' : (authMode === 'login' ? 'Sign In as Student' : 'Create Account')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            {authRole === 'student' && (
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className={`text-xs font-semibold hover:underline block w-full ${isDarkMode ? 'text-amber-400' : 'text-[#C87D55]'}`}
              >
                {authMode === 'login' ? "Don't have a student account? Sign Up" : "Already have an account? Sign In"}
              </button>
            )}

            <div className="block">
              <button 
                onClick={() => { setUser({ name: 'Guest Student', email: 'guest@peerly.edu', loggedIn: true, role: 'student' }); setViewMode('user'); }}
                className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-[#8C827A] hover:text-[#1A1615]'}`}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${isDarkMode ? 'bg-[#121212] text-[#E0E0E0]' : 'bg-[#FBF9F4] text-[#2D2825]'}`}>
      
      {/* Navbar Header */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 ${isDarkMode ? 'bg-[#1E1E1E]/90 border-[#2C2C2C]' : 'bg-[#FBF9F4]/90 border-[#EAE1D3]'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span 
              onClick={() => setActiveTab('feed')}
              className={`font-serif text-2xl font-bold tracking-tight cursor-pointer ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}
            >
              Peerly
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isDarkMode ? 'bg-[#2C2C2C] text-gray-300' : 'bg-[#EAE1D3] text-[#1A1615]'}`}>
              Live Campus
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {[
              { id: 'feed', label: 'Feed' },
              { id: 'committees', label: 'Committees' },
              { id: 'calendar', label: 'Calendar' },
              { id: 'lostfound', label: 'Lost & Found' },
              { id: 'rankings', label: 'Rankings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? isDarkMode ? 'bg-amber-600 text-white shadow-sm scale-105' : 'bg-[#1A1615] text-white shadow-sm scale-105'
                    : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]' : 'text-[#6E645E] hover:text-[#1A1615] hover:bg-[#F3ECE0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-[#2A2A2A] text-amber-400 hover:bg-[#333]' : 'bg-[#F3ECE0] text-[#1A1615] hover:bg-[#EAE1D3]'}`}
              title="Toggle Light/Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* PROFILE ICON & SIGN IN ACCESS */}
            {user.loggedIn ? (
              <div 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 cursor-pointer p-1 rounded-xl transition-all ${
                  activeTab === 'profile' 
                    ? isDarkMode ? 'bg-[#2A2A2A] ring-2 ring-amber-500' : 'bg-[#F3ECE0] ring-2 ring-[#C87D55]' 
                    : isDarkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F3ECE0]'
                }`}
                title="Go to Profile"
              >
                <div className={`text-right text-xs leading-tight hidden sm:block pl-2 ${isDarkMode ? 'border-[#333]' : 'border-[#EAE1D3]'}`}>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{user.name}</div>
                  <div className={isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}>Batch of '27</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#C87D55] text-white flex items-center justify-center font-medium text-sm shadow-sm ring-2 ring-[#EAE1D3] dark:ring-[#333]">
                  {user.name ? user.name.split(' ').map(n=>n[0]).join('') : 'U'}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setViewMode('auth')}
                className="px-4 py-1.5 rounded-xl bg-[#C87D55] text-white text-xs font-bold hover:bg-[#B36B45] transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* 1. FEED TAB */}
        {activeTab === 'feed' && (
          <div className="space-y-10">
            <div>
              <p className={`text-xs font-bold tracking-wider uppercase mb-3 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>Featured Campus Reels</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {posts.map((post) => (
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    key={post.id} 
                    onClick={() => setActiveModalMedia(post)}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-md group"
                  >
                    <img 
                      src={post.mediaType === 'video' ? (post.posterUrl || post.mediaUrl) : post.mediaUrl} 
                      alt="Reel" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                      {post.mediaType === 'video' ? <Play className="w-4 h-4 fill-white" /> : <Camera className="w-4 h-4" />}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="font-bold text-sm leading-tight">{post.committee}</p>
                      <p className="text-xs opacity-80 mt-0.5 flex items-center gap-1"><Heart className="w-3 h-3 fill-white" /> {post.likes}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {posts.map((post) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={post.id} 
                    className={`rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}
                  >
                    <div className={`p-5 flex items-center justify-between border-b ${isDarkMode ? 'border-[#2C2C2C]' : 'border-[#F5EFE6]'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDarkMode ? 'bg-[#2A2A2A] text-gray-300' : 'bg-[#EAE1D3] text-[#6E645E]'}`}>
                          {post.avatar}
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{post.committee}</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{post.tagline} • {post.time}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${post.badgeColor}`}>
                        {post.badge}
                      </span>
                    </div>

                    <div className="relative bg-black group cursor-pointer" onClick={() => setActiveModalMedia(post)}>
                      {post.mediaType === 'video' ? (
                        <div className="relative">
                          <video src={post.mediaUrl} className="w-full h-96 object-cover" autoPlay loop muted />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white/90 text-[#1A1615] px-4 py-2 rounded-full text-xs font-bold">Expand Video</span>
                          </div>
                        </div>
                      ) : (
                        <img src={post.mediaUrl} alt="Post" className="w-full h-96 object-cover group-hover:opacity-95 transition-opacity" />
                      )}
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="flex items-center gap-4">
                        <motion.button 
                          whileTap={{ scale: 0.8 }}
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center gap-1.5 text-sm font-semibold"
                        >
                          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-rose-500 text-rose-500' : isDarkMode ? 'text-gray-400' : 'text-[#6E645E]'}`} />
                          <span className={post.isLiked ? 'text-rose-500' : isDarkMode ? 'text-gray-400' : 'text-[#6E645E]'}>{post.likes}</span>
                        </motion.button>

                        <div className={`flex items-center gap-1.5 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-[#6E645E]'}`}>
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.comments.length}</span>
                        </div>
                      </div>

                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}`}>{post.caption}</p>

                      <div className={`pt-3 border-t space-y-3 ${isDarkMode ? 'border-[#2C2C2C]' : 'border-[#F5EFE6]'}`}>
                        <div className="max-h-36 overflow-y-auto space-y-2 pr-2">
                          {post.comments.map((c) => (
                            <div key={c.id} className={`text-xs p-2.5 rounded-xl border flex justify-between items-start ${isDarkMode ? 'bg-[#2A2A2A] border-[#333]' : 'bg-[#FBF9F4] border-[#EAE1D3]/60'}`}>
                              <div>
                                <span className={`font-bold mr-2 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{c.user}</span>
                                <span className={isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}>{c.text}</span>
                              </div>
                              <span className={`text-[10px] shrink-0 ml-2 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{c.time}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input 
                            type="text" 
                            placeholder="Add a comment..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            className={`flex-1 rounded-xl px-3 py-2 text-xs focus:outline-none border ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white focus:border-amber-500' : 'bg-[#FBF9F4] border-[#EAE1D3] text-[#2D2825] focus:border-[#C87D55]'}`}
                          />
                          <button 
                            onClick={() => handleAddComment(post.id)}
                            className="p-2 bg-[#C87D55] text-white rounded-xl hover:bg-[#B36B45]"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-6">
                <div className={`rounded-2xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                  <span className={`text-xs font-bold tracking-wider uppercase mb-4 block ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>Upcoming Events</span>
                  <div className="space-y-4">
                    {events.slice(0, 3).map((evt) => (
                      <div key={evt.id} className="flex gap-3 items-start">
                        <div className={`rounded-lg p-2 text-center min-w-[42px] ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-[#F3ECE0]'}`}>
                          <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{evt.day}</div>
                          <div className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>SEP</div>
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold leading-snug ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{evt.title}</h4>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{evt.committee} • {evt.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. COMMITTEES TAB */}
        {activeTab === 'committees' && (
          <div className="space-y-8">
            <div>
              <span className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>EXPLORE COMMITTEES</span>
              <h1 className={`font-serif text-3xl font-normal mt-1 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Discover Campus Societies</h1>
            </div>

            <div className="flex flex-wrap gap-2">
              {['All', 'Technical', 'Cultural', 'Media'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCommitteeFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    committeeFilter === cat
                      ? isDarkMode ? 'bg-amber-600 text-white' : 'bg-[#2D2825] text-white'
                      : isDarkMode ? 'bg-[#1E1E1E] border border-[#2C2C2C] text-gray-300' : 'bg-white border border-[#EAE1D3] text-[#6E645E]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {committees.filter(c => committeeFilter === 'All' || c.category === committeeFilter).map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedCommitteeDetails(item)}
                  className={`rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}
                >
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-[#1A1615] dark:text-white">
                        #{item.rank} Ranked
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className={`font-serif text-xl font-bold flex items-center justify-between ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>
                        {item.name}
                        <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`} />
                      </h3>
                      <p className={`text-xs mt-1.5 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{item.desc}</p>
                    </div>
                  </div>
                  <div className={`px-5 py-3 border-t flex items-center justify-between text-xs ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-gray-300' : 'bg-[#FBF9F4] border-[#EAE1D3] text-[#6E645E]'}`}>
                    <span className={`flex items-center gap-1 font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>
                      <Star className="w-3.5 h-3.5 fill-[#C87D55] text-[#C87D55]" /> {item.rating}
                    </span>
                    <span className="text-[#C87D55] font-semibold flex items-center gap-1">
                      View details <Info className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <span className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>CAMPUS SCHEDULE</span>
                <h1 className={`font-serif text-3xl font-normal mt-1 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>September 2026</h1>
              </div>
              {selectedCalendarDay && (
                <button onClick={() => setSelectedCalendarDay(null)} className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${isDarkMode ? 'bg-[#2A2A2A] text-white' : 'bg-[#EAE1D3] text-[#1A1615]'}`}>
                  Show All Events
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className={`lg:col-span-5 p-6 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                <div className={`grid grid-cols-7 gap-2 text-center text-xs font-bold mb-4 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const dayNum = i + 1;
                    const hasEvent = events.some(e => e.day === dayNum);
                    const isSelected = selectedCalendarDay === dayNum;
                    return (
                      <button 
                        key={dayNum} 
                        onClick={() => setSelectedCalendarDay(isSelected ? null : dayNum)}
                        className={`py-2 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                          isSelected 
                            ? isDarkMode ? 'bg-amber-600 text-white font-bold' : 'bg-[#1A1615] text-white font-bold' 
                            : isDarkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F3ECE0]'
                        }`}
                      >
                        <span>{dayNum}</span>
                        {hasEvent && <span className="w-1.5 h-1.5 rounded-full mt-0.5 bg-[#C87D55]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <h3 className={`font-bold text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>
                    {selectedCalendarDay ? `Events on Sep ${selectedCalendarDay}, 2026` : 'All September Events'}
                  </h3>
                  {(selectedCalendarDay ? events.filter(e => e.day === selectedCalendarDay) : events).map((evt) => (
                    <div key={evt.id} className={`rounded-2xl p-5 border shadow-sm flex items-center justify-between ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                      <div className="flex gap-4 items-center">
                        <div className={`rounded-xl p-3 text-center min-w-[54px] ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-[#F3ECE0]'}`}>
                          <div className={`text-lg font-bold leading-none ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{evt.day}</div>
                          <div className={`text-[10px] font-medium uppercase mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>SEP</div>
                        </div>
                        <div>
                          <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{evt.title}</h3>
                          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{evt.committee}</p>
                          <div className={`flex items-center gap-4 text-xs mt-2 ${isDarkMode ? 'text-gray-300' : 'text-[#6E645E]'}`}>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {evt.time}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {evt.venue}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {evt.going} going</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${evt.tagColor}`}>{evt.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. LOST & FOUND TAB */}
        {activeTab === 'lostfound' && (
          <div className="space-y-8">
            <div>
              <span className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>BOARD</span>
              <h1 className={`font-serif text-3xl font-normal mt-1 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Lost & Found</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {lostFoundList.filter(i => lostFoundFilter === 'Everything' || i.type === lostFoundFilter).map((item) => (
                  <div key={item.id} className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between space-y-3 ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                    <div className="flex justify-between items-start">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${item.type === 'Found' ? 'bg-[#E1F3E6] text-[#2D6A4F] dark:bg-[#1C3A27] dark:text-[#81C784]' : 'bg-[#FDE8E1] text-[#C87D55] dark:bg-[#3D251E] dark:text-[#FFB74D]'}`}>
                        {item.type}
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{item.time}</span>
                    </div>
                    <div>
                      <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{item.title}</h3>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-[#6E645E]'}`}>{item.desc}</p>
                    </div>
                    <div className={`text-xs border-t pt-2 flex justify-between ${isDarkMode ? 'border-[#2C2C2C] text-gray-400' : 'border-[#EAE1D3] text-[#8C827A]'}`}>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Contact: {item.contact}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`rounded-2xl p-6 border shadow-sm h-fit ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                <h3 className={`font-bold text-sm mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Post Item</h3>
                <form onSubmit={handleAddLostFound} className="space-y-3 text-xs">
                  <select value={lostForm.type} onChange={e => setLostForm({ ...lostForm, type: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}>
                    <option value="Lost">I Lost Something</option>
                    <option value="Found">I Found Something</option>
                  </select>
                  <input type="text" placeholder="What did you lose/find?" value={lostForm.title} onChange={e => setLostForm({ ...lostForm, title: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} required />
                  <input type="text" placeholder="Where?" value={lostForm.location} onChange={e => setLostForm({ ...lostForm, location: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} required />
                  <input type="text" placeholder="Your Contact Info" value={lostForm.contact} onChange={e => setLostForm({ ...lostForm, contact: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} />
                  <textarea placeholder="Description..." value={lostForm.desc} onChange={e => setLostForm({ ...lostForm, desc: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} rows={3} />
                  <button type="submit" className="w-full bg-[#C87D55] text-white py-2.5 rounded-xl font-bold">Submit Notice</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 5. RANKINGS TAB */}
        {activeTab === 'rankings' && (
          <div className="space-y-8">
            <div>
              <span className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>TERM RANKING & REVIEWS</span>
              <h1 className={`font-serif text-3xl font-normal mt-1 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Committee Peer Rankings</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                {anonymousReviews.length === 0 && (
                  <div className={`p-5 rounded-2xl border text-sm ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C] text-gray-400' : 'bg-white border-[#EAE1D3] text-[#8C827A]'}`}>
                    No reviews have been posted for this committee yet.
                  </div>
                )}
                {anonymousReviews.map((rev) => (
                  <div key={rev.id} className={`p-5 rounded-2xl border shadow-sm space-y-2 ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{rev.committee}</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-[#C87D55]">
                        <Star className="w-3.5 h-3.5 fill-[#C87D55]" /> {rev.score} / 5
                      </span>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-[#6E645E]'}`}>{rev.comment}</p>
                    <span className={`text-[10px] block text-right ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{rev.time}</span>
                  </div>
                ))}
              </div>

              <div className={`lg:col-span-5 p-6 rounded-2xl border shadow-sm h-fit ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                <h3 className={`font-bold text-sm mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Post Anonymous Review</h3>
                <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                  <select value={reviewInput.committee} onChange={e => setReviewInput({ ...reviewInput, committee: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}>
                    {committees.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select value={reviewInput.score} onChange={e => setReviewInput({ ...reviewInput, score: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                  </select>
                  <textarea placeholder="Write honest feedback..." value={reviewInput.comment} onChange={e => setReviewInput({ ...reviewInput, comment: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} rows={3} required />
                  <button type="submit" className={`w-full py-2.5 rounded-xl font-bold transition-colors ${isDarkMode ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-[#1A1615] text-white'}`}>Post Anonymously</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 6. PROFILE VIEW */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className={`rounded-2xl border p-6 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full bg-[#C87D55] text-white text-2xl font-bold flex items-center justify-center ring-4 ring-[#EAE1D3] dark:ring-[#333]">
                    {user.name ? user.name.split(' ').map(n=>n[0]).join('') : 'AJ'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className={`font-serif text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{user.name}</h1>
                      <span className="bg-[#E1F3E6] text-[#2D6A4F] dark:bg-[#1C3A27] dark:text-[#81C784] text-[10px] font-bold px-2 py-0.5 rounded-full">Verified Student</span>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{user.email} • Class of '27</p>
                    
                    <div className="pt-2">
                      {isEditingBio ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={bioText} 
                            onChange={(e) => setBioText(e.target.value)}
                            className={`text-xs p-2 border rounded-xl w-full max-w-md ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}
                          />
                          <button 
                            onClick={() => setIsEditingBio(false)} 
                            className="text-xs bg-[#C87D55] text-white px-3 py-1.5 rounded-xl font-bold shrink-0"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <p className={`text-xs flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}`}>
                          {bioText}
                          <button onClick={() => setIsEditingBio(true)} className={`p-1 rounded ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-[#8C827A] hover:text-[#1A1615]'}`}>
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>

                  <div className={`grid grid-cols-3 gap-4 w-full p-4 rounded-xl border ${isDarkMode ? 'bg-[#2A2A2A] border-[#333]' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}>
                    <div className="text-center">
                      <span className={`block font-bold text-lg ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>2</span>
                      <span className={`text-[10px] uppercase font-semibold ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>Societies</span>
                    </div>
                    <div className="text-center border-x px-3 border-inherit">
                      <span className={`block font-bold text-lg ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>4</span>
                      <span className={`text-[10px] uppercase font-semibold ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>Bookmarks</span>
                    </div>
                    <div className="text-center">
                      <span className={`block font-bold text-lg ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>2</span>
                      <span className={`text-[10px] uppercase font-semibold ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>Events</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`mt-6 pt-4 border-t flex flex-wrap items-center gap-2 text-xs ${isDarkMode ? 'border-[#2C2C2C]' : 'border-[#EAE1D3]'}`}>
                <span className={`font-bold ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>Active Roles:</span>
                {['Circuit Society (Executive)', 'Aperture (Member)'].map((m, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${isDarkMode ? 'bg-[#2A2A2A] text-amber-400' : 'bg-[#F3ECE0] text-[#1A1615]'}`}>
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className={`flex border-b gap-6 text-sm font-bold ${isDarkMode ? 'border-[#333]' : 'border-[#EAE1D3]'}`}>
                <button 
                  onClick={() => setProfileSubTab('saved')}
                  className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                    profileSubTab === 'saved' 
                      ? 'border-[#C87D55] text-[#C87D55]' 
                      : isDarkMode ? 'border-transparent text-gray-400 hover:text-white' : 'border-transparent text-[#8C827A] hover:text-[#1A1615]'
                  }`}
                >
                  <Bookmark className="w-4 h-4" /> Bookmarks
                </button>

                <button 
                  onClick={() => setProfileSubTab('events')}
                  className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                    profileSubTab === 'events' 
                      ? 'border-[#C87D55] text-[#C87D55]' 
                      : isDarkMode ? 'border-transparent text-gray-400 hover:text-white' : 'border-transparent text-[#8C827A] hover:text-[#1A1615]'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" /> My RSVPs
                </button>

                <button 
                  onClick={() => setProfileSubTab('settings')}
                  className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                    profileSubTab === 'settings' 
                      ? 'border-[#C87D55] text-[#C87D55]' 
                      : isDarkMode ? 'border-transparent text-gray-400 hover:text-white' : 'border-transparent text-[#8C827A] hover:text-[#1A1615]'
                  }`}
                >
                  <Settings className="w-4 h-4" /> Settings
                </button>
              </div>

              {profileSubTab === 'saved' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <div key={post.id} className={`rounded-2xl overflow-hidden border shadow-sm flex flex-col justify-between ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                      <div>
                        <img src={post.mediaUrl} alt={post.committee} className="w-full h-40 object-cover" />
                        <div className="p-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{post.committee}</span>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${post.badgeColor}`}>{post.badge}</span>
                          </div>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-[#6E645E]'}`}>{post.caption}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-3 border-t text-xs flex justify-end ${isDarkMode ? 'border-[#2C2C2C] bg-[#2A2A2A]' : 'border-[#EAE1D3] bg-[#FBF9F4]'}`}>
                        <button className="text-rose-500 font-bold flex items-center gap-1 hover:underline">Remove Bookmark</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {profileSubTab === 'events' && (
                <div className="space-y-4">
                  {events.slice(0, 2).map((evt) => (
                    <div key={evt.id} className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl text-center min-w-[50px] ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-[#F3ECE0]'}`}>
                          <span className={`text-sm font-bold block ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{evt.day} SEP</span>
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{evt.title}</h4>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{evt.committee} • {evt.time} at {evt.venue}</p>
                        </div>
                      </div>
                      <span className="text-xs bg-[#E1F3E6] text-[#2D6A4F] dark:bg-[#1C3A27] dark:text-[#81C784] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Going
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {profileSubTab === 'settings' && (
                <div className={`p-6 rounded-2xl border shadow-sm space-y-6 max-w-xl ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                  <h3 className={`font-serif text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Preferences & Privacy</h3>
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between py-2 border-b border-inherit">
                      <div>
                        <span className={`font-bold block ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Event Alerts</span>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}>Receive notifications for joined committees</span>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-[#C87D55] h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-inherit">
                      <div>
                        <span className={`font-bold block ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Public Reviews</span>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}>Allow peers to see your anonymous reviews</span>
                      </div>
                      <input type="checkbox" className="accent-[#C87D55] h-4 w-4" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Committee Details Modal */}
      <AnimatePresence>
        {selectedCommitteeDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className={`relative max-w-xl w-full rounded-2xl overflow-hidden p-6 space-y-5 ${isDarkMode ? 'bg-[#1E1E1E] text-[#E0E0E0]' : 'bg-white text-[#2D2825]'}`}>
              <button onClick={() => setSelectedCommitteeDetails(null)} className={`absolute top-4 right-4 p-1.5 rounded-full ${isDarkMode ? 'bg-[#2A2A2A] text-white' : 'bg-[#F3ECE0] text-[#1A1615]'}`}>
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isDarkMode ? 'bg-[#2A2A2A] text-gray-300' : 'bg-[#EAE1D3] text-[#1A1615]'}`}>
                  {selectedCommitteeDetails.category}
                </span>
                <h2 className={`font-serif text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{selectedCommitteeDetails.name}</h2>
                <p className={`text-xs mt-2 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-[#6E645E]'}`}>{selectedCommitteeDetails.fullDetails}</p>
              </div>

              <div className={`space-y-3 text-xs border-t pt-4 ${isDarkMode ? 'border-[#2C2C2C]' : 'border-[#EAE1D3]'}`}>
                <div className={`flex items-center gap-2 font-semibold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>
                  <UserCheck className="w-4 h-4 text-[#C87D55]" />
                  <span>Committee Lead: <span className={`font-normal ${isDarkMode ? 'text-gray-400' : 'text-[#6E645E]'}`}>{selectedCommitteeDetails.lead}</span></span>
                </div>

                <div>
                  <span className={`font-semibold block mb-1.5 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Departments:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCommitteeDetails.departments.map((dept, i) => (
                      <span key={i} className={`px-2.5 py-1 rounded-lg text-[11px] ${isDarkMode ? 'bg-[#2A2A2A] text-white' : 'bg-[#F3ECE0] text-[#1A1615]'}`}>
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <a 
                href={selectedCommitteeDetails.website} 
                target="_blank" 
                rel="noreferrer" 
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${isDarkMode ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-[#1A1615] text-white hover:bg-[#332D2A]'}`}
              >
                <Globe className="w-4 h-4" /> Visit Official Website
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reel & Post Lightbox Modal */}
      <AnimatePresence>
        {activeModalMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className={`relative max-w-4xl w-full rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] ${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
              <button 
                onClick={() => setActiveModalMedia(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="md:w-3/5 bg-black flex items-center justify-center min-h-[300px]">
                {activeModalMedia.mediaType === 'video' ? (
                  <video src={activeModalMedia.mediaUrl} controls autoPlay className="max-h-[80vh] w-full object-contain" />
                ) : (
                  <img src={activeModalMedia.mediaUrl} alt="Media modal" className="max-h-[80vh] w-full object-contain" />
                )}
              </div>

              <div className={`md:w-2/5 p-6 flex flex-col justify-between ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#FBF9F4]'}`}>
                <div>
                  <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{activeModalMedia.committee}</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{activeModalMedia.time}</p>
                  <p className={`text-sm my-4 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}`}>{activeModalMedia.caption}</p>
                </div>

                <div className={`pt-4 border-t flex items-center justify-between ${isDarkMode ? 'border-[#2C2C2C]' : 'border-[#EAE1D3]'}`}>
                  <div className="flex items-center gap-2">
                    <Heart className={`w-5 h-5 ${activeModalMedia.isLiked ? 'fill-rose-500 text-rose-500' : isDarkMode ? 'text-gray-400' : 'text-[#6E645E]'}`} />
                    <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{activeModalMedia.likes} Likes</span>
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{activeModalMedia.comments.length} Comments</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}