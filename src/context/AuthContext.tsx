import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, fetchProfile, getToken, setToken, clearToken } from "@/lib/api";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  loginUser: (token: string, user: User) => void;
  logout: () => void;
  setUser: (u: User) => void;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    fetchProfile()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const loginUser = (token: string, u: User) => { setToken(token); setUser(u); };
  const logout = () => { clearToken(); setUser(null); };

  return (
    <Ctx.Provider value={{ user, loading, loginUser, logout, setUser }}>
      {children}
    </Ctx.Provider>
  );
}
