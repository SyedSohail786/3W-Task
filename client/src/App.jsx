import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiX, FiAward, FiUser } from 'react-icons/fi';

// Component imports
import { AddUserForm } from './components/AddUserForm';
import { ClaimPointsNotification } from './components/ClaimPointsNotification';
import { LeaderboardTable } from './components/LeaderboardTable';
import { TopThreePodium } from './components/TopThreePodium';
import { UserList } from './components/UserList';
import { useWelcomeTour } from './components/useWelcomeTour';

// Image imports (replace with your actual image paths)
import championMedal from '../src/assets/champion-medal.png';
import diamondMedal from '../src/assets/diamond-medal.png';
import platiniumMedal from '../src/assets/platinium-medal.png';

export default function App() {
  // State management
  const [users, setUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [claimNotification, setClaimNotification] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [previousRanks, setPreviousRanks] = useState({});

  // Welcome tour
  const { showClaimHelp, handleFirstClaim } = useWelcomeTour({});

  // API calls
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

      // Store previous ranks before updating
      const newRanks = {};
      res.data.forEach(user => {
        newRanks[user._id] = user.rank;
      });
      setPreviousRanks(newRanks);

      setLeaderboard(res.data);
      setIsLoading(false);
      return res.data;
    } catch (error) {
      toast.error('Failed to fetch leaderboard');
      return null;
    }
  };

  // Handlers
  const handleClaim = async (userId) => {
    try {
      const user = users.find(u => u._id === userId);
      const previousRank = previousRanks[userId];

      const res = await axios.post('http://localhost:5000/api/claim-points', { userId });
      const newLeaderboard = await fetchLeaderboard();

      if (newLeaderboard) {
        const currentUser = newLeaderboard.find(u => u._id === userId);
        const rankChanged = previousRank !== currentUser.rank;
        setClaimNotification({
          name: user.name,
          points: res.data.claimedPoints,
          rankChanged,
          newRank: currentUser.rank,
          previousRank
        });

        setTimeout(() => setClaimNotification(null), 4000);
        await fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to claim points');
      console.log(error.message);
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

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers(), fetchLeaderboard()]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper functions
  const makeLeaderboardEnable = () => {
    setActiveTab('leaderboard');
    fetchLeaderboard();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 font-sans flex flex-col">
      <Toaster position={isMobile ? "top-center" : "top-right"} />

      <ClaimPointsNotification
        claimNotification={claimNotification}
        setClaimNotification={setClaimNotification}
      />

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex flex-1">
          {/* Users Sidebar */}
          <div className="w-72 bg-white shadow-lg p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-indigo-800 flex items-center">
                <FiUser className="mr-2" /> Users
              </h2>
              <button
                onClick={() => setShowInput(!showInput)}
                className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                aria-label={showInput ? "Close add user" : "Add user"}
              >
                {showInput ? <FiX size={18} /> : <FiPlus size={18} />}
              </button>
            </div>

            <AddUserForm
              newUserName={newUserName}
              setNewUserName={setNewUserName}
              handleAddUser={handleAddUser}
              showInput={showInput}
              setShowInput={setShowInput}
            />

            <UserList
              users={users}
              handleClaim={handleClaim}
              showClaimHelp={showClaimHelp}
              handleFirstClaim={handleFirstClaim}
            />
          </div>

          {/* Leaderboard Content */}
          <div className="flex-1 p-8 overflow-auto">
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
                  <TopThreePodium
                    leaderboard={leaderboard}
                    championMedal={championMedal}
                    diamondMedal={diamondMedal}
                    platiniumMedal={platiniumMedal}
                    isMobile={isMobile}
                  />
                  <LeaderboardTable
                    leaderboard={leaderboard}
                    isLoading={isLoading}
                    isMobile={isMobile}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <MobileLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          makeLeaderboardEnable={makeLeaderboardEnable}
          showInput={showInput}
          setShowInput={setShowInput}
          newUserName={newUserName}
          setNewUserName={setNewUserName}
          handleAddUser={handleAddUser}
          users={users}
          handleClaim={handleClaim}
          isLoading={isLoading}
          leaderboard={leaderboard}
          championMedal={championMedal}
          diamondMedal={diamondMedal}
          platiniumMedal={platiniumMedal}
          showClaimHelp={showClaimHelp}
        />
      )}
    </div>
  );
}

const MobileLayout = ({
  activeTab,
  setActiveTab,
  makeLeaderboardEnable,
  showInput,
  setShowInput,
  newUserName,
  setNewUserName,
  handleAddUser,
  users,
  handleClaim,
  isLoading,
  leaderboard,
  championMedal,
  diamondMedal,
  platiniumMedal,
  showClaimHelp
}) => (
  <div className="flex-1 flex flex-col pb-16">
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
                  aria-label={showInput ? "Close add user" : "Add user"}
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

              <UserList
                users={users}
                handleClaim={handleClaim}
                showClaimHelp={showClaimHelp}
              />
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
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
                  <TopThreePodium
                    leaderboard={leaderboard}
                    championMedal={championMedal}
                    diamondMedal={diamondMedal}
                    platiniumMedal={platiniumMedal}
                    isMobile={true}
                  />
                  <LeaderboardTable leaderboard={leaderboard} isLoading={isLoading} />
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>

    {/* Bottom Tab Navigation (Mobile) */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-lg">
      <button
        onClick={() => setActiveTab('users')}
        className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'users' ? 'text-indigo-600' : 'text-gray-500'
          }`}
        aria-label="View users"
      >
        <FiUser size={20} />
        <span className="text-xs mt-1">Users</span>
      </button>
      <button
        onClick={makeLeaderboardEnable}
        className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'leaderboard' ? 'text-indigo-600' : 'text-gray-500'
          }`}
        aria-label="View leaderboard"
      >
        <FiAward size={20} />
        <span className="text-xs mt-1">Leaderboard</span>
      </button>
    </div>
  </div>
);