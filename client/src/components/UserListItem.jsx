import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiZap } from 'react-icons/fi';
import { ImSpinner8 } from 'react-icons/im'; 

export const UserListItem = ({ user, handleClaim, showClaimHelp, hasClaimed }) => {
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaimClick = async () => {
    setIsClaiming(true);
    await handleClaim(user._id);
    setIsClaiming(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
    >
      <AnimatePresence>
        {showClaimHelp && !hasClaimed && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute -top-8 right-0 z-10"
          >
            <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center shadow-lg">
              <FiZap className="mr-1.5" />
              <span>Tap to claim points!</span>
              <div className="absolute bottom-0 right-3 w-3 h-3 bg-indigo-600 transform rotate-45 -mb-1.5"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500">ID: {user._id.slice(-4)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            {user.totalPoints} pts
          </span>
          <button
            onClick={handleClaimClick}
            disabled={isClaiming}
            className={`p-2 rounded-full hover:bg-purple-200 transition-colors relative ${
              isClaiming ? 'bg-purple-200' : 'bg-purple-100 text-purple-600'
            }`}
            title="Claim points"
            aria-label={`Claim points for ${user.name}`}
          >
            {isClaiming ? (
              <ImSpinner8 className="animate-spin" size={16} />
            ) : (
              <FiZap size={16} />
            )}
            {showClaimHelp && !hasClaimed && !isClaiming && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-75"></span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};