import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export const AddUserForm = ({ newUserName, setNewUserName, handleAddUser, showInput, setShowInput }) => (
  <AnimatePresence>
    {showInput && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="overflow-hidden mb-4"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter user name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="flex-1 p-2 border w-40 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
          />
          <button
            onClick={handleAddUser}
            className="px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            Add
          </button>
          <button
            onClick={() => setShowInput(false)}
            className="p-2 text-gray-500 hover:text-gray-700"
            aria-label="Cancel"
          >
            <FiX size={18} />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);