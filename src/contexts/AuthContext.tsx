import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

type UserRole = 'client' | 'admin' | 'operator';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (role: UserRole) => void;
    logout: () => void;
    register: (name: string, email: string) => void;
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

    const login = (role: UserRole) => {
        // Mock user data based on role
        const mockUser: User = {
            id: `user-${Date.now()}`,
            name: role === 'client' ? 'Dian Sastro' : role === 'admin' ? 'Admin Super' : 'Operator Agensi',
            email: role === 'client' ? 'dian@example.com' : `${role}@borneotrip.id`,
            role: role,
            avatar: `https://i.pravatar.cc/150?u=${role}`
        };

        setUser(mockUser);
        localStorage.setItem('borneotrip_user', JSON.stringify(mockUser));

        // Redirect based on role
        if (role === 'client') router.push('/dashboard/client');
        else router.push('/dashboard/admin');
    };

    const register = (name: string, email: string) => {
        const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            role: 'client',
            avatar: `https://i.pravatar.cc/150?u=${email}`
        };
        setUser(newUser);
        localStorage.setItem('borneotrip_user', JSON.stringify(newUser));
        router.push('/dashboard/client');
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
