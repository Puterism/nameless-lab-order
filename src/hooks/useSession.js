import { useContext } from 'react';
import UserContext from 'contexts/UserContext';

const useSession = () => {
  const { pending, user, isAdmin } = useContext(UserContext);
  return { pending, user, isAdmin };
};

export default useSession;
