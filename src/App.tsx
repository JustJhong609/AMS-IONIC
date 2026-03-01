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
            {!user ? (
              <>
                <Route exact path="/login">
                  <LoginPage />
                </Route>
                <Redirect to="/login" />
              </>
            ) : (
              <>
                <Route exact path="/home">
                  <HomePage />
                </Route>
                <Route exact path="/learners">
                  <LearnerListPage />
                </Route>
                <Route exact path="/learners/new">
                  <LearnerFormPage />
                </Route>
                <Route exact path="/learners/edit/:id">
                  <LearnerFormPage />
                </Route>
                <Route exact path="/learners/:id">
                  <LearnerDetailPage />
                </Route>
                <Route exact path="/analytics">
                  <AnalyticsPage />
                </Route>
                <Redirect to="/home" />
              </>
            )}
          </Switch>
        </IonReactRouter>
      </IonApp>
    </AppContext.Provider>
  );
};

export default App;
