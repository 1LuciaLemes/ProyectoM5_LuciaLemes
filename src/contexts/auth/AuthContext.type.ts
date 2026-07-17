import { createContext } from "react";
import type { AuthUser } from "./auth.type"

export type AuthContextType = {
    user: AuthUser | null;
    loading: boolean;

    signup: (name: string, email: string, password:string) => Promise<AuthUser>;
    signin: (email: string, password:string) => Promise<AuthUser>;
    signinWhitGoogle: () => Promise<AuthUser>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
