import { useState, useEffect } from 'react';
import { firebase, db } from './firebase';
import globalConfig from '@/globalConfig';


// Helper function to format the user data retrieved from Firestore
/**
 * Formats user data retrieved from Firestore
 * @param {Object} user - The user object
 * @returns {Object} - Formatted user data with uid and data
 */
const formatAuthUser = async (user) => {
  try {
    const doc = await db.collection(globalConfig.firestoreCollections.users).doc(user.uid).get();

    if (!doc.exists) {
      console.error(`No profile document found for user ${user.uid}`);
      throw new Error(`No profile document found for user ${user.uid}`);
    }

    // Return formatted user data
    return {
      uid: user.uid,
      data: doc.data(),
    };
  } catch (error) {
    console.error("Error formatting auth user", error);
    return null;
  }
};

// Custom hook for handling Firebase authentication
export default function useFirebase() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to update the authenticated user state
  const updateAuthUser = (updatedAuthUser) => {
    setAuthUser(updatedAuthUser);
  };

  // Function to handle changes in the authentication state
  const authStateChanged = async (authState) => {
    if (!authState) {
      setLoading(false);
      return;
    }

    try {
      // Format the user data and update the state
      let formattedUser = await formatAuthUser(authState);
      setAuthUser(formattedUser);
      setLoading(false);
    } catch (error) {
      console.error("Error formatting auth user", error);
      setAuthUser(null);
      setLoading(false);
    }
  };

  // Function to clear the authenticated user state
  const clear = () => {
    setAuthUser(null);
    setLoading(false);
  };

  // Function to sign in with email and password
  /**
 * Function to sign in with email and password
 * @param {string} email - The email address of the user
 * @param {string} password - The password of the user
 * @returns {Object} - Object with status, message, and data properties
 */

  const signInWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const doc = await db.collection(globalConfig.firestoreCollections.users).doc(user.uid).get();
      const newUser = { uid: user.uid, data: doc.data() };
      setAuthUser(newUser);
      return {
        status: 'success',
        message: 'Signed in successfully!',
        data: { uid: user.uid, isNewUser: newUser.data.isNewUser }
      };
    } catch (error) {
      console.error("Error signing in", error);
      return { status: 'error', message: `Error signing in: ${error.message}` };
    }
  };

  // Function to create a new user with email and password
  /**
 * Creates a new user with email and password
 * @param {string} email - The email of the new user
 * @param {string} password - The password of the new user
 * @returns {Object} - Object containing the status, message, and user uid
 */
  const createUserWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Create a user profile document in Firestore
      await db.collection(globalConfig.firestoreCollections.users).doc(user.uid).set({
        email: user.email,
        role: { 'key': `user`, 'weight': 2 },
        createdBy: user.uid,
        isNewUser: true
      });

      return { status: 'success', message: 'User created successfully!',
      data: { uid: user.uid } };
    } catch (error) {
      console.error("Error creating user", error);
      return { status: 'error', message: `Error creating user: ${error.message}` };
    }
  };

  /**
 * Function to create a new user with email, password, and additional details for invitation
 * 
 * @param {string} firstName - The first name of the user
 * @param {string} lastName - The last name of the user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @param {string} role - The role of the user
 * @param {string} createBy - The creator of the invitation
 * @returns {Object} - The status and message of the user creation
 */
  const createUserWithEmailAndPasswordInvite = async (firstName, lastName, email, password, role, createBy) => {
    try {
        // Check if a document exists in the pendingUsers collection with matching email and createdBy
        const pendingUserQuery = await db.collection(globalConfig.firestoreCollections.pendingUsers)
            .where('email', '==', email)
            .where('createdBy', '==', createBy)
            .get();

        if (!pendingUserQuery.empty) {
            // If a matching document exists, check if the date is less than 5 days from the current date
            const pendingUserDoc = pendingUserQuery.docs[0];
            const currentDate = new Date();
            const invitationDate = pendingUserDoc.data().date.toDate();
            const daysDifference = Math.floor((currentDate - invitationDate) / (1000 * 60 * 60 * 24));

            // If the date is less than 5 days, proceed with user creation
            if (daysDifference < globalConfig.linkExpiration.duration) {
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Create a user profile document in Firestore
                await db.collection(globalConfig.firestoreCollections.users).doc(user.uid).set({
                    firstName: firstName,
                    lastName: lastName,
                    name: firstName + ' ' + lastName,
                    email: user.email,
                    isNewUser: true,
                    status: 'active',
                    role: role,
                    createdBy: createBy,
                });

                // Remove the user document from the pendingUsers collection
                await pendingUserDoc.ref.delete();

                // Add the user document to the invitesHistory collection for record-keeping
                await db.collection(globalConfig.firestoreCollections.invitesHistory).add({
                    email: email,
                    createdBy: createBy,
                    date: currentDate,
                    status: 'accepted', // You can customize the status based on your needs
                });

                return { status: 'success', message: 'User created successfully!' };
            } else {
                // If the date is more than 5 days, prevent sign up
                return { status: 'error', message: 'Invitation has expired. Please request a new invitation.' };
            }
        } else {
            // If no matching document in the pendingUsers collection, prevent sign up
            return { status: 'error', message: 'Invalid invitation. Please request a valid invitation.' };
        }
    } catch (error) {
        console.error('Error creating user', error);

        // Log additional information for debugging
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);

        // Check the error code to provide specific error messages
        if (error.code === 'auth/email-already-in-use') {
            return { status: 'error', message: 'Email is already in use. Please choose a different email.' };
        } else {
            return { status: 'error', message: `Error creating user: ${error.message}` };
        }
    }
};




  // Function to sign in with Google OAuth provider
  /**
 * Function to sign in with Google OAuth provider
 * @returns {Object} Object with status, message, and data properties
 */
  const signInWithGoogle = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await firebase.auth().signInWithPopup(provider);
      const user = userCredential.user;

      // Check if the user profile document exists, create if not
      const docRef = db.collection(globalConfig.firestoreCollections.users).doc(user.uid);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        await docRef.set({
          email: user.email,
          role: { 'key': 'user', 'weight': 2 },
          isNewUser: true,
          createdBy: user.uid,
        });
      }

      // Listen for changes to the user profile and update the state
      docRef.onSnapshot((snapshot) => {
        const newUser = { uid: user.uid, data: snapshot.data() };
        setAuthUser(newUser);
      });

      return { status: 'success', message: 'Signed in with Google successfully!', data: { uid: user.uid, additionalUserInfo: userCredential.additionalUserInfo } };
    } catch (error) {
      console.error("Error signing in with Google", error);
      return { status: 'error', message: `Error signing in with Google: ${error.message}` };
    }
  };

  // Function to sign in with Facebook OAuth provider
  const signInWithFacebook = async () => {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      const userCredential = await firebase.auth().signInWithPopup(provider);
      const user = userCredential.user;
      const doc = await db.collection(globalConfig.firestoreCollections.users).doc(user.uid).get();
      const newUser = { uid: user.uid, data: doc.data() };
      setAuthUser(newUser);
      return { status: 'success', message: 'Signed in with Facebook successfully!', data: { uid: user.uid, additionalUserInfo: userCredential.additionalUserInfo } };
    } catch (error) {
      console.error("Error signing in with Facebook", error);
      return { status: 'error', message: `Error signing in with Facebook: ${error.message}` };
    }
  };

  // Function to sign in with GitHub OAuth provider
  const signInWithGithub = async () => {
    try {
      const provider = new firebase.auth.GithubAuthProvider();
      const userCredential = await firebase.auth().signInWithPopup(provider);
      const user = userCredential.user;
      const doc = await db.collection(globalConfig.firestoreCollections.users).doc(user.uid).get();
      const newUser = { uid: user.uid, data: doc.data() };
      setAuthUser(newUser);
      return { status: 'success', message: 'Signed in with Github successfully!', data: { uid: user.uid, additionalUserInfo: userCredential.additionalUserInfo } };
    } catch (error) {
      console.error("Error signing in with Github", error);
      return { status: 'error', message: `Error signing in with Github: ${error.message}` };
    }
  };

  // Function to send a password reset email
  /**
 * Sends a password reset email to the specified email address
 * @param {string} email - The email address to send the password reset email to
 * @returns {Object} - An object containing the status and message of the operation
 */
  const sendPasswordResetEmail = async (email) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      return { status: 'success', message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error("Error sending password reset email", error);
      return { status: 'error', message: `Error sending password reset email: ${error.message}` };
    }
  };

  // Function to re-authenticate the user before changing email
  /**
 * Re-authenticates the user before changing email
 * @param {string} currentEmail - The current email of the user
 * @param {string} password - The password of the user
 * @returns {Promise} - A promise that resolves when the user is re-authenticated
 */
  const reauthenticateUser = async (currentEmail, password) => {
    const user = firebase.auth().currentUser;

    const credential = firebase.auth.EmailAuthProvider.credential(
      currentEmail,
      password
    );

    return user.reauthenticateWithCredential(credential);
  };

  // Function to change the user's email address
  /**
 * Function to change the user's email address
 * @param {string} currentEmail - The user's current email address
 * @param {string} newEmail - The new email address to be set
 * @param {string} password - The user's password for re-authentication
 * @returns {Object} - Object containing the status and message of the operation
 */
  const changeEmail = async (currentEmail, newEmail, password) => {
    try {
      const user = firebase.auth().currentUser;

      if (user) {
        // Re-authenticate the user before changing the email
        await reauthenticateUser(currentEmail, password);

        // Create an action code settings object for email verification
        const actionCodeSettings = {
          url: `${globalConfig.site.emailVerificationURL}` + newEmail,
          handleCodeInApp: true,
        };

        // Send a verification link to the new email address
        await user.verifyBeforeUpdateEmail(newEmail, actionCodeSettings);

        // Update the email in the user's profile document in Firestore
        const userDocRef = db.collection(globalConfig.firestoreCollections.users).doc(user.uid);
        await userDocRef.update({ email: newEmail });

        return { status: 'success', message: 'Email verification link sent successfully.' };
      }
    } catch (error) {
      console.error("Error changing email", error);
      return {
        status: 'error', message: `Error changing email: ${error.message}`
      };
    }
  };

  // Function to sign out the user
  const signOut = async () => {
    localStorage.setItem('activeTeam', JSON.stringify('No Team Selected'));
    const result = await firebase.auth().signOut();
    return clear(result);
  };

  // Effect hook to listen for changes in the authentication state
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  // Return functions and states to be used in the component
  return {
    authUser,
    updateAuthUser,
    loading,
    signInWithEmailAndPassword,
    createUserWithEmailAndPasswordInvite,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    changeEmail,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    signInWithGithub,
  };
}
