import React, { createContext, useContext } from 'react';
import { Learner, User } from '../types';

interface AppContextValue {
  learners: Learner[];
  setLearners: React.Dispatch<React.SetStateAction<Learner[]>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AppContext = createContext<AppContextValue>({
  learners: [],
  setLearners: () => {},
  user: null,
  setUser: () => {},
});

export const useAppContext = () => useContext(AppContext);
