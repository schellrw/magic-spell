import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Checking initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthContext: Error getting session:', error);
          if (mounted) setLoading(false);
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }

        if (session?.user) {
          console.log('AuthContext: User found, fetching profile...', session.user.id);
          await fetchProfile(session.user.id);
        } else {
          console.log('AuthContext: No user session found.');
          if (mounted) setLoading(false);
        }
      } catch (err) {
        console.error('AuthContext: Unexpected error during init:', err);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Auth state change:', event);
      
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      // Add a small timeout to prevent infinite hanging if Supabase is unresponsive
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Changed from .single() to .maybeSingle() to handle missing rows without error

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (error) {
        console.error('Error fetching profile:', error);
      }
      
      if (data) {
        setProfile(data);
      } else {
        // If no profile exists, create a default learner profile
        console.warn('No profile found for user, creating default...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            { id: userId, username: 'New Wizard', role: 'learner' }
          ])
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating default profile:', createError);
        } else {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'parent',
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen flex-col gap-4">
          <div className="text-2xl font-bold text-white animate-pulse">
            Loading Magic...
          </div>
          <button 
            onClick={() => setLoading(false)}
            className="text-white/50 hover:text-white text-sm underline"
          >
            Stuck? Click here to reset
          </button>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};
