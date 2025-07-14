import { motion } from 'framer-motion';
import { UserListItem } from './UserListItem';

export const UserList = ({ users, handleClaim, showClaimHelp }) => (
  <div className="flex-1 overflow-y-auto pr-2">
    {users.map(user => (
      <UserListItem 
        key={user._id}
        user={user}
        handleClaim={handleClaim}
        showClaimHelp={showClaimHelp && users.indexOf(user) === 0}
      />
    ))}
  </div>
);