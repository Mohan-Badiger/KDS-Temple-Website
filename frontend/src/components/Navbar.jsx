// import React, { useContext, useEffect, useState } from 'react';
// import { Link, NavLink } from 'react-router-dom';
// import menu_bar from '../assets/menu_bar.png';
// import cancel_bar from '../assets/cancel_bar.png';
// import { TempleContext } from '../context/TempleContext';
// import { toast } from 'react-toastify';

// const Navbar = () => {
//   const AUTO_LOGOUT_TIME = 20 * 60 * 1000; // 20 minutes

//   const [visible, setVisible] = useState(false);
//   const { navigate, token, setToken } = useContext(TempleContext);

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('lastActivity');
//     setToken('');
//     toast.error('Logged Out');
//     navigate('/');
//   };

//   const updateLastActivity = () => {
//     localStorage.setItem('lastActivity', Date.now().toString());
//   };

//   useEffect(() => {
//     if (!token) return;

//     // Set activity on login or mount
//     updateLastActivity();

//     const checkInactivity = () => {
//       const stored = localStorage.getItem('lastActivity');
//       const last = stored ? parseInt(stored, 10) : Date.now();
//       const now = Date.now();
//       const inactiveTime = now - last;

//       if (inactiveTime >= AUTO_LOGOUT_TIME) {
//         logout();
//       }
//     };

//     const interval = setInterval(checkInactivity, 5000); // Check every 5 seconds

//     const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
//     events.forEach(event => window.addEventListener(event, updateLastActivity));

//     return () => {
//       clearInterval(interval);
//       events.forEach(event => window.removeEventListener(event, updateLastActivity));
//     };
//   }, [token]);

//   return (
//     <>
//       <div className="flex items-center justify-between py-5 font-medium font-primary">
//         <Link to='/'><h1 className='text-3xl'>BNT Temples</h1></Link>

//         <ul className='gap-10 hidden sm:flex'>
//           <NavLink to='/'><p className='text-md'>Home</p></NavLink>
//           <NavLink to='/about'><p className='text-md'>About</p></NavLink>
//           <NavLink to='/gallery'><p className='text-md'>Gallery</p></NavLink>
//           <NavLink to='/contact'><p className='text-md'>Contact</p></NavLink>
//         </ul>

//         <div className='gap-5 hidden sm:flex'>
//           {token === localStorage.getItem('token')
//             ? <button onClick={logout} className='border-1 py-2 px-5 bg-primary hover:bg-amber-600 border-none text-white'>LogOut</button>
//             : <Link className='border-1 py-2 px-5 bg-primary hover:bg-amber-600 border-none text-white' to='/login'>LogIn</Link>}
//         </div>

//         <div className='w-6 block sm:hidden'>
//           <img src={menu_bar} alt="menu" onClick={() => setVisible(true)} />
//         </div>
//       </div>

//       {/* Sidebar for small screens */}
//       <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-100 ${visible ? 'w-full' : 'w-0'}`}>
//         <div className='flex flex-col text-gray-600'>
//           <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
//             <img className='h-4 rotate-450' src={cancel_bar} alt="cancel" />
//             <p>Back</p>
//           </div>
//           <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t' to='/'>Home</NavLink>
//           <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t' to='/about'>ABOUT</NavLink>
//           <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t' to='/gallery'>GALLERY</NavLink>
//           <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-b' to='/contact'>CONTACT</NavLink>
//           {token === localStorage.getItem('token')
//             ? <NavLink onClick={() => { setVisible(false); logout(); }} className='py-2 pl-6 border-t mt-3 bg-primary text-white font-lg'>LOGOUT</NavLink>
//             : <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t mt-3 bg-primary text-white font-lg' to='/login'>LOGIN</NavLink>}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navbar;

import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import menu_bar from '../assets/menu_bar.png';
import cancel_bar from '../assets/cancel_bar.png';
import { TempleContext } from '../context/TempleContext';
import { toast } from 'react-toastify';
import { Volume2, VolumeX, Menu, X, User, History, Settings, LogOut } from 'lucide-react';
import UserDropdown from './User/UserDropdown';

const Navbar = () => {
  const AUTO_LOGOUT_TIME = 10 * 60 * 1000; // 10 minutes
  const [visible, setVisible] = useState(false);
  const { navigate, token, setToken } = useContext(TempleContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

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

  return (
    <>
      <div className="flex items-center justify-between py-5 font-medium font-primary">
        <Link to='/'><h1 className='text-2xl sm:text-3xl'>BNT Temples<span className='text-orange-400 text-4xl'>.</span></h1></Link>

        <ul className='gap-10 hidden sm:flex'>
          <NavLink to='/'><p className='text-md'>Home</p></NavLink>
          <NavLink to='/about'><p className='text-md'>About</p></NavLink>
          <NavLink to='/gallery'><p className='text-md'>Gallery</p></NavLink>
          <NavLink to='/contact'><p className='text-md'>Contact</p></NavLink>
        </ul>

        {/* 🎧 Music Toggle Icon (Devotional Pulse) */}
        <div className="flex items-center gap-7">
          <div className='flex items-center gap-4'>
            <button
              onClick={toggleMusic}
              className={`group flex items-center gap-2 p-2 rounded-full transition-all duration-500 ${isPlaying ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-stone-400 hover:text-orange-500'}`}
              title={isPlaying ? "Mute Shiv Dhun" : "Play Shiv Dhun"}
            >
              <div className="relative">
                {isPlaying ? (
                  <>
                    <Volume2 size={20} className="relative z-10" />
                    <span className="absolute inset-0 bg-orange-400/20 rounded-full animate-ping scale-150"></span>
                  </>
                ) : (
                  <VolumeX size={20} />
                )}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-semibold hidden md:block transition-all ${isPlaying ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 overflow-hidden'}`}>
                Shiv Dhun
              </span>
            </button>

            <div className='w-6 block sm:hidden'>
              <Menu className="text-gray-600 cursor-pointer" onClick={() => setVisible(true)} />
            </div>
          </div>

          {/* Login button visible only on larger screens */}
          <div className="hidden sm:flex items-center">
            {token
              ? (
                <UserDropdown isMobile={false} />
              ) : (
                <Link
                  className="border-1 py-2.5 px-6 bg-orange-400 hover:bg-orange-500 border-none text-white text-xs uppercase tracking-widest transition-all shadow-md"
                  to="/login"
                >
                  LogIn
                </Link>
              )}
          </div>
        </div>
      </div>

      {/* 🔈 Hidden Audio Element */}
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      {/* Sidebar for small screens */}
      <div className={`fixed top-0 right-0 h-[100dvh] overflow-y-auto bg-gradient-to-br from-yellow-100 via-gray-200 to-yellow-100 transition-all z-[999] ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600 min-h-[100dvh]'>
          <div onClick={() => setVisible(false)} className='flex items-center justify-between p-6 border-b border-stone-200'>
            <div className="flex items-center gap-4">
              <X className='h-5 w-5 text-gray-400' />
              <p className="text-xs uppercase tracking-widest">Close Menu</p>
            </div>
            <Link to='/' onClick={() => setVisible(false)}><h1 className='text-xl'>BNT<span className='text-orange-400'>.</span></h1></Link>
          </div>

          <div className="flex flex-col py-4">
            <NavLink onClick={() => setVisible(false)} className='py-4 pl-10 text-sm uppercase tracking-widest border-b border-stone-100' to='/'>Home</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-4 pl-10 text-sm uppercase tracking-widest border-b border-stone-100' to='/about'>About</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-4 pl-10 text-sm uppercase tracking-widest border-b border-stone-100' to='/gallery'>Gallery</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-4 pl-10 text-sm uppercase tracking-widest border-b border-stone-100' to='/contact'>Contact</NavLink>
          </div>

          {token ? (
            <div className="flex flex-col mt-auto mb-8 px-6">
              <div className="bg-white rounded-xl shadow-lg border border-orange-100/50 overflow-hidden">
                <div className="px-6 py-4 bg-orange-50/50 border-b border-orange-100 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-600">
                      <User size={16} />
                   </div>
                   <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-800">Your Account</p>
                </div>
                <div className="flex flex-col">
                  <NavLink onClick={() => setVisible(false)} className='flex items-center gap-4 px-6 py-4 text-sm text-gray-700 hover:bg-orange-50 transition-colors border-b border-stone-50' to='/myseva'>
                    <History size={16} className="text-orange-400" /> <span className="uppercase tracking-widest text-[11px]">My Seva History</span>
                  </NavLink>
                  <NavLink onClick={() => setVisible(false)} className='flex items-center gap-4 px-6 py-4 text-sm text-gray-700 hover:bg-orange-50 transition-colors border-b border-stone-50' to='/profile'>
                    <User size={16} className="text-orange-400" /> <span className="uppercase tracking-widest text-[11px]">My Profile</span>
                  </NavLink>
                  <NavLink onClick={() => setVisible(false)} className='flex items-center gap-4 px-6 py-4 text-sm text-gray-700 hover:bg-orange-50 transition-colors' to='/settings'>
                    <Settings size={16} className="text-orange-400" /> <span className="uppercase tracking-widest text-[11px]">Account Settings</span>
                  </NavLink>
                </div>
                <button
                  onClick={() => { logout(); setVisible(false); }}
                  className='w-full flex items-center gap-4 px-6 py-5 text-left text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-stone-100 bg-stone-50/50'
                >
                  <LogOut size={16} className="text-red-400" /> <span className="uppercase tracking-widest font-bold text-[11px]">Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-auto mb-8 px-6">
              <NavLink onClick={() => setVisible(false)} className='block py-4 text-center text-sm uppercase tracking-widest bg-primary text-white rounded-md shadow-md' to='/login'>Login / Sign Up</NavLink>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
