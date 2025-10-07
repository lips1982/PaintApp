import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// ===================================================================================
// IMPORTANTE: El valor anterior 'AIzaSy...' era una API Key, no un Client ID.
// Reemplaza el siguiente marcador de posición con tu ID de Cliente de OAuth 2.0
// que obtuviste de la Google Cloud Console.
// Debería tener un formato como: '1234567890-abcdefg.apps.googleusercontent.com'
// ===================================================================================
const GOOGLE_CLIENT_ID = "416427507289-nf0256qpel63aqgrnol9gshlnms1rat6.apps.googleusercontent.com";


const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);