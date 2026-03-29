import { useState, useEffect } from 'react';
import { Compass, Video, TrendingUp, Languages, User, Search, Bell, Menu, Loader2, Sparkles, ChevronDown, PlayCircle, MessageSquare, Globe, Lock } from 'lucide-react';
import { fetchRealNews, profiles, UserProfile } from './data';
import { ProcessedArticle, runAgentPipeline } from './agent';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [activeTab, setActiveTab] = useState('my-et');
  const [activeProfile, setActiveProfile] = useState<UserProfile>(profiles[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedNews, setProcessedNews] = useState<ProcessedArticle[]>([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Tab specific states
  const [videoGenerating, setVideoGenerating] = useState(false);
  const [translationGenerating, setTranslationGenerating] = useState(false);
  const [briefingGenerating, setBriefingGenerating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [expandedStoryArc, setExpandedStoryArc] = useState<number | null>(null);
  const [activeArticle, setActiveArticle] = useState<ProcessedArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  // Interactive element states
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'agent', text: string}[]>([
    { role: 'user', text: 'How does the capital gains tax hike affect my current portfolio?' },
    { role: 'agent', text: 'Based on your linked portfolio, the impact is minimal since you hold primarily tax-exempt debt instruments.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [activeVideoArticle, setActiveVideoArticle] = useState<ProcessedArticle | null>(null);
  const [activeArcId, setActiveArcId] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchPersonalizedNews = async () => {
      setIsProcessing(true);
      const liveNews = await fetchRealNews();
      const output = await runAgentPipeline(liveNews, activeProfile);
      setProcessedNews(output);
      setIsProcessing(false);
    };
    fetchPersonalizedNews();
  }, [activeProfile, isAuthenticated]);

  // Handle Speech Synthesis for Video Studio
  useEffect(() => {
    if (activeTab === 'video' && videoPlaying && activeVideoArticle) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const textToRead = `Welcome to your My E T AI Newscast. Headline: ${activeVideoArticle.title}. ${activeVideoArticle.content}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95; // Slightly slower for news anchor feel
      utterance.pitch = 1;
      
      // Try to find a good English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Premium')));
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => setVideoPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
    
    return () => window.speechSynthesis.cancel();
  }, [videoPlaying, activeVideoArticle, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 relative">
      
      {/* Seamless Auth Overlay */}
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-700 ease-in-out ${!isAuthenticated ? 'opacity-100 bg-slate-900/60 backdrop-blur-lg scale-100' : 'opacity-0 pointer-events-none scale-105'}`}>
        <div className={`bg-white p-10 w-full max-w-[440px] shadow-2xl relative overflow-hidden transition-all duration-700 ease-out transform ${!isAuthenticated ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
          <div className="flex justify-center mb-8">
            <h1 className="text-4xl font-serif font-black tracking-widest text-gray-900 py-1 uppercase text-center w-full">
              THE ECONOMIC TIMES
            </h1>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-[22px] font-bold text-gray-900 mb-4 font-serif">Login to your account</h2>
            <p className="text-gray-600 text-[15px]">
              Don't have an account ? <span className="font-medium cursor-pointer hover:underline text-gray-900 underline underline-offset-4 decoration-1 font-serif">Sign up</span>
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-gray-700 text-[15px] font-serif">Continue with</span>
            <button className="h-[46px] w-[50px] border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.29-.88 3.57-.84 1.58.15 2.79.81 3.53 2.12-3.01 1.76-2.52 5.92.51 7.07-.68 1.63-1.6 3-2.69 3.84zm-3.13-14.3c.72-.94 1.05-2.09.84-3.17-1.02.14-2.28.79-2.92 1.63-.7.86-1.12 2-1.01 3.12 1.08.06 2.37-.64 3.09-1.58z"/>
              </svg>
            </button>
            <button onClick={() => setIsAuthenticated(true)} className="h-[46px] w-[50px] border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
               <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
               <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
               <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
               <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
          </div>

          <div className="flex items-center mb-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-5 text-gray-400 font-serif text-[17px]">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-[19px] w-[19px] text-[#8fa2b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input type="email" defaultValue="reshampmathi@gmail.com" readOnly className="w-full pl-11 pr-4 py-[15px] border border-[#d6e0f2] bg-[#f0f5ff] focus:outline-none font-serif text-[16px] tracking-wide rounded-sm text-black" />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-[18px] w-[18px] text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input type="password" defaultValue="password" readOnly className="w-full pl-11 pr-12 py-[15px] border border-gray-300 focus:outline-none focus:border-gray-900 font-sans tracking-[0.2em] font-black text-2xl rounded-sm text-black leading-none" />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
                <svg className="h-[20px] w-[20px] text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>

            <div className="flex justify-between items-center px-0.5 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <div className="h-4 w-4 rounded-sm bg-[#418ea7] flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[17px] font-serif text-[#263544]">Stay logged in</span>
              </label>
              <a href="#" className="text-[17px] font-serif text-black underline underline-offset-4 decoration-1">Forgot password ?</a>
            </div>
            
            <button onClick={() => setIsAuthenticated(true)} className="w-full bg-black text-white font-serif font-bold tracking-widest text-[16px] py-[15px] hover:bg-gray-900 transition-all flex justify-center items-center rounded-sm mt-4">
               LOGIN
            </button>
            
            <div className="text-center pt-3 pb-1">
               <a href="#" className="font-serif text-[17px] text-[#000000] hover:underline">Sign In with code or magic link</a>
            </div>
          </div>

          <p className="text-center text-[13px] font-serif text-[#414141] mt-8 px-2 leading-relaxed">
            If you have an account with The Economic Times Businessline, The ET e-Paper, Frontline, or Sportstar.<br/><br/>You can use the same account to login here.
          </p>
        </div>
      </div>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 lg:hidden">
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
                <span className="text-3xl font-serif font-black tracking-tighter text-red-600">ET</span>
                <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-slate-900 text-white tracking-widest uppercase">MyET AI</span>
              </div>
              <nav className="hidden lg:ml-10 lg:flex lg:space-x-8">
                <button onClick={() => { setActiveTab('my-et'); setActiveCategory('All'); }} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeCategory === 'All' ? 'border-red-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>My Newsroom</button>
                <button onClick={() => { setActiveTab('my-et'); setActiveCategory('Markets'); }} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeCategory === 'Markets' ? 'border-red-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>Markets</button>
                <button onClick={() => { setActiveTab('my-et'); setActiveCategory('Tech'); }} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeCategory === 'Tech' ? 'border-red-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>Tech</button>
                <button onClick={() => { setActiveTab('my-et'); setActiveCategory('Startups'); }} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeCategory === 'Startups' ? 'border-red-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>Startups</button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-500"><Search className="h-5 w-5" /></button>
              <div className="relative z-50">
                <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="text-gray-400 hover:text-gray-500 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-4 border border-gray-100">
                    <h3 className="font-bold text-sm mb-3">AI Agent Alerts</h3>
                    <div className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 p-3 rounded-lg">
                      <strong>Portfolio Impact Detected</strong>: A new article perfectly aligns with your "{activeProfile.keywords[0]}" tracking rule. Added to your feed.
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile Selector */}
              <div className="relative z-50">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-lg border border-gray-200 shadow-sm transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                    <span className="text-sm font-bold text-indigo-700">{activeProfile.name[0]}</span>
                  </div>
                  <span className="text-sm font-medium hidden md:block">{activeProfile.name}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                    <div className="px-4 py-3">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Simulate Persona</p>
                    </div>
                    {profiles.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActiveProfile(p);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left block px-4 py-2 text-sm ${activeProfile.id === p.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <span className="block font-bold mb-0.5">{p.name}</span>
                        <span className="block text-xs text-gray-500 truncate">{p.role}</span>
                      </button>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1 mb-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setIsAuthenticated(false);
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Navigation */}
        <div className="flex overflow-x-auto pb-4 mb-8 space-x-4 no-scrollbar">
          {[
            { id: 'my-et', name: 'MyET Newsroom', icon: User, desc: 'Hyper-personalized feed' },
            { id: 'navigator', name: 'NewsNavigator', icon: Compass, desc: 'Interactive briefings' },
            { id: 'video', name: 'AI Video Studio', icon: Video, desc: 'Auto-generated clips' },
            { id: 'story-arc', name: 'StoryArc Tracker', icon: TrendingUp, desc: 'Visual narratives' },
            { id: 'vernacular', name: 'Vernacular Engine', icon: Languages, desc: 'Culturally adapted translation' }
          ].map((feature) => {
            const Icon = feature.icon;
            const isActive = activeTab === feature.id;
            return (
              <button 
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`flex-shrink-0 flex items-start p-4 rounded-xl border transition-all duration-200 text-left w-64 ${
                  isActive 
                    ? 'border-indigo-200 bg-indigo-50 shadow-sm ring-1 ring-indigo-500' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                    {feature.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feature Display Area */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden min-h-[600px] flex shadow-sm">
          
          {/* TAB: MyET Newsroom */}
          {activeTab === 'my-et' && (
            <div className="flex-1 flex flex-col p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 font-serif tracking-tight mb-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-indigo-600">
                      Good afternoon, {activeProfile.name}.
                    </span>
                  </h1>
                  <p className="text-gray-600">Agentic Feed optimized for <b>{activeProfile.role}</b>.</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-lg flex items-center gap-3">
                  {isProcessing ? (
                     <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
                  ) : (
                     <Sparkles className="h-5 w-5 text-indigo-600" />
                  )}
                  <div className="text-sm">
                    <div className="font-bold text-indigo-900">
                      {isProcessing ? "Pipeline Running..." : "Pipeline Active"}
                    </div>
                    <div className="text-indigo-600 text-xs">
                       {isProcessing ? "Extracting entities & sentiments" : "Transformation step Complete"}
                    </div>
                  </div>
                </div>
              </div>

              {isProcessing ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50 space-y-4">
                  <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium">Ingesting data and running transformation steps...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="col-span-2 space-y-6">
                    {(activeCategory === 'All' ? processedNews : processedNews.filter(a => a.sourceCategory.includes(activeCategory))).slice(0, 3).map((article, idx) => (
                      <div 
                        key={article.id} 
                        onClick={() => setActiveArticle(article)}
                        className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all group flex flex-col sm:flex-row cursor-pointer"
                      >
                        <div className={`${idx === 0 ? 'sm:w-2/5' : 'sm:w-1/3'} relative`}>
                           <img src={article.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0" alt="News" />
                           <div className="absolute top-3 left-3 flex gap-2">
                              <span className="bg-white/95 text-xs font-bold uppercase py-1 px-2 rounded border border-gray-200 shadow-sm text-gray-800">
                                {article.sourceCategory}
                              </span>
                           </div>
                        </div>
                        <div className={`p-6 flex flex-col justify-between ${idx === 0 ? 'sm:w-3/5' : 'sm:w-2/3'}`}>
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                               <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center">
                                  <User className="h-3 w-3 mr-1 inline"/> {article.relevanceScore}% Match
                               </div>
                            </div>
                            <h2 className={`font-bold text-gray-900 group-hover:text-red-600 transition-colors ${idx === 0 ? 'text-2xl mb-3' : 'text-xl mb-2'}`}>
                              {article.title}
                            </h2>
                            <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{article.content}</p>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center mt-4">
                             {article.timeAgo}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-6 shadow-sm text-white">
                      <Compass className="h-6 w-6 text-indigo-300 mb-3" />
                      <h3 className="font-bold mb-2">NewsNavigator Insight</h3>
                      <p className="text-indigo-200 text-xs mb-4">
                        Based on your profile, top focus is <span className="font-black text-white">{processedNews[0]?.entities[0]}</span> impacting <span className="font-black text-white">{activeProfile.interests[0]}</span>.
                      </p>
                      <button onClick={() => setActiveTab('navigator')} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold py-2 rounded-lg transition-colors border border-indigo-400">
                        Ask Follow-up Questions
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                       <h3 className="font-bold text-gray-900 flex items-center border-b pb-3 mb-4 text-sm">
                         <TrendingUp className="h-4 w-4 mr-2 text-red-500" /> Agent Routing
                       </h3>
                       <div className="space-y-4">
                         {processedNews.slice(0,4).map(article => (
                           <div 
                             key={article.id} 
                             onClick={() => setActiveArticle(article)}
                             className="flex flex-col border-b border-gray-100 pb-3 last:border-0 cursor-pointer hover:bg-gray-100 p-2 -mx-2 rounded transition-colors"
                           >
                             <span className="text-xs font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600">{article.title}</span>
                             <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block w-max font-bold">
                                {article.matchReasons[0] || 'Interest alignment'}
                             </span>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: NewsNavigator */}
          {activeTab === 'navigator' && (
            <div className="flex-1 flex flex-col md:flex-row p-0">
              <div className="w-full md:w-2/3 p-8 border-r border-gray-200 overflow-y-auto max-h-[600px]">
                  <div className="flex items-center gap-3 mb-6">
                    <Compass className="h-8 w-8 text-indigo-600" />
                    <div>
                      <h2 className="text-2xl font-bold font-serif">Union Budget Synthesis</h2>
                      <p className="text-sm text-gray-500">Synthesized {processedNews.length} related articles into 1 briefing.</p>
                    </div>
                  </div>
                  
                  {briefingGenerating ? (
                     <div className="flex flex-col items-center justify-center p-12">
                       <Loader2 className="animate-spin h-8 w-8 text-indigo-600 mb-4" />
                       <p className="text-gray-600 font-medium">Synthesizing multiple ET sources...</p>
                     </div>
                  ) : (
                     <div className="prose prose-sm max-w-none text-gray-700">
                        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
                           {processedNews.slice(0, 4).map((src, i) => (
                              <div key={i} onClick={() => setActiveArticle(src)} className="flex-shrink-0 w-48 border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 hover:border-indigo-300 transition-colors">
                                <span className="text-[10px] text-gray-500 uppercase font-black block mb-1">Source {i+1}</span>
                                <h4 className="text-xs font-bold text-gray-900 leading-tight line-clamp-2">{src.title}</h4>
                              </div>
                           ))}
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900">Key Takeaways</h3>
                      <ul>
                        <li><strong className="text-gray-900">Tax Relief:</strong> No changes to old tax regime, standard deduction increased to ₹75,000 in new regime.</li>
                        <li><strong className="text-gray-900">Startup Impact:</strong> Angel tax officially abolished, providing massive relief to early-stage startups and angel investors.</li>
                        <li><strong className="text-gray-900">Capital Gains:</strong> Long-term capital gains tax on equities increased from 10% to 12.5%, short-term from 15% to 20%.</li>
                      </ul>
                      
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                        <strong className="text-blue-800">Agent Profile Insight:</strong> Since you track <span className="underline">{activeProfile.keywords[0]}</span>, the abolition of the angel tax strongly aligns with your investment radar.
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900">Market Reaction</h3>
                      <p>Sensex dropped 500 points immediately following the capital gains announcement but recovered as the market digested the positive implications of the angel tax removal and infrastructure spending.</p>
                      
                      <button onClick={() => setBriefingGenerating(true)} className="mt-4 text-sm text-indigo-600 font-bold hover:underline py-2">
                        Regenerate Briefing with different sources
                      </button>
                   </div>
                )}
              </div>
              <div className="w-full md:w-1/3 bg-gray-50 p-6 flex flex-col">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <MessageSquare className="h-4 w-4 text-indigo-500" /> Follow-up Questions
                </h3>
                <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto max-h-80">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`${msg.role === 'user' ? 'bg-gray-100 self-start' : 'bg-indigo-50 border-indigo-100 self-end'} border rounded-lg p-3 text-sm text-gray-800 max-w-[90%]`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && chatInput) {
                        setChatMessages([...chatMessages, {role:'user', text: chatInput}, {role:'agent', text: 'Synthesizing response based on ETF tracking...'}]);
                        setChatInput('');
                      }
                    }}
                    placeholder="Ask about this topic..." 
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                  <button 
                    onClick={() => {
                      if(chatInput) {
                        setChatMessages([...chatMessages, {role:'user', text: chatInput}, {role:'agent', text: 'Synthesizing response based on ETF tracking...'}]);
                        setChatInput('');
                      }
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-indigo-700 transition"
                  >
                    Ask
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AI Video Studio */}
          {activeTab === 'video' && (
            <div className="flex-1 flex flex-col md:flex-row p-0">
               <div className="w-full md:w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
                  <h3 className="font-bold text-gray-900 mb-4 font-serif text-xl border-b pb-4">Select Source Story</h3>
                  <div className="space-y-4">
                    {processedNews.slice(0, 3).map((article, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setActiveVideoArticle(article);
                          setVideoGenerating(true);
                          setVideoPlaying(false);
                          setTimeout(() => {
                            setVideoGenerating(false);
                            setVideoPlaying(true);
                          }, 2500);
                        }} 
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${activeVideoArticle?.id === article.id && !videoGenerating ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                         <h4 className="text-sm font-bold text-gray-900 mb-2">{article.title}</h4>
                         <span className="text-xs text-gray-500 flex items-center"><Video className="h-3 w-3 mr-1" /> Generate Webcast</span>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="w-full md:w-2/3 p-8 flex flex-col items-center justify-center bg-slate-900 text-white relative">
                  {videoGenerating ? (
                    <div className="text-center space-y-6">
                      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">
                        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Generating Webcast</h3>
                        <p className="text-slate-400 text-sm">Synthesizing voiceover, animating data charts, and compiling B-roll...</p>
                      </div>
                      {/* Fake progress bar */}
                      <div className="w-64 h-2 bg-slate-800 rounded-full mt-4 mx-auto overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-[2500ms] w-full ease-linear"></div>
                      </div>
                      <button onClick={() => setVideoGenerating(false)} className="mx-auto mt-4 text-xs text-slate-500 hover:text-white transition-colors underline">
                        Auto-processing...
                      </button>
                    </div>
                  ) : (
                    <div className="w-full max-w-lg aspect-video bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden relative group shadow-2xl flex items-center justify-center">
                       {videoPlaying && (
                         <video 
                           autoPlay 
                           loop 
                           muted 
                           playsInline
                           className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
                           src="https://www.w3schools.com/html/mov_bbb.mp4"
                         />
                       )}
                       <img src={activeVideoArticle?.imageUrl || processedNews[0]?.imageUrl} className={`absolute inset-0 w-full h-full object-cover ${videoPlaying ? 'opacity-20' : 'opacity-40'} mix-blend-overlay transition-opacity`} />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                       
                       {!videoPlaying ? (
                         <button onClick={() => {
                           if(!activeVideoArticle) setActiveVideoArticle(processedNews[0]);
                           setVideoPlaying(true);
                         }} className="z-10 h-16 w-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all group-hover:scale-110 border border-white/50">
                           <PlayCircle className="h-8 w-8 text-white ml-1" />
                         </button>
                       ) : (
                         <div className="z-10 absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center shadow-inner">
                            <span className="text-white font-bold mb-4 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/10"><div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div> Live Webcast Synthesis Playing...</span>
                            <div className="flex gap-1 items-end h-8 mb-6">
                              <div className="w-1.5 bg-indigo-400 h-2 animate-[bounce_1s_infinite]"></div>
                              <div className="w-1.5 bg-indigo-400 h-6 animate-[bounce_1.2s_infinite]"></div>
                              <div className="w-1.5 bg-indigo-400 h-4 animate-[bounce_0.8s_infinite]"></div>
                              <div className="w-1.5 bg-indigo-400 h-8 animate-[bounce_1.5s_infinite]"></div>
                              <div className="w-1.5 bg-indigo-400 h-3 animate-[bounce_0.9s_infinite]"></div>
                            </div>
                            <button onClick={() => setVideoPlaying(false)} className="text-white bg-white/20 px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition backdrop-blur-md border border-white/30 shadow-sm mt-8">Stop Audio & Video Playback</button>
                         </div>
                       )}

                       <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                          <div className="bg-black/70 backdrop-blur-md rounded-lg p-3 border border-slate-700 flex justify-between items-center text-xs text-slate-200">
                            <div className="flex-1 truncate pr-4">
                              <span className="font-bold text-indigo-400 mr-2">AI Anchor:</span>
                              "{activeVideoArticle?.title || processedNews[0]?.title}"
                            </div>
                            <span>0:00 / 1:20</span>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* TAB: StoryArc Tracker */}
          {activeTab === 'story-arc' && (
            <div className="flex-1 flex flex-col md:flex-row p-0">
               <div className="w-full md:w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
                 <h3 className="font-bold text-gray-900 mb-4 font-serif text-xl border-b pb-4 flex items-center gap-2">
                   Tracked Narratives
                 </h3>
                 <div className="space-y-3">
                   {[
                     { id: 0, title: "AI Act & Global Regulations", events: 4, trend: "Positive" },
                     { id: 1, title: "SaaS Market Disruption", events: 4, trend: "Negative" },
                     { id: 2, title: "Fintech Regulatory Shift", events: 3, trend: "Negative" }
                   ].map(arc => (
                     <div 
                       key={arc.id} 
                       onClick={() => setActiveArcId(arc.id)}
                       className={`p-4 border rounded-xl cursor-pointer transition-all ${activeArcId === arc.id ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50'}`}
                     >
                       <h4 className="text-sm font-bold text-gray-900 mb-2">{arc.title}</h4>
                       <div className="flex items-center gap-3 text-xs">
                         <span className="text-gray-500">{arc.events} Milestones</span>
                         <span className={`px-2 py-0.5 rounded-full ${arc.trend === 'Positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           Trending {arc.trend}
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="w-full md:w-2/3 p-8 overflow-y-auto max-h-[600px]">
                 <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                   <div>
                     <h2 className="text-2xl font-bold font-serif mb-1">
                       StoryArc: {activeArcId === 0 ? "AI Act & Global Regulations" : activeArcId === 1 ? "SaaS Market Disruption" : "Fintech Regulatory Shift"}
                     </h2>
                     <p className="text-gray-500 text-sm">Tracking sentiment and key events over the past 6 months.</p>
                   </div>
                   <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">
                     Active Narrative Log
                   </div>
                 </div>

                 <div className="relative border-l-2 border-indigo-200 ml-4 space-y-8 pl-8 py-4">
                    {(activeArcId === 0 ? [
                      { date: 'Oct 2025', title: 'EU ratifies first draft of AI regulatory framework', sent: 'Neutral' },
                      { date: 'Jan 2026', title: 'Top 3 SaaS giants warn of innovation stall', sent: 'Negative' },
                      { date: 'Feb 2026', title: 'Indian government proposes balanced AI growth path', sent: 'Positive' },
                      { date: 'Today', title: 'AI Startup ecosystem sees $15B milestone despite regulations', sent: 'Positive' }
                    ] : activeArcId === 1 ? [
                      { date: 'Nov 2025', title: 'Enterprise spending on legacy SaaS slows by 14%', sent: 'Negative' },
                      { date: 'Dec 2025', title: 'Startups pivot to GenAI-wrapper models to survive', sent: 'Neutral' },
                      { date: 'Last Week', title: 'Major acquisition signals consolidation phase in SaaS', sent: 'Positive' },
                      { date: 'Today', title: 'Indian SaaS reaches $15B milestone, but AI disruption looms large', sent: 'Negative' }
                    ] : [
                      { date: 'Sep 2025', title: 'P2P platforms see record non-performing assets', sent: 'Negative' },
                      { date: 'Dec 2025', title: 'RBI hints at tighter capital controls for digital lending', sent: 'Neutral' },
                      { date: 'Today', title: 'RBI announces new guidelines for fintech lenders', sent: 'Negative' }
                    ]).map((event, i) => (
                      <div key={i} className="relative">
                        <div className={`absolute -left-[41px] h-5 w-5 rounded-full border-4 border-white z-10 ${event.sent === 'Positive' ? 'bg-green-500' : event.sent === 'Negative' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <span className="text-xs font-bold text-gray-400 block mb-1">{event.date}</span>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h4>
                          <div className="flex items-center gap-4 text-xs font-medium">
                            <span className={`px-2 py-0.5 rounded-full ${event.sent === 'Positive' ? 'bg-green-100 text-green-700' : event.sent === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'}`}>
                              Sentiment: {event.sent}
                            </span>
                            <span 
                              onClick={() => setExpandedStoryArc(expandedStoryArc === i ? null : i)}
                              className="text-indigo-600 hover:underline cursor-pointer"
                            >
                              {expandedStoryArc === i ? 'Hide related articles ↑' : 'View 5 related articles →'}
                            </span>
                          </div>
                          {expandedStoryArc === i && (
                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                              <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Agent Contextual Sources</h5>
                              {[...Array(5)].map((_, idx) => (
                                <div key={idx} onClick={() => setActiveArticle(processedNews[idx % processedNews.length])} className="flex gap-3 items-start p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100 group">
                                  <div className="h-1.5 w-1.5 mt-2 rounded-full bg-indigo-300"></div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{activeArcId === 0 ? "Global AI regulatory updates" : activeArcId === 1 ? "SaaS market analysis" : "Fintech lending policy shift"} article integration #{idx + 1}</p>
                                    <p className="text-[10px] text-gray-500 mt-1 uppercase">Economic Times • Source Data</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          )}


          {/* TAB: Vernacular Engine */}
          {activeTab === 'vernacular' && (
            <div className="flex-1 flex flex-col p-8 bg-gray-50">
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-2xl font-bold font-serif">Vernacular Engine</h2>
                   <p className="text-sm text-gray-500">Culturally adapted context, not literal translation.</p>
                 </div>
                 <div className="flex items-center gap-2">
                   <select 
                     className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-medium"
                     value={selectedLanguage}
                     onChange={(e) => {
                       setSelectedLanguage(e.target.value);
                       setTranslationGenerating(true);
                       setTimeout(() => setTranslationGenerating(false), 1500);
                     }}
                   >
                     <option>Hindi</option>
                     <option>Tamil</option>
                     <option>Telugu</option>
                     <option>Bengali</option>
                   </select>
                   <button 
                     onClick={() => {
                       setTranslationGenerating(true);
                       setTimeout(() => setTranslationGenerating(false), 1500);
                     }}
                     className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center"
                   >
                     <Globe className="h-4 w-4 mr-2" /> Translate Stack
                   </button>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                 {/* English Source */}
                 <div onClick={() => setActiveArticle(processedNews[0])} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all group">
                   <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b pb-2 flex justify-between">
                      Original (English)
                      <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">Read Full Source →</span>
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-4">{processedNews[0]?.title || 'Stock market sees record high'}</h3>
                   <p className="text-gray-600 leading-relaxed text-sm">
                     {processedNews[0]?.content || 'The domestic software-as-a-service market has hit a new peak, yet traditional players face mounting pressure to integrate generative AI features to retain their core enterprise clients.'}
                   </p>
                 </div>

                 {/* Translation Output */}
                 <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm flex flex-col relative">
                   <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4 border-b border-indigo-200 pb-2 flex justify-between">
                     <span>Adapted ({selectedLanguage})</span>
                     <span className="flex items-center text-green-600 text-[10px]"><Sparkles className="h-3 w-3 mr-1"/> Culturally Grounded</span>
                   </div>
                   
                   {translationGenerating ? (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl">
                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-3" />
                        <span className="text-sm font-bold text-indigo-900">Adapting idioms to {selectedLanguage}...</span>
                      </div>
                   ) : (
                    <>
                      {selectedLanguage === 'Hindi' && (
                        <>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">भारतीय SaaS बाज़ार ने $15 बिलियन का आंकड़ा छुआ, लेकिन AI की चुनौती बरकरार</h3>
                          <p className="text-gray-700 leading-relaxed text-sm">
                            घरेलू सॉफ्टवेयर-एज़-ए-सर्विस (SaaS) बाज़ार नई ऊंचाइयों पर है। हालांकि, पारंपरिक कंपनियों पर अपने बड़े क्लाइंट्स को बनाए रखने के लिए जनरेटिव AI को अपनाने का भारी दबाव है।
                          </p>
                        </>
                      )}
                      {selectedLanguage === 'Tamil' && (
                        <>
                          <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif leading-relaxed">இந்திய SaaS சந்தை $15 பில்லியனை எட்டியுள்ளது, ஆனால் AI சவால் தொடர்கிறது</h3>
                          <p className="text-gray-700 leading-relaxed text-sm">
                            உள்நாட்டு சாஃப்ட்வேர்-ஆஸ்-எ-சர்வீஸ் (SaaS) சந்தை புதிய உச்சத்தை எட்டியுள்ளது, ஆனாலும் முன்னணி நிறுவனங்கள் தங்களது வாடிக்கையாளர்களைத் தக்கவைக்க ஜெனரேட்டிவ் AI-ஐ இணைக்க வேண்டிய கட்டாயத்தில் உள்ளன.
                          </p>
                        </>
                      )}
                      {selectedLanguage === 'Telugu' && (
                        <>
                          <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif leading-relaxed">భారతీయ సాస్ మార్కెట్ $15 బిలియన్లకు చేరుకుంది, కానీ AI ముప్పు పొంచి ఉంది</h3>
                          <p className="text-gray-700 leading-relaxed text-sm">
                            దేశీయ సాస్ (SaaS) మార్కెట్ కొత్త గరిష్ఠ స్థాయికి చేరింది, అయినప్పటికీ ప్రధాన కంపెనీలు తమ ఖాతాదారులను నిలుపుకోవడానికి జనరేటివ్ ఏఐ ని ఏకీకృతం చేయాల్సిన తీవ్ర ఒత్తిడిని ఎదుర్కొంటున్నాయి.
                          </p>
                        </>
                      )}
                      {selectedLanguage === 'Bengali' && (
                        <>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif leading-relaxed">ভারতীয় SaaS বাজার ১৫ বিলিয়ন ডলারে পৌঁছেছে, তবে AI এর চ্যালেঞ্জ রয়ে গেছে</h3>
                          <p className="text-gray-700 leading-relaxed text-sm">
                            দেশীয় সফটওয়্যার-অ্যাজ-এ-সার্ভিস (SaaS) বাজার নতুন উচ্চতায় পৌঁছেছে, তবে ঐতিহ্যবাহী কোম্পানিগুলো তাদের ক্লায়েন্টদের ধরে রাখতে জেনারেটিভ এআই যুক্ত করার জন্য চাপের মুখে পড়ছে।
                          </p>
                        </>
                      )}
                      
                      <div className="mt-auto pt-6 border-t border-indigo-100">
                        <p className="text-xs text-indigo-600 bg-indigo-100 p-3 rounded-lg flex items-start gap-2">
                          <Sparkles className="h-4 w-4 flex-shrink-0" />
                          Agent Note: The engine culturally adapted "disruption looms" strictly into the localized business lexicon of the target {selectedLanguage} language to preserve journalistic impact rather than verbatim translation.
                        </p>
                      </div>
                    </>
                   )}
                 </div>
               </div>
            </div>
          )}
          
        </div>
      </main>

      {/* Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveArticle(null)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative h-64 sm:h-80 w-full">
              <img src={activeArticle.imageUrl} className="w-full h-full object-cover" alt="Article Cover" />
              <button 
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 h-10 w-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-3">
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-black uppercase px-2 py-1 rounded tracking-widest border border-indigo-100">
                    {activeArticle.sourceCategory}
                  </span>
                  <span className="text-gray-500 text-sm font-medium pt-0.5">{activeArticle.timeAgo}</span>
                </div>
                <button className="hidden sm:flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm">
                  <Lock className="h-3 w-3" /> Subscribe to Bookmark
                </button>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-gray-900 mb-6 leading-tight">
                {activeArticle.title}
              </h2>
              
              <div className="bg-gradient-to-r from-red-50 to-indigo-50 border-l-4 border-indigo-500 p-5 mb-8 rounded-r-xl shadow-sm">
                <h4 className="flex items-center font-black text-indigo-900 mb-2 text-sm uppercase tracking-wide">
                  <Sparkles className="h-4 w-4 mr-2" /> Agent Personalization Matrix
                </h4>
                <p className="text-sm text-indigo-900 leading-relaxed">
                  With a <strong>{activeArticle.relevanceScore}% match</strong> score perfectly aligned with your <strong>"{activeProfile.role}"</strong> persona, this story was surfaced because it <strong>{activeArticle.matchReasons[0]?.toLowerCase()}</strong>. 
                  <br/><br/>
                  The sentiment was assessed as <strong className={`${activeArticle.sentiment === 'Positive' ? 'text-green-600' : activeArticle.sentiment === 'Negative' ? 'text-red-600' : 'text-gray-600'}`}>{activeArticle.sentiment}</strong>, impacting your core tracked entities: <strong>{activeArticle.entities.join(', ')}</strong>.
                </p>
              </div>

              <div className="prose prose-lg text-gray-800 max-w-none">
                {activeArticle.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-lg leading-relaxed mb-4">{paragraph}</p>
                ))}
                <p className="mt-6 text-gray-500 italic text-sm border-t border-gray-100 pt-6">
                  (Simulated full article content for demo purposes. To complete the MVP, a real backend would pipe the full parsed text representation right here for uninterrupted reading.)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
