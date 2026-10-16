import { createContext, useContext } from "react";

export const RecentContext = createContext(null);

export function useRecent() {
  const value = useContext(RecentContext);
  if (!value) throw new Error("useRecent must be used within RecentProvider");
  return value;
}
