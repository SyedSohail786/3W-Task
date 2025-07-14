import { motion } from 'framer-motion';

export const TopThreePodium = ({ leaderboard, championMedal, diamondMedal, platiniumMedal, isMobile }) => {
  if (leaderboard.length < 3) return null;
  
  const sizes = isMobile 
    ? { first: 'w-20 h-20', second: 'w-16 h-16', third: 'w-16 h-16' }
    : { first: 'w-28 h-28 md:w-32 md:h-32', second: 'w-20 h-20 md:w-24 md:h-24', third: 'w-20 h-20 md:w-24 md:h-24' };

  return (
    <div className="relative mb-8 mt-8 w-full">
      {/* Second place (left) - Adjusted positioning */}
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 0.9, y: 0 }}
        className="absolute left-0 top-12 z-10 flex flex-col items-center"
        style={{ width: '33%' }}
      >
        <img 
          src={diamondMedal} 
          alt="Silver Medal" 
          className={`${sizes.second} object-contain`}
        />
        <div className="text-center mt-2 w-full px-2">
          <p className="font-semibold text-gray-800 truncate">{leaderboard[1]?.name}</p>
          <p className="text-gray-600 text-sm">{leaderboard[1]?.totalPoints} pts</p>
        </div>
      </motion.div>

      {/* First place (center) - Centered properly */}
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1.1, y: 0 }}
        className="relative z-20 mx-auto flex flex-col items-center"
        style={{ width: '34%' }}
      >
        <img 
          src={championMedal} 
          alt="Gold Medal" 
          className={`${sizes.first} object-contain`}
        />
        <div className="text-center mt-2 w-full px-2">
          <p className="font-bold text-gray-900 text-lg truncate">{leaderboard[0]?.name}</p>
          <p className="text-gray-700 font-semibold text-sm">{leaderboard[0]?.totalPoints} pts</p>
        </div>
      </motion.div>

      {/* Third place (right) - Adjusted positioning */}
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 0.9, y: 0 }}
        className="absolute right-0 top-12 z-10 flex flex-col items-center"
        style={{ width: '33%' }}
      >
        <img 
          src={platiniumMedal} 
          alt="Bronze Medal" 
          className={`${sizes.third} object-contain`}
        />
        <div className="text-center mt-2 w-full px-2">
          <p className="font-semibold text-gray-800 truncate">{leaderboard[2]?.name}</p>
          <p className="text-gray-600 text-sm">{leaderboard[2]?.totalPoints} pts</p>
        </div>
      </motion.div>
    </div>
  );
};