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
        // MOCK LOGIN WITHOUT DB
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Allow generic login or specific mock
            const mockUser: User = {
                id: 'mock-user-1',
                name: 'Pengguna Demo',
                email: email,
                role: 'client',
                avatar: `https://i.pravatar.cc/150?u=${email}`,
                onboardingCompleted: true
            };

            // Special case for admin login
            if (email.includes('admin')) {
                mockUser.role = 'admin';
                mockUser.name = 'Admin Demo';
            } else if (email.includes('mitra')) {
                mockUser.role = 'mitra' as any; // Cast temporarily if type issues exist
                mockUser.name = 'Mitra Demo';
            }

            setUser(mockUser);
            localStorage.setItem('borneotrip_user', JSON.stringify(mockUser));

            if (mockUser.role === 'admin' || mockUser.role === 'operator') {
                router.push('/dashboard/admin');
            } else if (mockUser.role === 'mitra' as any) {
                router.push('/dashboard/partner');
            } else {
                router.push('/dashboard/client');
            }
            return true;
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
            avatar: `https://i.pravatar.cc/150?u=dian`,
            onboardingCompleted: true
        };
        setUser(mockUser);
        localStorage.setItem('borneotrip_user', JSON.stringify(mockUser));
        router.push('/dashboard/client');
    }

    const register = async (name: string, email: string, password: string) => {
        // MOCK REGISTER WITHOUT DB
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const userData: User = {
                id: `user-${Date.now()}`,
                name,
                email,
                role: 'client',
                avatar: `https://i.pravatar.cc/150?u=${email}`,
                onboardingCompleted: false // New users need onboarding
            };
            setUser(userData);
            localStorage.setItem('borneotrip_user', JSON.stringify(userData));
            router.push('/onboarding');
            return true;
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
