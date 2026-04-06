import React, { useState, useEffect, useCallback } from 'react';
import { IonApp, setupIonicReact, IonLoading } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Learner, User } from './types';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import LearnerListPage from './pages/LearnerListPage';
import LearnerFormPage from './pages/LearnerFormPage';
import LearnerDetailPage from './pages/LearnerDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { AppContext } from './context/AppContext';
import { useAuth } from './utils/useAuth';
import { hasSupabaseConfig, supabase } from './utils/supabaseClient';
import { fetchLearners, getPendingSyncCount, syncPendingLearners } from './utils/learnerApi';

setupIonicReact({ mode: 'md' });

const App: React.FC = () => {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLearnersLoading, setIsLearnersLoading] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { user: authUser, loading: authLoading } = useAuth((authUser) => {
    if (authUser) {
      setUser({
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
      });
    } else {
      setUser(null);
    }
  });

  useEffect(() => {
    setLoading(authLoading || isLearnersLoading);
  }, [authLoading, isLearnersLoading]);

  const refreshPendingSyncCount = useCallback(async () => {
    const count = await getPendingSyncCount();
    setPendingSyncCount(count);
  }, []);

  const loadLearners = useCallback(
    async (showLoader = false) => {
      if (!authUser) {
        setLearners([]);
        void refreshPendingSyncCount();
        return;
      }

      if (showLoader) {
        setIsLearnersLoading(true);
      }

      try {
        const data = await fetchLearners();
        setLearners(data);
      } catch (error) {
        console.error('Failed to load learners:', error);
      } finally {
        if (showLoader) {
          setIsLearnersLoading(false);
        }
        void refreshPendingSyncCount();
      }
    },
    [authUser, refreshPendingSyncCount],
  );

  const syncNow = useCallback(async () => {
    if (!authUser || isSyncing) {
      void refreshPendingSyncCount();
      return;
    }

    setIsSyncing(true);
    try {
      const result = await syncPendingLearners();
      if (result.synced > 0) {
        await loadLearners(false);
      }
    } catch (error) {
      console.error('Failed to sync pending learners:', error);
    } finally {
      setIsSyncing(false);
      void refreshPendingSyncCount();
    }
  }, [authUser, isSyncing, loadLearners, refreshPendingSyncCount]);

  useEffect(() => {
    if (!authUser) {
      setLearners([]);
      void refreshPendingSyncCount();
      return;
    }

    let isMounted = true;

    void loadLearners(true);
    void syncNow();

    const channel = supabase
      .channel(`learners-live-${authUser.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'learners' },
        () => {
          if (isMounted) {
            void loadLearners();
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      setIsLearnersLoading(false);
      supabase.removeChannel(channel);
    };
  }, [authUser, loadLearners, refreshPendingSyncCount, syncNow]);

  useEffect(() => {
    if (!authUser || typeof window === 'undefined') return;

    const handleOnline = () => {
      void syncNow();
      void loadLearners();
    };

    window.addEventListener('online', handleOnline);

    const interval = window.setInterval(() => {
      if (navigator.onLine) {
        void syncNow();
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.clearInterval(interval);
    };
  }, [authUser, loadLearners, syncNow]);

  return (
    <AppContext.Provider
      value={{
        learners,
        setLearners,
        user,
        setUser,
        loading,
        setLoading,
        pendingSyncCount,
        isSyncing,
        syncNow,
      }}
    >
      <IonApp>
        {!hasSupabaseConfig && (
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            background: 'linear-gradient(160deg, #1565C0 0%, #0d47a1 55%, #1a237e 100%)',
            color: '#fff',
            fontFamily: 'system-ui, sans-serif',
          }}>
            <div style={{ maxWidth: 520 }}>
              <h1 style={{ marginBottom: 12 }}>Supabase configuration required</h1>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Set <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in your Vercel project settings.
                The app will not run until those environment variables are available.
              </p>
            </div>
          </div>
        )}
        <IonLoading
          isOpen={loading}
          message="Please wait..."
          spinner="crescent"
        />
        {hasSupabaseConfig && (
          <IonReactRouter>
            <Switch>
              <Route exact path="/login">
                {user ? <Redirect to="/home" /> : <LoginPage />}
              </Route>

              <Route exact path="/home">
                {user ? <HomePage /> : <Redirect to="/login" />}
              </Route>
              <Route exact path="/learners">
                {user ? <LearnerListPage /> : <Redirect to="/login" />}
              </Route>
              <Route exact path="/learners/new">
                {user ? <LearnerFormPage /> : <Redirect to="/login" />}
              </Route>
              <Route exact path="/learners/edit/:id">
                {user ? <LearnerFormPage /> : <Redirect to="/login" />}
              </Route>
              <Route exact path="/learners/:id">
                {user ? <LearnerDetailPage /> : <Redirect to="/login" />}
              </Route>
              <Route exact path="/analytics">
                {user ? <AnalyticsPage /> : <Redirect to="/login" />}
              </Route>

              <Redirect to={user ? '/home' : '/login'} />
            </Switch>
          </IonReactRouter>
        )}
      </IonApp>
    </AppContext.Provider>
  );
};

export default App;
