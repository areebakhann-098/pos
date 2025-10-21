import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * ✅ Guard #1 — Only allow access if token exists
 * Used for protected routes (like dashboard, POS, etc.)
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    // ✅ User logged in → allow access
    return true;
  } else {
    // ❌ No token → redirect to login page
    return router.createUrlTree(['/']);
  }
};

/**
 * ✅ Guard #2 — Prevent access to login when already logged in
 * Used for login route (/) so logged-in user can't open login again
 */
export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    // 🔒 Already logged in → redirect to dashboard
    return router.createUrlTree(['/home']);
  }

  // ✅ No token → allow access to login page
  return true;
};
