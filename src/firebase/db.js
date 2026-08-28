import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCHX-pEn0slFVJRy8kHZj0l9NiDValIqgA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'stormglideio.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'stormglideio',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'stormglideio.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1055875955113',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1055875955113:web:fb3afeccbb270b9dbd6cb8',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

// Optional: Enable emulators for local development
if (import.meta.env.MODE === 'development' && !window.location.hostname.includes('vercel')) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectAuthEmulator(auth, 'http://localhost:9099')
    connectStorageEmulator(storage, 'localhost', 9199)
  } catch {
    // Emulator already connected
  }
}

export default app
