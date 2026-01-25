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
    preferences?: any;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>; 
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    loginSocial: (provider: string) => void;
    updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Load user/token from local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('borneotrip_user');
        const token = localStorage.getItem('borneotrip_token');
        if (storedUser && token) {
            setUser({ ...JSON.parse(storedUser), token });
            // Optionally verify token with /api/auth/me here
        }
    }, []);

    const updateUserProfile = async (data: Partial<User>) => {
        if (user && user.token) {
             try {
                const res = await fetch('/api/user/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify(data)
                });
                
                if (res.ok) {
                    const updatedUser = await res.json();
                    const mergedUser = { ...user, ...updatedUser, token: user.token };
                    setUser(mergedUser);
                    localStorage.setItem('borneotrip_user', JSON.stringify(mergedUser));
                }
             } catch (e) {
                 console.error('Update profile failed', e);
             }
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
            const userWithToken = { ...userData, token };
            
            setUser(userWithToken);
            localStorage.setItem('borneotrip_user', JSON.stringify(userData));
            localStorage.setItem('borneotrip_token', token);
            
            if (userData.role === 'admin' || userData.role === 'operator') {
                router.push('/dashboard/admin');
            } else if (userData.role === 'mitra') {
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
        console.log('Social login not implemented yet', provider);
    }

    const register = async (name: string, email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (!res.ok) {
                return false;
            }
            
            // Auto login or redirect to login?
            // Original code redirected to onboarding.
            // Let's redirect to login for security or auto-login if token returned (register usually doesn't return token unless designed so).
            // My register API implementation returns user object WITHOUT token (Step 101).
            // So redirect to login.
            
            router.push('/login');
            return true;
        } catch (e) {
            console.error(e);
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
