import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';

export const UserListItem = ({ user, handleClaim, showClaimHelp }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
  >
    {showClaimHelp && (
      <div className="absolute -top-2 -right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
        Click here to claim points!
      </div>
    )}
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
          onClick={() => handleClaim(user._id)}
          className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors relative"
          title="Claim points"
          aria-label={`Claim points for ${user.name}`}
        >
          <FiZap size={16} />
        </button>
      </div>
    </div>
  </motion.div>
);