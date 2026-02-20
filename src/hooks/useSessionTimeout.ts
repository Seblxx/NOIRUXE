import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/authService';
import { checkSessionTimeout, updateSessionActivity, clearSession } from '../utils/authSecurity';

const ACTIVITY_CHECK_INTERVAL = 60000; // Check every minute

export const useSessionTimeout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateSessionActivity();
    };

    // Add listeners for all activity events
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Check for session timeout periodically
    const timeoutChecker = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && checkSessionTimeout()) {
        // Session has timed out
        clearSession();
        await supabase.auth.signOut();
        alert('Your session has expired due to inactivity. Please login again.');
        navigate('/login');
      }
    }, ACTIVITY_CHECK_INTERVAL);

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(timeoutChecker);
    };
  }, [navigate]);
};
