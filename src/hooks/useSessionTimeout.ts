import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/authService';
import { checkSessionTimeout, updateSessionActivity, clearSession } from '../utils/authSecurity';

const ACTIVITY_CHECK_INTERVAL = 60000; // Check every minute

export const useSessionTimeout = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

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
        setShowModal(true);
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

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/login');
  };

  return {
    showSessionTimeoutModal: showModal,
    closeSessionTimeoutModal: handleModalClose,
  };
};
