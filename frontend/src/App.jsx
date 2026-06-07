import React, { useContext, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TempleContext } from './context/TempleContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Universal Lazy Loading for Performance
import Home from './pages/Home';
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Gallery = lazy(() => import('./pages/Gallery'));
const PoojaRoute = lazy(() => import('./pages/Pooja')); // Updated below
const Login = lazy(() => import('./pages/Login'));
const Donation = lazy(() => import('./pages/Donation'));
const PaymentGateway = lazy(() => import('./pages/PaymentGateway'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));
const MySeva = lazy(() => import('./pages/MySeva'));
const TempleSelection = lazy(() => import('./pages/TempleSelection'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

const SimpleLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] font-primary text-stone-400 uppercase tracking-widest text-xs">
    <div className="animate-pulse">Loading Sacred Heritage...</div>
  </div>
);

const ProtectedRoute = ({ element }) => {
  const { token } = useContext(TempleContext);
  return token ? element : <Suspense fallback={<SimpleLoader />}><Login /></Suspense>;
};

const PoojaContent = () => {
  const { selectedTemple } = useContext(TempleContext);
  return selectedTemple ? <PoojaRoute /> : <TempleSelection />;
};

const App = () => {
  return (
    <>
      <ToastContainer 
        autoClose={2000} 
        position="top-right" 
        hideProgressBar={true} 
        newestOnTop={true} 
        closeOnClick 
        pauseOnHover 
        theme="light"
      />
      <div className='px-4 sm:px-[3vw] md:px-[4vw] lg:px-[5vw] bg-gradient-to-br from-amber-50/30 via-stone-100 to-stone-50 min-h-screen flex flex-col'>
        <Navbar />
        <ScrollToTop />
        <main className="flex-grow">
          <Suspense fallback={<SimpleLoader />}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/gallery' element={<Gallery />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/login' element={<Login />} />

              {/* Protected Routes */}
              <Route path='/temples' element={<ProtectedRoute element={<TempleSelection />} />} />
              <Route path='/pooja' element={<ProtectedRoute element={<PoojaContent />} />} />
              <Route path='/donation' element={<ProtectedRoute element={<Donation />} />} />
              <Route path='/payment' element={<ProtectedRoute element={<PaymentGateway />} />} />
              <Route path='/booking-confirmation' element={<ProtectedRoute element={<BookingConfirmation />} />} />
              <Route path='/myseva' element={<ProtectedRoute element={<MySeva />} />} />
              <Route path='/profile' element={<ProtectedRoute element={<Profile />} />} />
              <Route path='/settings' element={<ProtectedRoute element={<Settings />} />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
