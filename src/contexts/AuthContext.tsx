import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

type UserRole = 'client' | 'admin' | 'operator';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    onboardingCompleted?: boolean;
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
            
            if (res.ok) {
                const data = await res.json();
                // Ensure avatar is set
                const userData = {
                    ...data,
                    avatar: data.avatar || `https://i.pravatar.cc/150?u=${data.email}`
                };
                setUser(userData);
                localStorage.setItem('borneotrip_user', JSON.stringify(userData));
                
                if (userData.role === 'admin' || userData.role === 'operator') {
                    router.push('/dashboard/admin');
                } else if (userData.role === 'mitra') {
                    router.push('/dashboard/partner');
                } else if (!userData.onboardingCompleted) {
                    router.push('/onboarding');
                } else {
                    router.push('/dashboard/client');
                }
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const loginSocial = (provider: string) => {
         // Mock Social Login - just treat as client
         const mockUser: User = {
            id: `social-${Date.now()}`,
            name: 'Dian Sastro',
            email: 'dian@example.com',
            role: 'client',
            avatar: `https://i.pravatar.cc/150?u=dian`
        };
        setUser(mockUser);
        localStorage.setItem('borneotrip_user', JSON.stringify(mockUser));
        router.push('/dashboard/client');
    }

    const register = async (name: string, email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (res.ok) {
                const data = await res.json();
                const userData = {
                    ...data,
                    avatar: `https://i.pravatar.cc/150?u=${data.email}`,
                    onboardingCompleted: false
                };
                setUser(userData);
                localStorage.setItem('borneotrip_user', JSON.stringify(userData));
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
        localStorage.removeItem('borneotrip_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
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
