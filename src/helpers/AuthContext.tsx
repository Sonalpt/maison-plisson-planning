import { createContext } from "react";

type AuthContextType = {
  authState: {
    username: string,
    nom_complet: string,
    fonction: string,
    id: number,
    isDirection: boolean,
    status: boolean,
  },
  setAuthState: (newAuthState: any) => void,
};

export const AuthContext = createContext<AuthContextType>({
  authState: {
    username: "",
    nom_complet: "",
    fonction: "",
    id: 0,
    isDirection: false,
    status: false,
  },
  setAuthState: () => {},
});
