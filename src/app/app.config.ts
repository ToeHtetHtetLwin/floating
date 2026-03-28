import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideHttpClient } from '@angular/common/http';
const firebaseConfig = {
  apiKey: "AIzaSyAgRzDIukJQaqZINAoYM6ATHDkSVcI7x78",
  authDomain: "valentine-heartbeat-app.firebaseapp.com",
  databaseURL: "https://valentine-heartbeat-app-default-rtdb.firebaseio.com",
  projectId: "valentine-heartbeat-app",
  storageBucket: "valentine-heartbeat-app.firebasestorage.app",
  messagingSenderId: "303000818813",
  appId: "1:303000818813:web:ab30f1d0be205bd5578d14"
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(), // Animations အတွက် ဒါပါဖို့ လိုပါတယ်။ (သင်ထည့်ထားပြီးသားပါ)
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark'
        }
      }
    }),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase()),
   
  ]
};
