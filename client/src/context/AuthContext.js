import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (userData) => {
    // 🔄 แปลง userData ให้อยู่ในรูปแบบ flat
    const flattenedUser = {
      ...userData.user,   // กระจายข้อมูล user: id, name, email, role ฯลฯ
      token: userData.token // แนบ token มาด้วย
    };

    console.log('Logging in with:', flattenedUser);
    localStorage.setItem('user', JSON.stringify(flattenedUser));
    setUser(flattenedUser);
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    return user.role.toLowerCase() === requiredRole.toLowerCase();
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        console.log('Stored user data (raw):', storedUser);

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('Parsed user data:', parsedUser);

          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  console.log('AuthProvider rendering - current user:', user);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isLoading, 
        isAuthenticated,
        hasRole 
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
