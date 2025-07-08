// context/UserDetailContext.js
import { createContext } from 'react';

export const UserDetailContext = createContext({
  user: null,
  setUser: () => {},
  loading: true, // Add loading to the context type
});