import { motion, AnimatePresence } from 'framer-motion';
import { FiZap } from 'react-icons/fi';

export const UserListItem = ({ user, handleClaim, showClaimHelp, hasClaimed }) => {
  const handleClaimClick = () => {
    handleClaim(user._id);
    // The WelcomeTour component should handle hiding after first claim
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
            className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors relative"
            title="Claim points"
            aria-label={`Claim points for ${user.name}`}
          >
            <FiZap size={16} />
            {showClaimHelp && !hasClaimed && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-75"></span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};