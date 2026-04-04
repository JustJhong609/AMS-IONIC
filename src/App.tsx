import React, { useState, useEffect } from 'react';
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
import { supabase } from './utils/supabaseClient';
import { fetchLearners } from './utils/learnerApi';

setupIonicReact({ mode: 'md' });

const App: React.FC = () => {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLearnersLoading, setIsLearnersLoading] = useState(false);
  
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

  useEffect(() => {
    if (!authUser) {
      setLearners([]);
      return;
    }

    let isMounted = true;

    const loadLearners = async (showLoader = false) => {
      if (showLoader) {
        setIsLearnersLoading(true);
      }
      try {
        const data = await fetchLearners();
        if (isMounted) {
          setLearners(data);
        }
      } catch (error) {
        console.error('Failed to load learners:', error);
      } finally {
        if (isMounted && showLoader) {
          setIsLearnersLoading(false);
        }
      }
    };

    loadLearners(true);

    const channel = supabase
      .channel(`learners-live-${authUser.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'learners' },
        () => {
          loadLearners();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      setIsLearnersLoading(false);
      supabase.removeChannel(channel);
    };
  }, [authUser]);

  return (
    <AppContext.Provider value={{ learners, setLearners, user, setUser, loading, setLoading }}>
      <IonApp>
        <IonLoading
          isOpen={loading}
          message="Please wait..."
          spinner="crescent"
        />
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
      </IonApp>
    </AppContext.Provider>
  );
};

export default App;
