import { createContext, useContext, useState, ReactNode } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UserProfile {
    username: string;
    fullName: string;
    email: string;
    grade: string;
    province: string;
    district: string;
    avatar: string | null;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: UserProfile | null;
    isProfileComplete: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    completeProfile: (data: UserProfile) => void;
    logout: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    isProfileComplete: false,
    login: async () => false,
    completeProfile: () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(() => {
        try {
            const stored = localStorage.getItem("mindup_user");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [isProfileComplete, setIsProfileComplete] = useState(() => {
        return localStorage.getItem("mindup_profile_complete") === "true";
    });

    const isAuthenticated = user !== null;

    // login() kept for compatibility (e.g. RegisterPage links) — always succeeds
    const login = async (_email: string, _password: string): Promise<boolean> => {
        return true;
    };

    const completeProfile = (data: UserProfile) => {
        setUser(data);
        setIsProfileComplete(true);
        localStorage.setItem("mindup_user", JSON.stringify(data));
        localStorage.setItem("mindup_profile_complete", "true");
    };

    const logout = () => {
        setUser(null);
        setIsProfileComplete(false);
        localStorage.removeItem("mindup_user");
        localStorage.removeItem("mindup_profile_complete");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isProfileComplete, login, completeProfile, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
