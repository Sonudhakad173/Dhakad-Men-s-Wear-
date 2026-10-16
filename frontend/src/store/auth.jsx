import React, { useEffect, useMemo, useReducer } from "react";
import { AuthContext } from "./auth-context.js";

const STORAGE_KEY = "dhakad_session_v1";

function safeParse(value) {
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.email !== "string") return null;

    return {
      id: typeof parsed.id === "string" ? parsed.id : parsed.email,
      name: typeof parsed.name === "string" ? parsed.name : "Guest",
      email: parsed.email,
      role: parsed.role === "admin" ? "admin" : "customer",
    };
  } catch {
    return null;
  }
}

function loadInitial() {
  if (typeof window === "undefined") return { user: null };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null };
    return { user: safeParse(raw) };
  } catch {
    return { user: null };
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { user: action.user };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      if (!state.user) window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user));
    } catch {
      // ignore
    }
  }, [state.user]);

  const api = useMemo(() => {
    function login({ name, email, asAdmin = false }) {
      const user = {
        id: email,
        name: name?.trim() ? name.trim() : "Customer",
        email: email.trim().toLowerCase(),
        role: asAdmin ? "admin" : "customer",
      };
      dispatch({ type: "LOGIN", user });
      return user;
    }

    return {
      user: state.user,
      isAuthed: Boolean(state.user),
      isAdmin: state.user?.role === "admin",
      login,
      logout: () => dispatch({ type: "LOGOUT" }),
    };
  }, [state.user]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}
