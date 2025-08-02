import axios, { endpoints } from 'src/utils/axios';
import { CONFIG } from 'src/config-global';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
  try {
    // If no server URL is configured, use mock authentication
    if (!CONFIG.serverUrl) {
      // Mock authentication - accept any email/password for demo
      const mockToken = 'mock-jwt-token-for-demo';
      setSession(mockToken);
      return;
    }

    const params = { email, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    setSession(accessToken);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName }) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    // If no server URL is configured, use mock authentication
    if (!CONFIG.serverUrl) {
      // Mock authentication - create a demo token
      const mockToken = 'mock-jwt-token-for-demo';
      sessionStorage.setItem(STORAGE_KEY, mockToken);
      return;
    }

    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
