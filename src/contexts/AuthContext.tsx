import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

type UserRole = 'client' | 'admin' | 'mitra'; // Changed operator to mitra to match DB

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    onboardingCompleted?: boolean;
    preferences?: any;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    loginSocial: (provider: string) => void;
    updateUserProfile: (data: Partial<User>) => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    // Check auth on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('bt_token');
        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken);
        }
    }, []);

    const fetchUser = async (authToken: string) => {
        try {
            const res = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.data);
            } else {
                logout(); // Invalid token
            }
        } catch (e) {
            console.error(e);
            logout();
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (data.success) {
                const { user, token } = data.data;
                setUser(user);
                setToken(token);
                localStorage.setItem('bt_token', token);
                
                // Redirect based on role
                if (user.role === 'admin') router.push('/dashboard/admin');
                else if (user.role === 'mitra') router.push('/dashboard/partner');
                else router.push('/dashboard/client');
                
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (data.success) {
                const { user, token } = data.data;
                setUser(user);
                setToken(token);
                localStorage.setItem('bt_token', token);
                router.push('/onboarding');
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('bt_token');
        router.push('/login');
    };

    const loginSocial = (provider: string) => {
        // Not implemented on backend yet
        console.log('Social login not implemented');
    };

    const updateUserProfile = (data: Partial<User>) => {
        // Optimistic update
        if (user) {
            setUser({ ...user, ...data });
        }
        // TODO: Call API to update profile
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register, loginSocial, updateUserProfile, token }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
