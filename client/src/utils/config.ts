const getAPIURL = (): string => { 
  return import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_API_URL 
  : "http://localhost:3000"; 

}

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const config = {
  apiUrl: getAPIURL(),
  firebase: firebaseConfig,

};