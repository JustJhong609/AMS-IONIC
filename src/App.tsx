import React, { useState } from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
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

setupIonicReact({ mode: 'md' });

const App: React.FC = () => {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [user, setUser] = useState<User | null>(null);

  return (
    <AppContext.Provider value={{ learners, setLearners, user, setUser }}>
      <IonApp>
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
