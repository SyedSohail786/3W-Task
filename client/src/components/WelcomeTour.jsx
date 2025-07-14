import { useEffect, useState } from 'react';

export const WelcomeTour = ({ onComplete }) => {
  const [showClaimHelp, setShowClaimHelp] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setTimeout(() => {
        setShowClaimHelp(true);
        localStorage.setItem('hasSeenTour', 'true');
      }, 1500);
    }
  }, []);

  return { showClaimHelp };
};