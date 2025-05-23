import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
    
    if (!profile) {
      throw new Error("Profile not found");
    }
    
    return profile;
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const profile = await fetchUserProfile(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile.name,
            role: profile.role,
          });
          
          // Redirect based on role
          if (profile.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/employee');
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          await supabase.auth.signOut();
          setUser(null);
          navigate('/login');
          toast.error("Error loading user profile");
        }
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const profile = await fetchUserProfile(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile.name,
            role: profile.role,
          });
          
          // Redirect based on role
          if (profile.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/employee');
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          await supabase.auth.signOut();
          setUser(null);
          navigate('/login');
          toast.error("Error loading user profile");
        }
      } else {
        setUser(null);
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      if (!data.user) throw new Error("Login failed");

      const profile = await fetchUserProfile(data.user.id);
      
      setUser({
        id: data.user.id,
        email: data.user.email!,
        name: profile.name,
        role: profile.role,
      });

      toast.success("Logged in successfully");
      // Navigation is handled in the auth state change listener
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid email or password");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};