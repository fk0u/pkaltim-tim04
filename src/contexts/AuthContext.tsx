import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

type UserRole = 'client' | 'admin' | 'operator' | 'mitra';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    onboardingCompleted?: boolean;
    joinDate?: string;
    totalSpent?: number;
    status?: 'Active' | 'Inactive';
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>; // Return success/fail
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    loginSocial: (provider: string) => void;
    updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Load user from local storage on mount (simple persistence)
    useEffect(() => {
        const storedUser = localStorage.getItem('borneotrip_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const updateUserProfile = (data: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            localStorage.setItem('borneotrip_user', JSON.stringify(updatedUser));
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

            if (!res.ok) {
                console.error(data.message);
                return false;
            }

            const { user: userData, token } = data;

            setUser(userData);
            localStorage.setItem('borneotrip_user', JSON.stringify(userData));
            localStorage.setItem('borneotrip_token', token);

            // Redirect based on role
            if (userData.role === 'admin' || userData.role === 'Admin') {
                router.push('/dashboard/admin');
            } else if (userData.role === 'mitra') {
                router.push('/dashboard/partner');
            } else {
                router.push('/dashboard/client');
            }
            return true;
        } catch (e) {
            console.error('Login error:', e);
            return false;
        }
    };

    const loginSocial = (provider: string) => {
        // Future implementation: Backend OAuth
        console.log(`Social login with ${provider} not yet implemented on backend.`);
    }

    const register = async (name: string, email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role: 'client' })
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                return false;
            }

            // Auto login after register
            const { user: userData, token } = data;

            setUser(userData);
            localStorage.setItem('borneotrip_user', JSON.stringify(userData));
            localStorage.setItem('borneotrip_token', token);

            router.push('/onboarding');
            return true;
        } catch (e) {
            console.error('Registration error:', e);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('borneotrip_user');
        localStorage.removeItem('borneotrip_token');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register, loginSocial, updateUserProfile }}>
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
