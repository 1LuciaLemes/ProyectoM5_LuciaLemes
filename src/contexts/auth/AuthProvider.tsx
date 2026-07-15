import { useEffect, useState } from "react";
import type { AuthUser } from "./auth.type";
import { AuthContext } from "./authContext.type";
import { auth } from "../../services/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getUserProfileService,
  logoutService,
  signInService,
  signUpService,
  signinWhitGoogleService,
} from "../../services/firebase/auth.service";

interface Props {
  children: React.ReactNode;
}
export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const profile = await getUserProfileService(firebaseUser.uid);
      setUser(profile);
      setLoading(false);
    });
    return unsuscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        loading: loading,
        signin: signInService,
        signup: signUpService,
        logout: logoutService,
        signinWhitGoogle: signinWhitGoogleService,
      }}
    >
        {children}
    </AuthContext.Provider>
  );
};
