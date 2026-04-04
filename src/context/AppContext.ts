import React, { createContext, useContext } from 'react';
import { Learner, User } from '../types';

interface AppContextValue {
  learners: Learner[];
  setLearners: React.Dispatch<React.SetStateAction<Learner[]>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextValue>({
  learners: [],
  setLearners: () => {},
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
});

export const useAppContext = () => useContext(AppContext);
