import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  PlusCircle, 
  BarChart3, 
  Video, 
  Image as ImageIcon, 
  Send, 
  CheckCircle2, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageSquare,
  ArrowLeft,
  Moon,
  Sun
} from 'lucide-react';
import axiosInstance from './api/axiosInstance';

const getApiError = (error, fallback) => error.response?.data?.error || fallback;

const EXISTING_COMMITTEES = [
  { id: 'cs', name: 'Circuit Society', faculty: 'Dr. A. K. Sharma' },
  { id: 'mq', name: 'Masquerade', faculty: 'Prof. Smita Roy' },
  { id: 'ap', name: 'Aperture', faculty: 'Dr. Rajesh Nair' }
];

export default function AdminPortal({ onBackToApp, onAddNewCommittee, onAddPostToFeed, isDarkMode, setIsDarkMode }) {
  const [authMode, setAuthMode] = useState('select');
  const [committeeOptions, setCommitteeOptions] = useState(EXISTING_COMMITTEES);
  const [selectedCommittee, setSelectedCommittee] = useState(EXISTING_COMMITTEES[0].id);
  const [activeAdminTab, setActiveAdminTab] = useState('publish');

  const [regForm, setRegForm] = useState({
    name: '',
    category: 'Technical',
    desc: '',
    facultyLead: '',
    leadStudent: '',
    website: ''
  });

  const [postForm, setPostForm] = useState({
    mediaType: 'image',
    caption: '',
    mediaUrl: '',
    badge: 'Announcement'
  });
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Workshop',
    start_time: '',
    end_time: '',
    location: '',
    description: '',
    reg_link: ''
  });

  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    const loadCommittees = async () => {
      try {
        const response = await axiosInstance.get('/committees');
        const loadedCommittees = response.data.data || [];
        if (loadedCommittees.length) {
          setCommitteeOptions(loadedCommittees);
          setSelectedCommittee(loadedCommittees[0].id);
        }
      } catch (error) {
        window.alert(getApiError(error, 'Unable to load committees.'));
      }
    };
    loadCommittees();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.facultyLead) return;
    try {
      const response = await axiosInstance.post('/committees', {
        name: regForm.name,
        description: regForm.desc,
        category: regForm.category,
        contact_email: regForm.facultyLead,
        logo_url: null,
        is_recruiting: true
      });
      const committee = response.data.data;
      if (onAddNewCommittee) onAddNewCommittee({
        ...committee,
        rank: 'Unranked (New)',
        desc: committee.description || 'Newly onboarded campus committee.',
        fullDetails: `${committee.name} is supervised by ${regForm.facultyLead}. ${committee.description || ''}`,
        rating: 0,
        reviewsCount: 0,
        members: 1,
        isRecruiting: true,
        image: committee.logo_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
        website: regForm.website || '#',
        lead: regForm.leadStudent || 'Committee Executive',
        departments: ['General']
      });
      setCommitteeOptions((current) => [...current, committee]);
      setSelectedCommittee(committee.id);
      setAuthMode('logged_in');
    } catch (error) {
      window.alert(getApiError(error, 'Unable to register the committee. Check your admin permissions.'));
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.start_time || !eventForm.end_time || !eventForm.location) return;
    try {
      await axiosInstance.post('/events', {
        ...eventForm,
        committee_id: selectedCommittee,
        is_recruiting: false
      });
      window.alert('Event created successfully.');
      setEventForm({ title: '', category: 'Workshop', start_time: '', end_time: '', location: '', description: '', reg_link: '' });
    } catch (error) {
      window.alert(getApiError(error, 'Unable to create the event. Check your committee permissions.'));
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!postForm.caption || !postForm.mediaUrl) return;
    try {
      const response = await axiosInstance.post('/feed', {
        committee_name: committeeOptions.find((committee) => committee.id === selectedCommittee)?.name || selectedCommittee,
        media_type: postForm.mediaType,
        media_url: postForm.mediaUrl,
        poster_url: postForm.mediaType === 'video' ? postForm.mediaUrl : null,
        caption: postForm.caption,
        badge: postForm.badge || 'Announcement'
      });
      if (onAddPostToFeed) onAddPostToFeed(response.data.data);
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);
      setPostForm({ mediaType: 'image', caption: '', mediaUrl: '', badge: 'Announcement' });
    } catch (error) {
      window.alert(getApiError(error, 'Unable to publish this post. Please try again.'));
    }
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${isDarkMode ? 'bg-[#121212] text-[#E0E0E0]' : 'bg-[#FBF9F4] text-[#2D2825]'}`}>
      <header className={`border-b sticky top-0 z-40 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBackToApp} 
              className={`p-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold ${isDarkMode ? 'bg-[#2A2A2A] text-white hover:bg-[#333]' : 'bg-[#F3ECE0] text-[#1A1615] hover:bg-[#EAE1D3]'}`}
            >
              <ArrowLeft className="w-4 h-4" /> Exit Admin
            </button>
            <span className={`font-serif text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Peerly Admin</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-[#2A2A2A] text-amber-400 hover:bg-[#333]' : 'bg-[#F3ECE0] text-[#1A1615] hover:bg-[#EAE1D3]'}`}
              title="Toggle Light/Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {authMode === 'logged_in' && (
              <div className="flex items-center gap-2">
                  <span className="text-xs bg-[#E1F3E6] text-[#2D6A4F] dark:bg-[#1C3A27] dark:text-[#81C784] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active: {committeeOptions.find((committee) => committee.id === selectedCommittee)?.name || selectedCommittee}
                </span>
                <button 
                  onClick={() => setAuthMode('select')}
                  className={`text-xs underline ml-2 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-[#8C827A] hover:text-[#1A1615]'}`}
                >
                  Switch
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {authMode !== 'logged_in' && (
          <div className={`rounded-2xl border shadow-sm p-8 max-w-xl mx-auto space-y-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
            <div className="text-center space-y-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${isDarkMode ? 'bg-[#2A2A2A] text-[#FFB74D]' : 'bg-[#F3ECE0] text-[#C87D55]'}`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className={`font-serif text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Committee Access</h2>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>Log in as an existing committee or register a new one onto the Peerly campus app.</p>
            </div>

            {authMode === 'select' ? (
              <div className="space-y-4 pt-2">
                <div>
                  <label className={`text-xs font-bold block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#1A1615]'}`}>Select Registered Committee</label>
                  <select 
                    value={selectedCommittee}
                    onChange={(e) => setSelectedCommittee(e.target.value)}
                    className={`w-full p-3 border rounded-xl text-xs font-medium focus:outline-none ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3] text-[#2D2825]'}`}
                  >
                    {committeeOptions.map(c => (
                      <option key={c.id} value={c.name}>{c.name} (Faculty: {c.faculty})</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => setAuthMode('logged_in')}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-colors ${isDarkMode ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-[#1A1615] text-white hover:bg-[#332D2A]'}`}
                >
                  Enter Dashboard
                </button>

                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${isDarkMode ? 'border-[#333]' : 'border-[#EAE1D3]'}`} /></div>
                  <span className={`relative px-3 text-[11px] font-medium ${isDarkMode ? 'bg-[#1E1E1E] text-gray-400' : 'bg-white text-[#8C827A]'}`}>OR</span>
                </div>

                <button 
                  onClick={() => setAuthMode('register')}
                  className={`w-full border py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white hover:bg-[#333]' : 'bg-[#F3ECE0] border-[#EAE1D3] text-[#1A1615] hover:bg-[#EAE1D3]'}`}
                >
                  <PlusCircle className="w-4 h-4 text-[#C87D55]" /> Register New Committee
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4 text-xs">
                <div>
                  <label className={`font-bold block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#1A1615]'}`}>Committee Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Robotics & AI Guild"
                    value={regForm.name}
                    onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                    className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`font-bold block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#1A1615]'}`}>Faculty Co-coordinator *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Dr. S. Sharma"
                      value={regForm.facultyLead}
                      onChange={e => setRegForm({ ...regForm, facultyLead: e.target.value })}
                      className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`font-bold block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#1A1615]'}`}>Category</label>
                    <select 
                      value={regForm.category}
                      onChange={e => setRegForm({ ...regForm, category: e.target.value })}
                      className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}
                    >
                      <option value="Technical">Technical</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Media">Media</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#1A1615]'}`}>Student Head / Lead</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Ananya V. (President)"
                    value={regForm.leadStudent}
                    onChange={e => setRegForm({ ...regForm, leadStudent: e.target.value })}
                    className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#1A1615]'}`}>Official Website / Link</label>
                  <input 
                    type="url" 
                    placeholder="https://..."
                    value={regForm.website}
                    onChange={e => setRegForm({ ...regForm, website: e.target.value })}
                    className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#1A1615]'}`}>Description & Objective</label>
                  <textarea 
                    placeholder="Briefly state what your committee does..."
                    value={regForm.desc}
                    onChange={e => setRegForm({ ...regForm, desc: e.target.value })}
                    className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}
                    rows={3}
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setAuthMode('select')}
                    className={`w-1/3 py-2.5 rounded-xl font-bold ${isDarkMode ? 'bg-[#2A2A2A] text-white hover:bg-[#333]' : 'bg-[#F3ECE0] text-[#1A1615]'}`}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="w-2/3 bg-[#C87D55] text-white py-2.5 rounded-xl font-bold hover:bg-[#B36B45]"
                  >
                    Complete Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {authMode === 'logged_in' && (
          <div className="space-y-8">
            <div className={`flex border-b gap-6 text-sm font-bold ${isDarkMode ? 'border-[#333]' : 'border-[#EAE1D3]'}`}>
              <button 
                onClick={() => setActiveAdminTab('publish')}
                className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                  activeAdminTab === 'publish' 
                    ? 'border-[#C87D55] text-[#C87D55]' 
                    : isDarkMode ? 'border-transparent text-gray-400 hover:text-white' : 'border-transparent text-[#8C827A] hover:text-[#1A1615]'
                }`}
              >
                <Send className="w-4 h-4" /> Publish Post or Reel
              </button>
              <button 
                onClick={() => setActiveAdminTab('analytics')}
                className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                  activeAdminTab === 'analytics' 
                    ? 'border-[#C87D55] text-[#C87D55]' 
                    : isDarkMode ? 'border-transparent text-gray-400 hover:text-white' : 'border-transparent text-[#8C827A] hover:text-[#1A1615]'
                }`}
              >
                <BarChart3 className="w-4 h-4" /> Analytics & Performance
              </button>
            </div>

            {activeAdminTab === 'publish' && (
              <div className="space-y-6">
              <div className={`rounded-2xl p-6 border shadow-sm max-w-2xl ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                <h3 className={`font-serif text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Post Content to Live Feed</h3>

                <AnimatePresence>
                  {publishSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }}
                      className="mb-4 p-3 bg-[#E1F3E6] dark:bg-[#1C3A27] border border-[#2D6A4F]/20 text-[#2D6A4F] dark:text-[#81C784] text-xs font-bold rounded-xl flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Published successfully! Exit Admin to see it in User Feed.
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handlePublish} className="space-y-4 text-xs">
                  <div>
                    <label className={`font-bold block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#1A1615]'}`}>Content Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button"
                        onClick={() => setPostForm({ ...postForm, mediaType: 'image' })}
                        className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 ${
                          postForm.mediaType === 'image' 
                            ? 'border-[#C87D55] bg-[#FDE8E1] dark:bg-[#3D251E] text-[#C87D55] dark:text-[#FFB74D]' 
                            : isDarkMode ? 'border-[#333] text-gray-400' : 'border-[#EAE1D3] text-[#8C827A]'
                        }`}
                      >
                        <ImageIcon className="w-4 h-4" /> Image Post
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPostForm({ ...postForm, mediaType: 'video' })}
                        className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 ${
                          postForm.mediaType === 'video' 
                            ? 'border-[#2D6A4F] bg-[#E1F3E6] dark:bg-[#1C3A27] text-[#2D6A4F] dark:text-[#81C784]' 
                            : isDarkMode ? 'border-[#333] text-gray-400' : 'border-[#EAE1D3] text-[#8C827A]'
                        }`}
                      >
                        <Video className="w-4 h-4" /> Campus Reel (Video)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`font-bold block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#1A1615]'}`}>Badge Tag</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Recruiting, Workshop, Event Reel"
                      value={postForm.badge}
                      onChange={e => setPostForm({ ...postForm, badge: e.target.value })}
                      className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}
                    />
                  </div>

                  <div>
                    <label className={`font-bold block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#1A1615]'}`}>Media URL (Image Direct Link or MP4 Video) *</label>
                    <input 
                      type="url" 
                      placeholder="https://images.unsplash.com/... or https://assets.mixkit.co/..."
                      value={postForm.mediaUrl}
                      onChange={e => setPostForm({ ...postForm, mediaUrl: e.target.value })}
                      className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`font-bold block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#1A1615]'}`}>Caption *</label>
                    <textarea 
                      placeholder="Write your announcement or reel caption..."
                      value={postForm.caption}
                      onChange={e => setPostForm({ ...postForm, caption: e.target.value })}
                      className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}
                      rows={3}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className={`w-full py-3 rounded-xl font-bold transition-colors ${isDarkMode ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-[#1A1615] text-white hover:bg-[#332D2A]'}`}
                  >
                    Publish Content Immediately
                  </button>
                </form>
              </div>

              <form onSubmit={handleCreateEvent} className={`rounded-2xl p-6 border shadow-sm max-w-2xl space-y-4 text-xs ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                <h3 className={`font-serif text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Create Campus Event</h3>
                <input type="text" placeholder="Event title" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} required />
                <div className="grid grid-cols-2 gap-3">
                  <select value={eventForm.category} onChange={e => setEventForm({ ...eventForm, category: e.target.value })} className={`p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}>
                    <option>Workshop</option><option>Cultural</option><option>Social</option><option>Tech</option>
                  </select>
                  <input type="text" placeholder="Location" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} className={`p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="datetime-local" value={eventForm.start_time} onChange={e => setEventForm({ ...eventForm, start_time: e.target.value })} className={`p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} required />
                  <input type="datetime-local" value={eventForm.end_time} onChange={e => setEventForm({ ...eventForm, end_time: e.target.value })} className={`p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} required />
                </div>
                <textarea placeholder="Description" value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} rows={2} />
                <input type="url" placeholder="Registration link (optional)" value={eventForm.reg_link} onChange={e => setEventForm({ ...eventForm, reg_link: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} />
                <button type="submit" className="w-full py-3 rounded-xl font-bold bg-[#C87D55] text-white hover:bg-[#B36B45]">Create Event</button>
              </form>
              </div>
            )}

            {activeAdminTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className={`p-5 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                    <div className="flex justify-between items-center text-xs font-bold uppercase mb-2 opacity-70">
                      <span>Total Feed Reach</span>
                      <Eye className="w-4 h-4 text-[#C87D55]" />
                    </div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>2,480</div>
                    <p className="text-[10px] text-[#2D6A4F] dark:text-[#81C784] mt-1 flex items-center gap-0.5 font-semibold">
                      <TrendingUp className="w-3 h-3" /> +14% this week
                    </p>
                  </div>

                  <div className={`p-5 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                    <div className="flex justify-between items-center text-xs font-bold uppercase mb-2 opacity-70">
                      <span>Reel Interactions</span>
                      <Heart className="w-4 h-4 text-[#C87D55]" />
                    </div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>631</div>
                    <p className="text-[10px] opacity-70 mt-1">Likes & Shares</p>
                  </div>

                  <div className={`p-5 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                    <div className="flex justify-between items-center text-xs font-bold uppercase mb-2 opacity-70">
                      <span>Recent Feedback</span>
                      <MessageSquare className="w-4 h-4 text-[#C87D55]" />
                    </div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>4.8 / 5.0</div>
                    <p className="text-[10px] opacity-70 mt-1">Based on student rankings</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}