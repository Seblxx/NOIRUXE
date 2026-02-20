import { useEffect } from 'react';

/**
 * HTTPS Enforcement Hook
 * Redirects HTTP traffic to HTTPS in production
 */
export const useHTTPSEnforcement = () => {
  useEffect(() => {
    // Only enforce HTTPS in production
    if (import.meta.env.PROD && typeof window !== 'undefined') {
      const { protocol, host, href } = window.location;
      
      // If currently on HTTP, redirect to HTTPS
      if (protocol === 'http:') {
        const httpsUrl = `https://${host}${window.location.pathname}${window.location.search}${window.location.hash}`;
        console.warn('Redirecting to HTTPS:', httpsUrl);
        window.location.replace(httpsUrl);
      }
    }
  }, []);
};
