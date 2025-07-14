import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiArrowUp } from 'react-icons/fi';

export const ClaimPointsNotification = ({ claimNotification, setClaimNotification }) => (
  <AnimatePresence>
    {claimNotification && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border-2 border-green-300">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiCheckCircle className="text-green-500 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">🎉 Congratulations!</h3>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold text-indigo-600">{claimNotification.name}</span> claimed{' '}
              <span className="font-bold text-green-600">{claimNotification.points} points</span>!
            </p>
            
            {claimNotification.rankChanged && (
              <div className="flex items-center justify-center bg-blue-50 rounded-lg p-2 mb-3">
                <FiArrowUp className="text-blue-500 mr-1" />
                <span className="text-blue-700 font-medium text-sm">
                  Rank improved from {claimNotification.previousRank} to {claimNotification.newRank}!
                </span>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mb-4">
              {claimNotification.rankChanged 
                ? "Keep climbing! You're doing amazing! ✨" 
                : "Keep it up! You're getting closer to the top! 💪"}
            </p>
            <button
              onClick={() => setClaimNotification(null)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);