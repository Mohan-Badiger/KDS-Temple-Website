import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import menu_bar from '../assets/menu_bar.png';
import cancel_bar from '../assets/cancel_bar.png';
import om_logo from '../assets/om.png';
import { TempleContext } from '../context/TempleContext';
import { toast } from 'react-toastify';
import { Volume2, VolumeX, Menu, X, User, History, Settings, LogOut, Compass } from 'lucide-react';
import UserDropdown from './User/UserDropdown';

const Navbar = () => {
  const AUTO_LOGOUT_TIME = 10 * 60 * 1000; // 10 minutes
  const [visible, setVisible] = useState(false);
  const { navigate, token, setToken } = useContext(TempleContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const audioRef = useRef(null);

  // Track scroll position for dynamic glassmorphism header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastActivity');
    setToken('');
    toast.error('Logged Out');
    navigate('/');
  };

  // Track last user activity
  const updateLastActivity = () => {
    localStorage.setItem('lastActivity', Date.now().toString());
  };

  useEffect(() => {
    if (!token) return;
    updateLastActivity();

    const checkInactivity = () => {
      const stored = localStorage.getItem('lastActivity');
      const last = stored ? parseInt(stored, 10) : Date.now();
      const now = Date.now();
      if (now - last >= AUTO_LOGOUT_TIME) logout();
    };

    const interval = setInterval(checkInactivity, 5000);
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, updateLastActivity));

    return () => {
      clearInterval(interval);
      events.forEach(event => window.removeEventListener(event, updateLastActivity));
    };
  }, [token]);

  // 🔒 Lock body scroll when mobile menu is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [visible]);

  // 🔊 Audio management
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4; // Devotional background volume

    // Autoplay attempt (most browsers block this)
    const playAttempt = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    playAttempt();

    // Interaction-based start for restricted browsers
    const handleFirstInteraction = () => {
      if (!isPlaying) {
        audio.play().then(() => setIsPlaying(true));
      }
      window.removeEventListener('click', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, []);

  // 🎵 Toggle music on/off
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = 0.4;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Audio playback error:", err));
    }
  };

  const linkStyles = ({ isActive }) =>
    `relative py-1 text-xs uppercase tracking-[0.2em] transition-all duration-300 font-semibold ${isActive ? 'text-orange-600 after:w-full' : 'text-stone-700 hover:text-orange-600 after:w-0'
    } after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full`;

  return (
    <nav className={`sticky top-0 z-[100] px-4 -mx-4 sm:-mx-[3vw] md:-mx-[4vw] lg:-mx-[5vw] sm:px-[3vw] md:px-[4vw] lg:px-[5vw] transition-all duration-500 ${
      isScrolled 
        ? 'bg-liquid-glass' 
        : 'bg-transparent border-b border-transparent shadow-none'
    }`}>
      <div className={`flex items-center justify-between font-primary transition-all duration-500 ${
        isScrolled ? 'py-3' : 'py-5'
      }`}>

        {/* Sacred Branding Logo */}
        <Link to='/' className="flex items-center group">
          <h1 className="font-cinzel text-base sm:text-lg lg:text-xl tracking-wide text-stone-850 group-hover:text-orange-600 transition-colors font-semibold leading-none">
            BNT TEMPLES <span className='text-orange-500'>.</span>
          </h1>
        </Link>

        {/* Center Links */}
        <ul className="gap-8 hidden sm:flex items-center">
          <NavLink to="/" className={linkStyles}>Home</NavLink>
          <NavLink to="/about" className={linkStyles}>About</NavLink>
          <NavLink to="/gallery" className={linkStyles}>Gallery</NavLink>
          <NavLink to="/contact" className={linkStyles}>Contact</NavLink>
        </ul>

        {/* Right Controls */}
        <div className="flex items-center gap-6">

          {/* Shiv Dhun Control Badge */}
          <button
            onClick={toggleMusic}
            className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 shadow-sm cursor-pointer backdrop-blur-md ${isPlaying
              ? 'bg-orange-500/10 border-orange-500/30 text-orange-600 shadow-orange-500/5'
              : 'bg-white/40 border-white/60 text-stone-700 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-600'
              }`}
            title={isPlaying ? "Mute Devotional Melody" : "Play Devotional Melody"}
          >
            <div className="relative flex items-center justify-center">
              {isPlaying ? (
                <>
                  <Volume2 size={18} className="relative z-10 text-orange-600 animate-pulse" />
                  <span className="absolute inset-0 bg-orange-500/20 rounded-full scale-150 animate-ping"></span>
                </>
              ) : (
                <VolumeX size={18} className="text-stone-500 group-hover:text-orange-600 transition-colors" />
              )}
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold hidden md:block">
              Shiv Dhun
            </span>
          </button>

          {/* User Account / Login Grid */}
          <div className="hidden sm:flex items-center">
            {token ? (
              <UserDropdown isMobile={false} />
            ) : (
              <Link
                className="px-5.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] rounded-sm border-none cursor-pointer"
                to="/login"
              >
                LogIn
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="w-6 block sm:hidden">
            <Menu className="text-stone-700 cursor-pointer hover:text-orange-600 transition-colors" onClick={() => setVisible(true)} />
          </div>
        </div>
      </div>

      {/* Hidden Audio */}
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 h-[100dvh] overflow-y-auto bg-white/70 backdrop-blur-[36px] text-stone-900 transition-all duration-500 z-[999] ${visible ? 'w-full animate-fade-in' : 'w-0'}`}>
        <div className="flex flex-col min-h-[100dvh]">

          <div onClick={() => setVisible(false)} className="flex items-center justify-between p-6 border-b border-black/5">
            <div className="flex items-center gap-3 cursor-pointer group">
              <X className="h-5 w-5 text-stone-500 group-hover:text-orange-600 transition-colors" />
              <p className="text-[10px] uppercase tracking-widest font-semibold text-stone-400 group-hover:text-orange-600 transition-colors">Close</p>
            </div>
          </div>

          <div className="flex flex-col py-6">
            <NavLink onClick={() => setVisible(false)} className="py-4 pl-12 text-xs uppercase tracking-[0.25em] border-b border-black/5 text-stone-900 hover:text-orange-600 font-semibold transition-colors" to="/">Home</NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-4 pl-12 text-xs uppercase tracking-[0.25em] border-b border-black/5 text-stone-900 hover:text-orange-600 font-semibold transition-colors" to="/about">About</NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-4 pl-12 text-xs uppercase tracking-[0.25em] border-b border-black/5 text-stone-900 hover:text-orange-600 font-semibold transition-colors" to="/gallery">Gallery</NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-4 pl-12 text-xs uppercase tracking-[0.25em] border-b border-black/5 text-stone-900 hover:text-orange-600 font-semibold transition-colors" to="/contact">Contact</NavLink>
          </div>

          {token ? (
            <div className="flex flex-col mt-auto mb-12 px-6">
              <div className="bg-white/40 backdrop-blur-md rounded-xl border border-white/60 overflow-hidden shadow-md">
                <div className="px-6 py-4 bg-white/30 border-b border-white/45 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                    <User size={14} />
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-850">My Account</p>
                </div>
                <div className="flex flex-col">
                  <NavLink onClick={() => setVisible(false)} className="flex items-center gap-4 px-6 py-4 text-xs text-stone-700 hover:bg-orange-50/50 hover:text-orange-600 transition-colors border-b border-white/30" to="/myseva">
                    <History size={14} className="text-orange-600" /> <span className="uppercase tracking-widest text-[9px] font-semibold">My Seva History</span>
                  </NavLink>
                  <NavLink onClick={() => setVisible(false)} className="flex items-center gap-4 px-6 py-4 text-xs text-stone-700 hover:bg-orange-50/50 hover:text-orange-600 transition-colors border-b border-white/30" to="/profile">
                    <User size={14} className="text-orange-600" /> <span className="uppercase tracking-widest text-[9px] font-semibold">My Profile</span>
                  </NavLink>
                  <NavLink onClick={() => setVisible(false)} className="flex items-center gap-4 px-6 py-4 text-xs text-stone-700 hover:bg-orange-50/50 hover:text-orange-600 transition-colors" to="/settings">
                    <Settings size={14} className="text-orange-600" /> <span className="uppercase tracking-widest text-[9px] font-semibold">Account Settings</span>
                  </NavLink>
                </div>
                <button
                  onClick={() => { logout(); setVisible(false); }}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left text-xs text-red-655 hover:bg-red-50/50 transition-colors border-t border-white/45 bg-white/20 cursor-pointer"
                >
                  <LogOut size={14} className="text-red-655" /> <span className="uppercase tracking-widest font-bold text-[9px]">Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-auto mb-12 px-6">
              <NavLink onClick={() => setVisible(false)} className="block py-3.5 text-center text-[11px] uppercase tracking-[0.2em] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] border-none rounded-sm transition-all duration-300 font-bold" to="/login">Login / Sign Up</NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
