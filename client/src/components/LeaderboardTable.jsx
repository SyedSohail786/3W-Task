import { motion } from 'framer-motion';

export const LeaderboardTable = ({ leaderboard, isLoading, isMobile }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Table Header - Now outside the scrollable area */}
      <div className={`grid ${isMobile ? 'grid-cols-12' : 'grid-cols-12'} bg-indigo-600 text-white font-semibold p-2 sticky top-0 z-10`}>
        <div className={`${isMobile ? 'col-span-3' : 'col-span-1'} text-center`}>Rank</div>
        <div className={`${isMobile ? 'col-span-6' : 'col-span-8'} pl-2 `}>Name</div>
        <div className={`${isMobile ? 'col-span-3' : 'col-span-3'} text-right pr-4`}>Points</div>
      </div>
      
      {/* Scrollable Table Body */}
      <div className={`${isMobile ? 'block max-h-[60vh] overflow-y-auto' : ''}`}>
        {leaderboard.slice(3).map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`grid ${isMobile ? 'grid-cols-12' : 'grid-cols-12'} items-center p-3 border-b border-gray-100 hover:bg-gray-50`}
          >
            {/* Rank Column */}
            <div className={`${isMobile ? 'col-span-3' : 'col-span-1'} flex justify-center`}>
              <span className="text-gray-500">{index + 4}</span>
            </div>
            
            {/* Name Column */}
            <div className={`${isMobile ? 'col-span-6' : 'col-span-8'} font-medium text-gray-800 pl-2`}>
              {user.name}
            </div>
            
            {/* Points Column */}
            <div className={`${isMobile ? 'col-span-3' : 'col-span-3'} text-right font-bold pr-4`}>
              <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                {user.totalPoints}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};