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
import music1 from '../assets/volume.png';
import music2 from '../assets/silent.png';

const Navbar = () => {
  const AUTO_LOGOUT_TIME = 20 * 60 * 1000; // 20 minutes
  const [visible, setVisible] = useState(false);
  const { navigate, token, setToken } = useContext(TempleContext);
  const [isPlaying, setIsPlaying] = useState(true);
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

  // 🔊 Auto play background music when website loads
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5; // set 50% volume

    const playMusic = () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            console.log('Autoplay blocked until user interacts.');
            setIsPlaying(false);
          });
      }
    };

    playMusic();

    // Allow music to start after user interacts (if blocked)
    const startOnClick = () => {
      if (!isPlaying) {
        audio.play();
        setIsPlaying(true);
      }
      window.removeEventListener('click', startOnClick);
    };
    window.addEventListener('click', startOnClick);

    return () => window.removeEventListener('click', startOnClick);
  }, []);

  // 🎵 Toggle music on/off
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.008; // always reset to 50%

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true))
        .catch(() => console.log('User interaction required to play audio.'));
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

        {/* 🎧 Music Toggle Icon (Always visible) */}
        <div className="flex items-center gap-7">
          <div className='flex gap-7'>
            <button
              onClick={toggleMusic}
              className="focus:outline-none hover:opacity-70 transition"
            >
              <img
                src={isPlaying ? music1 : music2}
                alt="music toggle"
                className="h-6 w-6"
              />
            </button>

            <div className='w-6 block sm:hidden'>
              <img src={menu_bar} alt="menu" onClick={() => setVisible(true)} />
            </div>
          </div>

          {/* Login button visible only on larger screens */}
          <div className="hidden sm:flex">
            {token === localStorage.getItem('token')
              ? (
                <button
                  onClick={logout}
                  className="border-1 py-2 px-5 bg-primary hover:bg-amber-600 border-none text-white"
                >
                  LogOut
                </button>
              ) : (
                <Link
                  className="border-1 py-2 px-5 bg-primary hover:bg-amber-600 border-none text-white"
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
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-gradient-to-br from-yellow-100 via-gray-200 to-yellow-100 transition-all z-100 ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-450' src={cancel_bar} alt="cancel" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t' to='/'>Home</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t' to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t' to='/gallery'>GALLERY</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-b' to='/contact'>CONTACT</NavLink>
          {token === localStorage.getItem('token')
            ? <NavLink onClick={() => { setVisible(false); logout(); }} className='py-2 pl-6 border-t mt-3 bg-primary text-white font-lg'>LOGOUT</NavLink>
            : <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t mt-3 bg-primary text-white font-lg' to='/login'>LOGIN</NavLink>}
        </div>
      </div>
    </>
  );
};

export default Navbar;
