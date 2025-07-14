import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiX, FiAward, FiUser, FiZap, FiCheckCircle } from 'react-icons/fi';

export default function App() {
  const [users, setUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [claimNotification, setClaimNotification] = useState(null);

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
      const res = await axios.post('http://localhost:5000/api/claim-points', { userId });
      const user = users.find(u => u._id === userId);
      setClaimNotification({
        name: user.name,
        points: res.data.claimedPoints
      });
      await Promise.all([fetchUsers(), fetchLeaderboard()]);
      setTimeout(() => setClaimNotification(null), 3000);
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const makeLeaderboardEnable = () => {
    setActiveTab('leaderboard');
    fetchLeaderboard();
  };

  const renderTopThree = () => {
    if (leaderboard.length < 3) return null;
    
    return (
      <div className="relative mb-8 mt-4">
        {/* Second place (left) */}
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 0.9, y: 0 }}
          className="absolute left-4 top-12 z-10"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-300 rounded-full flex flex-col items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">2</span>
            <p className="text-xs text-white text-center mt-1 truncate w-full px-1">
              {leaderboard[1]?.name}
            </p>
          </div>
          <div className="text-center mt-2 text-gray-700 font-semibold">
            {leaderboard[1]?.totalPoints} pts
          </div>
        </motion.div>

        {/* First place (center) */}
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1.1, y: 0 }}
          className="relative z-20 mx-auto w-24 h-24 md:w-32 md:h-32 bg-yellow-400 rounded-full flex flex-col items-center justify-center shadow-xl"
        >
          <span className="text-white text-2xl font-bold">1</span>
          <p className="text-sm text-white text-center mt-1 font-medium truncate w-full px-2">
            {leaderboard[0]?.name}
          </p>
        </motion.div>
        <div className="text-center mt-2 text-gray-800 font-bold text-lg">
          {leaderboard[0]?.totalPoints} pts
        </div>

        {/* Third place (right) */}
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 0.9, y: 0 }}
          className="absolute right-4 top-12 z-10"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-600 rounded-full flex flex-col items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">3</span>
            <p className="text-xs text-white text-center mt-1 truncate w-full px-1">
              {leaderboard[2]?.name}
            </p>
          </div>
          <div className="text-center mt-2 text-gray-700 font-semibold">
            {leaderboard[2]?.totalPoints} pts
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 font-sans flex flex-col">
      <Toaster position={isMobile ? "top-center" : "top-right"} />
      
      {/* Claim Points Notification */}
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
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold text-indigo-600">{claimNotification.name}</span> claimed{' '}
                  <span className="font-bold text-green-600">{claimNotification.points} points</span>!
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Keep it up! You're climbing the leaderboard! 🚀
                </p>
                <button
                  onClick={() => setClaimNotification(null)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Awesome!
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex flex-1">
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
                      className="w-45 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
                    />
                    <button
                      onClick={handleAddUser}
                      className="px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      +
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
              <div className="flex items-center mb-4">
                <FiAward className="text-yellow-500 mr-3" size={24} />
                <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <>
                  {renderTopThree()}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="grid grid-cols-12 bg-indigo-600 text-white font-semibold p-4">
                      <div className="col-span-1 text-center">Rank</div>
                      <div className="col-span-8">Name</div>
                      <div className="col-span-3 text-right">Points</div>
                    </div>
                    
                    {leaderboard.slice(3).map((user, index) => (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`grid grid-cols-12 items-center p-4 border-b border-gray-100 hover:bg-gray-50`}
                      >
                        <div className="col-span-1 flex justify-center">
                          <span className="text-gray-500">{index + 4}</span>
                        </div>
                        <div className="col-span-8 font-medium text-gray-800">{user.name}</div>
                        <div className="col-span-3 text-right font-bold">
                          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800">
                            {user.totalPoints}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <div className="flex-1 flex flex-col pb-16">
          {/* Tab Content with Slide Animation */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={activeTab}
                initial={{ x: activeTab === 'users' ? -300 : 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: activeTab === 'users' ? 300 : -300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-0 p-4"
              >
                {activeTab === 'users' ? (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
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
                              +
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex-1 overflow-y-auto">
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
                ) : (
                  <div className="h-full">
                    <div className="flex items-center mb-4">
                      <FiAward className="text-yellow-500 mr-3" size={24} />
                      <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
                    </div>

                    {isLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                      </div>
                    ) : (
                      <>
                        {renderTopThree()}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                          <div className="grid grid-cols-12 bg-indigo-600 text-white font-semibold p-3">
                            <div className="col-span-2 text-center">Rank</div>
                            <div className="col-span-7">Name</div>
                            <div className="col-span-3 text-right">Points</div>
                          </div>
                          
                          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                            {leaderboard.slice(3).map((user, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={`grid grid-cols-12 items-center p-3 border-b border-gray-100 hover:bg-gray-50`}
                              >
                                <div className="col-span-2 flex justify-center">
                                  <span className="text-gray-500 text-sm">{index + 4}</span>
                                </div>
                                <div className="col-span-7 font-medium text-gray-800 text-sm truncate">
                                  {user.name}
                                </div>
                                <div className="col-span-3 text-right font-bold">
                                  <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                                    {user.totalPoints}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Tab Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-lg">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex flex-col items-center justify-center w-full h-full ${
                activeTab === 'users' ? 'text-indigo-600' : 'text-gray-500'
              }`}
            >
              <FiUser size={20} />
              <span className="text-xs mt-1">Users</span>
            </button>
            <button
              onClick={makeLeaderboardEnable}
              className={`flex flex-col items-center justify-center w-full h-full ${
                activeTab === 'leaderboard' ? 'text-indigo-600' : 'text-gray-500'
              }`}
            >
              <FiAward size={20} />
              <span className="text-xs mt-1">Leaderboard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}