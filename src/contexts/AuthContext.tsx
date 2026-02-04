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
<<<<<<< HEAD
    preferences?: any;
    token?: string;
=======
    joinDate?: string;
    totalSpent?: number;
    status?: 'Active' | 'Inactive';
    phone?: string;
    idNumber?: string;
    bio?: string;
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
<<<<<<< HEAD
    login: (email: string, password: string) => Promise<boolean>; 
=======
    isLoading: boolean;
    login: (email: string, password: string, callbackUrl?: string) => Promise<{ success: boolean; error?: string }>; // Return success/fail
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18
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

<<<<<<< HEAD
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
=======
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
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
<<<<<<< HEAD
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
=======
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
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18
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
<<<<<<< HEAD
        console.log('Social login not implemented yet', provider);
    }

    const register = async (name: string, email: string, password: string) => {
=======
        // Future implementation: Backend OAuth
        console.log(`Social login with ${provider} not yet implemented on backend.`);
    }

    const register = async (name: string, email: string, password: string, role: string = 'client') => {
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
<<<<<<< HEAD
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
=======
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
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18
        } catch (e) {
            console.error('Registration error:', e);
            return { success: false, error: 'Kesalahan jaringan. Silakan coba lagi.' };
        }
    };

<<<<<<< HEAD
    const logout = () => {
        setUser(null);
        localStorage.removeItem('borneotrip_user');
        localStorage.removeItem('borneotrip_token');
        router.push('/login');
=======
    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18
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
