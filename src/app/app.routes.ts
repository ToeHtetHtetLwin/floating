import { Routes } from '@angular/router';
import { FloatingloveComponent } from './floatinglove/floatinglove.component';

export const routes: Routes = [
  /** * 1. The Dynamic Route
   * ':id' acts as a placeholder for your Customer IDs (C001, C002, etc.)
   */
  { 
    path: 'love/:id', 
    component: FloatingloveComponent 
  },

  /** * 2. Default Fallback
   * If someone visits just 'yourdomain.com', 
   * they will be redirected to the first customer (C001).
   */
  { 
    path: '', 
    redirectTo: 'love/C001', 
    pathMatch: 'full' 
  },

  /** * 3. Wildcard Route (Optional)
   * Handles 404 - Page Not Found by sending users back to the main view.
   */
  { 
    path: '**', 
    redirectTo: 'love/C001' 
  }
];