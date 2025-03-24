import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth/auth.actions';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const store = inject(Store);
  
  const token = localStorage.getItem('token');
  
  // Add detailed request logging
  console.log('AuthInterceptor - Request URL:', req.url);
  console.log('AuthInterceptor - Request Method:', req.method);
  console.log('AuthInterceptor - Token present:', !!token);
  
  // Check if it's an admin endpoint
  const isAdminEndpoint = req.url.includes('/admin/');
  
  if (token) {
    // Clone the request and replace headers
    req = req.clone({
      headers: req.headers
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
    console.log('AuthInterceptor - Headers set:', req.headers.keys());
  } else if (isAdminEndpoint) {
    console.error('Attempting to access admin endpoint without token');
    router.navigate(['/auth/login']);
    return throwError(() => new Error('Authentication required for admin endpoint'));
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Authentication failed - clearing credentials');
        localStorage.clear();
        store.dispatch(AuthActions.logout());
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
}; 