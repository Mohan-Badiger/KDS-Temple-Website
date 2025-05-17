import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import Gallery from './pages/Gallery'
import Pooja from './pages/Pooja'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import Donation from './pages/Donation'
import PaymentGateway from './pages/PaymentGateway'
import BookingConfirmation from './pages/BookingConfirmation'
import Annaprasad from './pages/Annaprasad'

const App = () => {
  return (
    <>
      <ToastContainer autoClose={2000} position="top-right" />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] '>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/gallery' element={<Gallery />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/pooja' element={<Pooja />} />
            <Route path='/login' element={<Login />} />
            <Route path='/annaprasad' element={<Annaprasad/>} />
            <Route path='/donation' element={<Donation/>} />
            <Route path='/payment' element={<PaymentGateway/>} />
            <Route path='/booking-confirmation' element={<BookingConfirmation/>} />
          </Routes>
          <Footer />
      </div>
    </>
  )
}

export default App