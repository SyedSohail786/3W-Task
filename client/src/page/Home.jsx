import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiX, FiAward, FiUser, FiZap } from 'react-icons/fi';

export default function App() {
  const [users, setUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/leaderboard');
      setLeaderboard(res.data);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to fetch leaderboard');
    }
  };

  const handleClaim = async (userId) => {
    try {
      await axios.post('http://localhost:5000/api/claim-points', { userId });
      await Promise.all([fetchUsers(), fetchLeaderboard()]);
      toast.success("Points claimed successfully!");
    } catch (error) {
      toast.error('Failed to claim points');
    }
  };

  const handleAddUser = async () => {
    if (!newUserName.trim()) {
      toast.error('Please enter a name');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/users/add', { name: newUserName });
      setNewUserName('');
      setShowInput(false);
      toast.success("User added successfully");
      await Promise.all([fetchUsers(), fetchLeaderboard()]);
    } catch (error) {
      toast.error('Failed to add user');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers(), fetchLeaderboard()]);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 font-sans flex">
      <Toaster position="top-right" />
      
      {/* Left Sidebar */}
      <div className="w-72 bg-white shadow-lg p-6 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-indigo-800 flex items-center">
            <FiUser className="mr-2" /> Users
          </h2>
          <button
            onClick={() => setShowInput(!showInput)}
            className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
          >
            {showInput ? <FiX size={18} /> : <FiPlus size={18} />}
          </button>
        </div>

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
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
                />
                <button
                  onClick={handleAddUser}
                  className="px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  Add
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto pr-2">
          {users.map(user => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
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
                    className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors"
                    title="Claim points"
                  >
                    <FiZap size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <FiAward className="text-yellow-500 mr-3" size={24} />
            <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="grid grid-cols-12 bg-indigo-600 text-white font-semibold p-4">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-8">Name</div>
                <div className="col-span-3 text-right">Points</div>
              </div>
              
              <AnimatePresence>
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`grid grid-cols-12 items-center p-4 border-b border-gray-100 hover:bg-gray-50 ${
                      index < 3 ? 'bg-gradient-to-r from-indigo-50 to-blue-50' : ''
                    }`}
                  >
                    <div className="col-span-1 flex justify-center">
                      {index === 0 ? (
                        <span className="w-8 h-8 flex items-center justify-center bg-yellow-400 text-white rounded-full">🥇</span>
                      ) : index === 1 ? (
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-300 text-white rounded-full">🥈</span>
                      ) : index === 2 ? (
                        <span className="w-8 h-8 flex items-center justify-center bg-amber-600 text-white rounded-full">🥉</span>
                      ) : (
                        <span className="text-gray-500">{user.rank}</span>
                      )}
                    </div>
                    <div className="col-span-8 font-medium text-gray-800">{user.name}</div>
                    <div className="col-span-3 text-right font-bold">
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800">
                        {user.totalPoints}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}