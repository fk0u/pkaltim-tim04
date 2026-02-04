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
    phone?: string;
    idNumber?: string;
    bio?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, callbackUrl?: string) => Promise<{ success: boolean; error?: string }>; // Return success/fail
    logout: () => void;
    register: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>;
    loginSocial: (provider: string) => void;
    updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Session check failed', error);
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();
    }, []);

    const updateUserProfile = (data: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...data });
        }
    };


    const login = async (email: string, password: string, callbackUrl?: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                return { success: false, error: data.message || 'Login gagal' };
            }

            // Cookie is set by API, just update local state
            setUser(data.user);

            // Redirect based on role or callback
            if (callbackUrl && callbackUrl.startsWith('/')) {
                router.push(callbackUrl);
            } else if (data.user.role === 'admin' || data.user.role === 'Admin') {
                router.push('/dashboard/admin');
            } else if (data.user.role === 'mitra') {
                router.push('/dashboard/partner');
            } else {
                router.push('/dashboard/client');
            }
            return { success: true };
        } catch (e) {
            console.error('Login error:', e);
            return { success: false, error: 'Kesalahan jaringan. Silakan coba lagi.' };
        }
    };

    const loginSocial = (provider: string) => {
        // Future implementation: Backend OAuth
        console.log(`Social login with ${provider} not yet implemented on backend.`);
    }

    const register = async (name: string, email: string, password: string, role: string = 'client') => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                return { success: false, error: data.message || 'Registrasi gagal' };
            }

            setUser(data.user);

            // Redirect based on role
            if (role === 'mitra') {
                router.push('/dashboard/partner/onboarding');
            } else {
                router.push('/onboarding');
            }

            return { success: true };
        } catch (e) {
            console.error('Registration error:', e);
            return { success: false, error: 'Kesalahan jaringan. Silakan coba lagi.' };
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, register, loginSocial, updateUserProfile }}>
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
