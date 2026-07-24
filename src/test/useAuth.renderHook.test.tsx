import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth/AuthProvider";
import { useAuth } from "@/contexts/auth/useAuth";

const mockOnAuthStateChanged = vi.fn();
const mockGetUserProfile = vi.fn();

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
  browserLocalPersistence: "LOCAL",
  setPersistence: vi.fn().mockResolvedValue(undefined),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock("@/services/firebase/firebase", () => ({
  auth: { mocked: true },
  db: { mocked: true },
}));

vi.mock("@/services/firebase/auth.service", () => ({
  getUserProfileService: (...args: unknown[]) => mockGetUserProfile(...args),
  signInService: vi.fn(),
  signUpService: vi.fn(),
  logoutService: vi.fn(),
  signinWhitGoogleService: vi.fn(),
}));

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
  };
}

describe("useAuth with renderHook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("inicia con user null y loading false después del auth check", async () => {
    mockOnAuthStateChanged.mockImplementation(
      (_auth: unknown, callback: (user: null) => void) => {
        callback(null);
        return vi.fn();
      },
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  test("setea el usuario cuando hay sesión activa", async () => {
    const mockUser = { uid: "u1", email: "test@mail.com" };

    mockOnAuthStateChanged.mockImplementation(
      (_auth: unknown, callback: (user: typeof mockUser) => void) => {
        callback(mockUser);
        return vi.fn();
      },
    );

    mockGetUserProfile.mockResolvedValue({
      uid: "u1",
      email: "test@mail.com",
      role: "customer",
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.user).toEqual({
        uid: "u1",
        email: "test@mail.com",
        role: "customer",
      });
    });

    expect(result.current.loading).toBe(false);
  });

  test("expone las funciones signin, signup, logout, signinWhitGoogle", async () => {
    mockOnAuthStateChanged.mockImplementation(
      (_auth: unknown, callback: (user: null) => void) => {
        callback(null);
        return vi.fn();
      },
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.signin).toBe("function");
    expect(typeof result.current.signup).toBe("function");
    expect(typeof result.current.logout).toBe("function");
    expect(typeof result.current.signinWhitGoogle).toBe("function");
  });
});
