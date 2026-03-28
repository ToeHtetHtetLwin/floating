import { Routes } from '@angular/router';
import { FloatingloveComponent } from './floatinglove/floatinglove.component';
import { SorryComponent } from './sorry/sorry.component';
// Import your Home/Landing component here if you have one
// import { HomeComponent } from './home/home.component'; 

export const routes: Routes = [
  /** * 1. The Dynamic Route
   * This stays the same. To see data, you must go to /love/C001
   */
  { 
    path: 'love/:id', 
    component: FloatingloveComponent 
  },

  /** * 2. The Root Path (localhost:4200)
   * We remove 'redirectTo'. 
   * Now, visiting localhost:4200 will NOT change the URL.
   * You can point this to a Landing Page component instead.
   */
  { 
    path: '', 
    component: SorryComponent, // Or a separate HomeComponent
    pathMatch: 'full' 
  },

  /** * 3. Wildcard Route
   * Keeps the app stable if a user types a wrong URL.
   */
  { 
    path: '**', 
    redirectTo: '' 
  }
];