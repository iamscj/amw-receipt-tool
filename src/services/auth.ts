// Firebase Authentication service
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';

// User credentials
export const ADMIN_EMAIL = 'admin@amw.com';
export const VIEWER_EMAIL = 'viewer@amw.com';

export type UserRole = 'admin' | 'viewer';

// Get user role based on email
export function getUserRole(email: string | null): UserRole | null {
  if (!email) return null;
  if (email === ADMIN_EMAIL) return 'admin';
  if (email === VIEWER_EMAIL) return 'viewer';
  return null;
}

// Check if current user is admin
export function isAdmin(): boolean {
  const user = auth.currentUser;
  return user?.email === ADMIN_EMAIL;
}

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
    const emailLower = email.toLowerCase().trim();

    // Verify email is either admin or viewer
    if (emailLower !== ADMIN_EMAIL.toLowerCase() && emailLower !== VIEWER_EMAIL.toLowerCase()) {
      return false;
    }

    // Sign in with Firebase Auth
    await signInWithEmailAndPassword(auth, email.trim(), password);
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
