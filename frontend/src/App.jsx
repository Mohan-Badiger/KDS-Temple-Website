import React, { useContext, lazy, Suspense } from 'react';
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
import { ToastContainer } from 'react-toastify';
import MySeva from './pages/MySeva';
import ScrollToTop from './components/ScrollToTop';
import TempleSelection from './pages/TempleSelection';

const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

const SimpleLoader = () => <div className="text-center py-10 font-primary text-gray-600">Loading page...</div>;


const ProtectedRoute = ({ element }) => {
  const { token } = useContext(TempleContext);
  return token ? element : <Login />;
};

const PoojaRoute = () => {
  const { selectedTemple } = useContext(TempleContext);
  return selectedTemple ? <Pooja /> : <TempleSelection />;
};

const App = () => {
  return (
    <>
      <ToastContainer autoClose={2000} position="top-right" />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gradient-to-br from-yellow-100 via-gray-200 to-yellow-100'>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />

          {/* Protected Routes */}
          <Route path='/temples' element={<ProtectedRoute element={<TempleSelection />} />} />
          <Route path='/pooja' element={<ProtectedRoute element={<PoojaRoute />} />} />
          <Route path='/donation' element={<ProtectedRoute element={<Donation />} />} />
          <Route path='/payment' element={<ProtectedRoute element={<PaymentGateway />} />} />
          <Route path='/booking-confirmation' element={<ProtectedRoute element={<BookingConfirmation />} />} />
          <Route path='/myseva' element={<ProtectedRoute element={<MySeva/>} />} />
          <Route path='/profile' element={<ProtectedRoute element={<Suspense fallback={<SimpleLoader />}><Profile /></Suspense>} />} />
          <Route path='/settings' element={<ProtectedRoute element={<Suspense fallback={<SimpleLoader />}><Settings /></Suspense>} />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;
