// App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [users, setUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/users');
    setUsers(res.data);
  };

  const fetchLeaderboard = async () => {
    const res = await axios.get('http://localhost:5000/api/users/leaderboard');
    setLeaderboard(res.data);
  };

  const handleClaim = async (userId) => {
    try {
      await axios.post('http://localhost:5000/api/claim-points', { userId });
      fetchUsers();        // Optional if you need to show user-specific data
      fetchLeaderboard();  // Update rankings after claiming
    } catch (err) {
      alert('Error claiming points');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial' }}>
      
      {/* LEFT: Users with Claim Button */}
      <div style={{ width: '20%', borderRight: '1px solid #ccc', padding: '20px' }}>
        <h3>Users</h3>
        {users.map(user => (
          <div key={user._id} style={{ marginBottom: '15px' }}>
            <div><strong>{user.name}</strong></div>
            <button onClick={() => handleClaim(user._id)}>Claim</button>
          </div>
        ))}
      </div>

      {/* RIGHT: Leaderboard */}
      <div style={{ width: '80%', padding: '20px' }}>
        <h2>Leaderboard</h2>
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={index}>
                <td>{user.rank}</td>
                <td>{user.name}</td>
                <td>{user.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Home;
