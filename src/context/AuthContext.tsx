import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    user: { name: string; email: string } | null;
    isProfileComplete: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    completeProfile: (data: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    isProfileComplete: false,
    login: async () => false,
    completeProfile: () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
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

    const login = async (email: string, password: string): Promise<boolean> => {
        // Demo credentials — replace with real API in production
        if (email === "user@mindup.lk" && password === "mindup123") {
            const userData = { name: "User", email };
            setUser(userData);
            localStorage.setItem("mindup_user", JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const completeProfile = (data: any) => {
        setIsProfileComplete(true);
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
