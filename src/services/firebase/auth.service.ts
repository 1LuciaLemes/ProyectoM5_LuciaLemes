import type { AuthUser } from "../../contexts/auth/auth.type";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup as firebaseSignInWithPopup,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

const ensureUserProfile = async (user: FirebaseUser, name?: string) => {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const email = user.email;
    if (!email) {
      throw new Error("El usuario no tiene email asociado");
    }

    await setDoc(userRef, {
      email,
      role: "customer",
      name: name ?? user.displayName ?? "",
    });
  }
};

export const signUpService = async (name: string, email: string, password: string): Promise<AuthUser> => {
  await setPersistence(auth, browserLocalPersistence);
  const credentials = await createUserWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(credentials.user, name);
  return buildUserAuthWithDefaultRole(credentials.user);
};

export const signInService = async (email: string, password: string): Promise<AuthUser> => {
  await setPersistence(auth, browserLocalPersistence);
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(credentials.user);
  return buildUserAuthWithDefaultRole(credentials.user);
};

export const logoutService = async (): Promise<void> => {
  await signOut(auth);
};

export const signInWithPopupService = async (): Promise<AuthUser> => {
  await setPersistence(auth, browserLocalPersistence);
  const result = await firebaseSignInWithPopup(auth, googleProvider);
  await ensureUserProfile(result.user);
  return buildUserAuthWithDefaultRole(result.user);
};

export const signinWhitGoogleService = async (): Promise<AuthUser> => {
  await setPersistence(auth, browserLocalPersistence);
  const result = await firebaseSignInWithPopup(auth, googleProvider);
  await ensureUserProfile(result.user);
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
