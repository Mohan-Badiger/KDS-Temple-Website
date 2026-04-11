import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Navigate, Route, Routes, } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import PoojaManage from './pages/PoojaManage.jsx'
import AvailabilityManage from './pages/AvailabilityManage.jsx'
import PoojaList from './pages/PoojaList.jsx'
import Add from './pages/Add.jsx'
import Update from './pages/Update.jsx'
import Remove from './pages/Remove.jsx'
import AnnaprasadManage from './pages/AnnaprasadManage.jsx'
import DonationManage from './pages/DonationManage.jsx'
import Manage from './pages/Manage.jsx';
import TempleManage from './pages/TempleManage.jsx';
import TodaySeva from './pages/TodaySeva.jsx';
import UserManage from './pages/UserManage.jsx';
import UsersList from './pages/UsersList.jsx';
import AddUser from './pages/AddUser.jsx';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    const lastActivity = localStorage.getItem('adminActivity');
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    if (storedToken && lastActivity && (now - parseInt(lastActivity, 10) >= tenMinutes)) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminActivity');
      return '';
    }
    return storedToken || '';
  });

  useEffect(() => {
    localStorage.setItem('token', token);
    if (token) {
      localStorage.setItem('adminActivity', Date.now().toString());
    }
  }, [token])

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setToken('');
          localStorage.removeItem('token');
          localStorage.removeItem('adminActivity');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    if (!token) return;

    const updateActivity = () => {
      localStorage.setItem('adminActivity', Date.now().toString());
    };

    const checkInactivity = () => {
      const stored = localStorage.getItem('adminActivity');
      const last = stored ? parseInt(stored, 10) : Date.now();
      const now = Date.now();
      const tenMinutes = 10 * 60 * 1000;

      if (now - last >= tenMinutes) {
        setToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('adminActivity');
      }
    };

    const interval = setInterval(checkInactivity, 5000);
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, updateActivity));

    return () => {
      clearInterval(interval);
      events.forEach((evt) => window.removeEventListener(evt, updateActivity));
    };
  }, [token]);


  return (
    <div className='px-3 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      {token === ''
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base'>
              <Routes>

                <Route path='/' element={<Dashboard />} />
                <Route path='/today-seva' element={<TodaySeva />} />
                <Route path='/temple-manage' element={<TempleManage />} />

                {/* nested roots for pooja manage */}
                <Route path='/pooja-manage' element={<PoojaManage />}>

                  {/* ✅ Default route */}
                  <Route index element={<Navigate to="availability" replace />} />
                  <Route path='availability' element={<AvailabilityManage />} />
                  <Route path='pooja-list' element={<PoojaList />} />
                  <Route path='add' element={<Add />} />
                  <Route path='manage' element={<Manage />} />
                  <Route path='update/:id' element={<Update />} />
                  <Route path='remove/:id' element={<Remove />} />

                </Route>
                <Route path='/annaprasad-manage' element={<AnnaprasadManage />} />
                <Route path='/donation-manage' element={<DonationManage />} />

                {/* User Management */}
                <Route path='/user-manage' element={<UserManage />}>
                  <Route index element={<Navigate to="users-list" replace />} />
                  <Route path='users-list' element={<UsersList />} />
                  <Route path='add-user' element={<AddUser />} />
                </Route>

              </Routes>
            </div>
          </div>
        </>
      }

    </div>
  )
}

export default App