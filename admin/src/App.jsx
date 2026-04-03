import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Navigate, Route, Routes, } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import PoojaManage from './pages/PoojaManage.jsx'
import RequestPooja from './pages/RequestPooja.jsx'
import PoojaList from './pages/PoojaList.jsx'
import Add from './pages/Add.jsx'
import Update from './pages/Update.jsx'
import Remove from './pages/Remove.jsx'
import AnnaprasadManage from './pages/AnnaprasadManage.jsx'
import DonationManage from './pages/DonationManage.jsx'
import Manage from './pages/Manage.jsx';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])


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

                {/* nested roots for pooja manage */}
                <Route path='/pooja-manage' element={<PoojaManage />}>

                  {/* ✅ Default route */}
                  <Route index element={<Navigate to="request" replace />} />

                  <Route path='request' element={<RequestPooja />} />
                  <Route path='pooja-list' element={<PoojaList />} />
                  <Route path='add' element={<Add />} />
                  <Route path='manage' element={<Manage />} />
                  <Route path='update/:id' element={<Update />} />
                  <Route path='remove/:id' element={<Remove />} />

                </Route>
                <Route path='/annaprasad-manage' element={<AnnaprasadManage />} />
                <Route path='/donation-manage' element={<DonationManage />} />

              </Routes>
            </div>
          </div>
        </>
      }

    </div>
  )
}

export default App