import { useState, useEffect } from 'react';
import { auth } from 'configs/firebase';
// import { fetchAdminCustomClaim } from 'api';

function useAuth() {
  const [state, setState] = useState(() => {
    const user = auth.currentUser;
    return {
      pending: !user,
      user,
    };
  });

  const onChange = async (user) => {
    let isAdmin = false;
    if (user && user.uid) {
      try {
        const idTokenResult = await auth.currentUser.getIdTokenResult();
        isAdmin = !!idTokenResult.claims.admin;
      } catch (err) {
        console.log(err);
      }
      // const adminCustomClaim = await fetchAdminCustomClaim(user.uid);
      // const adminCustomClaim = { data: true };
      // isAdmin = adminCustomClaim.data;
    }
    setState({
      pending: false,
      user,
      isAdmin,
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(onChange);

    return () => unsubscribe();
  }, []);

  return state;
}

export default useAuth;
