import { createContext, useContext } from "react";

export const CompareContext = createContext(null);

export function useCompare() {
  const value = useContext(CompareContext);
  if (!value) throw new Error("useCompare must be used within CompareProvider");
  return value;
}
