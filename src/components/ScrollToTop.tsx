import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * This component handles automatic scrolling to the top of the page whenever the route changes.
 */
const ScrollToTop = () => {
  // Get the current pathname from the router location
  const { pathname } = useLocation();

  // Trigger scroll to top whenever the pathname changes
  useEffect(() => {
    // Scroll the window to the top
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
