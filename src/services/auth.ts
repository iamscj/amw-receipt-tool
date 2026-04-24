// Firebase Authentication service
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';

export const AUTH_EMAIL = 'amw@internal.com';

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return auth.currentUser !== null;
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<boolean> {
  try {
    // Verify email matches expected
    if (email.toLowerCase().trim() !== AUTH_EMAIL.toLowerCase()) {
      return false;
    }

    // Sign in with Firebase Auth
    await signInWithEmailAndPassword(auth, AUTH_EMAIL, password);
    return true;
  } catch (error: any) {
    console.error('Login error:', error);

    // Handle specific error codes
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      return false;
    }

    return false;
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Setup auth state listener
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
