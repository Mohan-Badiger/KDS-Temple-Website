import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Customized minimalist Home icon matching the reference design
const HomeIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <line x1="9" x2="15" y1="17" y2="17" />
  </svg>
);

const Breadcrumb = () => {
  const location = useLocation();
  const path = location.pathname;

  // Don't show breadcrumbs on Home, About (uses full banner), or Login pages
  const excludedPaths = ['/', '/about', '/login'];
  if (excludedPaths.includes(path)) return null;

  // Dynamic breadcrumb trail mapping
  const getBreadcrumbs = (currentPath) => {
    const crumbs = [];

    // Root is always Home (rendered as the outline house icon)
    crumbs.push({ name: 'Home', path: '/' });

    if (currentPath.startsWith('/temples')) {
      crumbs.push({ name: 'Select Temple', path: '/temples' });
    } else if (currentPath.startsWith('/pooja')) {
      crumbs.push({ name: 'Select Temple', path: '/temples' });
      crumbs.push({ name: 'Select Pooja', path: '/pooja' });
    } else if (currentPath.startsWith('/payment')) {
      crumbs.push({ name: 'Select Temple', path: '/temples' });
      crumbs.push({ name: 'Select Pooja', path: '/pooja' });
      crumbs.push({ name: 'Checkout', path: '/payment' });
    } else if (currentPath.startsWith('/booking-confirmation')) {
      crumbs.push({ name: 'Select Temple', path: '/temples' });
      crumbs.push({ name: 'Select Pooja', path: '/pooja' });
      crumbs.push({ name: 'Checkout', path: '/payment' });
      crumbs.push({ name: 'Confirmed', path: '/booking-confirmation' });
    } else {
      // Standard pages mapper
      const segments = currentPath.split('/').filter(Boolean);
      const segmentNames = {
        about: 'About Us',
        contact: 'Contact',
        gallery: 'Gallery',
        donation: 'Make Donation',
        profile: 'My Profile',
        settings: 'Settings',
        myseva: 'Seva History',
      };
      
      segments.forEach((seg, idx) => {
        const url = `/${segments.slice(0, idx + 1).join('/')}`;
        crumbs.push({
          name: segmentNames[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
          path: url
        });
      });
    }

    return crumbs;
  };

  const crumbs = getBreadcrumbs(path);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-6 mb-2">
      <nav className="flex items-center gap-3.5 select-none text-[13px] font-sans font-medium text-stone-500">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          const isHome = idx === 0;

          return (
            <React.Fragment key={crumb.path + idx}>
              {/* Home Icon or Text Link */}
              {isHome ? (
                <Link
                  to={crumb.path}
                  className="text-stone-400 hover:text-orange-500 transition-colors flex items-center justify-center p-1 rounded-md"
                  title="Go to Home"
                >
                  <HomeIcon className="w-4 h-4 text-stone-400" />
                </Link>
              ) : isLast ? (
                <span className="text-orange-600 font-semibold tracking-wide">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-stone-500 hover:text-orange-500 transition-colors tracking-wide"
                >
                  {crumb.name}
                </Link>
              )}

              {/* Chevron divider */}
              {!isLast && (
                <ChevronRight className="w-3.5 h-3.5 text-stone-300 stroke-[1.5]" />
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumb;
