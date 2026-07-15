import type { AuthUser } from "../../contexts/auth/auth.type";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup as firebaseSignInWithPopup,
  GoogleAuthProvider,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

const buildUserAuthWithDefaultRole = (user: FirebaseUser): AuthUser => {
  if (!user.email) {
    throw new Error("El usuario no tiene email asociado");
  }

  return {
    uid: user.uid,
    email: user.email,
    role: "customer",
  };
};

export const signUpService = async (email: string, password: string): Promise<AuthUser> => {
  const credentials = await createUserWithEmailAndPassword(auth, email, password);
  return buildUserAuthWithDefaultRole(credentials.user);
};

export const signInService = async (email: string, password: string): Promise<AuthUser> => {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return buildUserAuthWithDefaultRole(credentials.user);
};

export const logoutService = async (): Promise<void> => {
  await signOut(auth);
};

export const signInWithPopupService = async (): Promise<AuthUser> => {
  const result = await firebaseSignInWithPopup(auth, googleProvider);
  return buildUserAuthWithDefaultRole(result.user);
};

export const signinWhitGoogleService = async (): Promise<AuthUser> => {
  const result = await firebaseSignInWithPopup(auth, googleProvider);
  return buildUserAuthWithDefaultRole(result.user);
};

export const getUserProfileService = async (uid: string): Promise<AuthUser | null> => {
  const snapshot =  await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    uid,
    email: data.email,
    role: data.role,
  };
};
