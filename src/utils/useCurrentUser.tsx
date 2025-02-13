"use client";
import User from "./localstorage";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  token: string | undefined;
  user: User;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const user = new User(setToken);

  useEffect(() => {
    setToken(user.data.firebaseToken);
  }, []);

  return (
    <UserContext.Provider value={{ token, user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within a UserProvider");
  }
  return context;
};
