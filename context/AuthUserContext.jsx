import useFirebase from '@/lib/useFirebase';
import { createContext, useContext } from 'react';
// ADD A REFRESH FUNCTION HERE AS WELL
/**
 * `authUserContext` provides a context for Firebase authentication operations.
 *
 * It contains the current authenticated user (`authUser`), an indication of whether
 * authentication is currently loading, and various authentication methods.
 *
 * The default values for these methods throw errors. This means that if they're invoked
 * outside the context of an `AuthUserProvider`, they'll indicate the error.
 * This is a useful fail-safe against misuse of the context.
 */
const authUserContext = createContext({
  authUser: null,
  loading: true,
  updateAuthUser: () => {
    throw new Error("updateAuthUser function cannot be called outside a provider");
  },

  signInWithEmailAndPassword: async () => {
    throw new Error("signInWithEmailAndPassword function cannot be called outside a provider");
  },
  createUserWithEmailAndPassword: async () => {
    throw new Error("createUserWithEmailAndPassword function cannot be called outside a provider");
  },
  createUserWithEmailAndPasswordInvite: async () => {
    throw new Error("createUserWithEmailAndPassword function cannot be called outside a provider");
  },
  signOut: async () => {
    throw new Error("signOut function cannot be called outside a provider");
  },
  sendPasswordResetEmail: async () => {
    throw new Error("sendPasswordResetEmail function cannot be called outside a provider");
  },
});

/**
 * `AuthUserProvider` component wraps its children inside the Firebase authentication context.
 *
 * This component provides a way for child components to have access to Firebase authentication functions
 * and the current authenticated user state.
 *
 * @param {Object} props The component props.
 * @param {React.ReactNode} props.children The child components or elements.
 */
export function AuthUserProvider({ children }) {
  let auth;

  try {
    // Use the Firebase authentication hook to get user and authentication methods.
    auth = useFirebase();
  } catch (error) {
    console.error("Failed to authenticate:", error);
    // Handle the error further if needed, for example, show a notification or redirect the user.
  }

  // Provide the `auth` (from Firebase hook) as the context value to the children.
  return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
}

/**
 * `useAuth` is a custom hook that provides easy access to the Firebase authentication context.
 *
 * This hook can be used in any component wrapped inside `AuthUserProvider` to get the authenticated user,
 * authentication loading state, and authentication methods.
 *
 * @returns {Object} The Firebase authentication context.
 */
export const useAuth = () => useContext(authUserContext);
