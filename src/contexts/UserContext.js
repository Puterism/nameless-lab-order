import { createContext } from 'react';

const UserContext = createContext({
  user: null,
  pending: null,
  isAdmin: false,
});

export default UserContext;
