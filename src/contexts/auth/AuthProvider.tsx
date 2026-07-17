import { useEffect, useState } from "react";
import type { AuthUser } from "./auth.type";
import { AuthContext } from "./AuthContext.type";
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

      if (profile) {
        setUser(profile);
      } else if (firebaseUser.email) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: "customer",
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });
    return unsuscribe;
  }, []);

  const signupWithName = async (name: string, email: string, password: string) => {
    return signUpService(name, email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        loading: loading,
        signin: signInService,
        signup: signupWithName,
        logout: logoutService,
        signinWhitGoogle: signinWhitGoogleService,
      }}
    >
        {children}
    </AuthContext.Provider>
  );
};
