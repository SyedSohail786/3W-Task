import { useEffect, useState } from 'react';

export const useWelcomeTour = () => {
  const [showClaimHelp, setShowClaimHelp] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setShowClaimHelp(true);
        localStorage.setItem('hasSeenTour', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleFirstClaim = () => {
    setShowClaimHelp(false);
    setHasClaimed(true);
  };

  return { showClaimHelp, hasClaimed, handleFirstClaim, setShowClaimHelp };
};