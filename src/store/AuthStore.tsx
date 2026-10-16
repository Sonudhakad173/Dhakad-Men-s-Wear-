import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "../data/types";
import { makeId } from "../lib/ids";
import { readJson, storageKeys, writeJson } from "../lib/storage";

type AuthApi = {
  user: User | null;
  login: (args: { email: string; password: string }) => User;
  signup: (args: { name: string; email: string; password: string }) => User;
  logout: () => void;
};

const AuthContext = createContext<AuthApi | null>(null);

function roleFor(email: string): User["role"] {
  return email.trim().toLowerCase() === "admin@dhakadmenswear.com" ? "admin" : "user";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readJson<User | null>(storageKeys.user, null));

  useEffect(() => {
    writeJson(storageKeys.user, user);
  }, [user]);

  const login = useCallback(({ email }: { email: string; password: string }) => {
    const u: User = {
      id: makeId("user"),
      name: email.split("@")[0] || "User",
      email,
      role: roleFor(email),
    };
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(({ name, email }: { name: string; email: string; password: string }) => {
    const u: User = {
      id: makeId("user"),
      name,
      email,
      role: roleFor(email),
    };
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const api = useMemo<AuthApi>(() => ({ user, login, signup, logout }), [user, login, signup, logout]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
