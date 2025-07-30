// import React, { useContext } from 'react'
// import Navbar from './components/Navbar'
// import { Routes, Route } from 'react-router-dom'
// import Home from './pages/Home'
// import About from './pages/About'
// import Contact from './pages/Contact'
// import Footer from './components/Footer'
// import Gallery from './pages/Gallery'
// import Pooja from './pages/Pooja'
// import Login from './pages/Login'
// import { ToastContainer } from 'react-toastify'
// import Donation from './pages/Donation'
// import PaymentGateway from './pages/PaymentGateway'
// import BookingConfirmation from './pages/BookingConfirmation'
// import Annaprasad from './pages/Annaprasad'
// import { TempleContext } from './context/TempleContext'

// const App = () => {

//   const {token} = useContext(TempleContext);

//   return (
//     <>
//       <ToastContainer autoClose={2000} position="top-right" />
//       <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
//           <Navbar />
//           <Routes>
//             <Route path='/' element={<Home />} />
//             <Route path='/about' element={<About />} />
//             <Route path='/gallery' element={<Gallery />} />
//             <Route path='/contact' element={<Contact />} />
//             <Route path='/login' element={<Login />} />
//             <Route path='/pooja' element={<Pooja />} />
//             <Route path='/annaprasad' element={<Annaprasad/>} />
//             <Route path='/donation' element={<Donation/>} />
//             <Route path='/payment' element={<PaymentGateway/>} />
//             <Route path='/booking-confirmation' element={<BookingConfirmation/>} />
//           </Routes>
//           <Footer />
//       </div>
//     </>
//   )
// }

// export default App

//=======================================================================================================//

import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TempleContext } from './context/TempleContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Pooja from './pages/Pooja';
import Login from './pages/Login';
import Donation from './pages/Donation';
import PaymentGateway from './pages/PaymentGateway';
import BookingConfirmation from './pages/BookingConfirmation';
import Annaprasad from './pages/Annaprasad';
import { ToastContainer } from 'react-toastify';

const ProtectedRoute = ({ element }) => {
  const { token } = useContext(TempleContext);
  return token ? element : <Login />;
};

const App = () => {
  return (
    <>
      <ToastContainer autoClose={2000} position="top-right" />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />

          {/* Protected Routes */}
          <Route path='/pooja' element={<ProtectedRoute element={<Pooja />} />} />
          <Route path='/annaprasad' element={<ProtectedRoute element={<Annaprasad />} />} />
          <Route path='/donation' element={<ProtectedRoute element={<Donation />} />} />
          <Route path='/payment' element={<ProtectedRoute element={<PaymentGateway />} />} />
          <Route path='/booking-confirmation' element={<ProtectedRoute element={<BookingConfirmation />} />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;
