import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpResponse 
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CartInterceptor implements HttpInterceptor {
  
  // This method is called for every HTTP request in your application
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Only intercept requests that include '/cart' in the URL
    if (request.url.includes('/cart')) {
      
      // 1. BEFORE the request is sent
      console.log('Original Request:', request);

      // Clone and modify the request
      const modifiedRequest = request.clone({
        setHeaders: {
          'Cart-Operation': 'true',  // Add custom header
          'Cart-Action': this.getCartAction(request),
          'Content-Type': 'application/json'
        }
      });

      // 2. DURING/AFTER the request
      return next.handle(modifiedRequest).pipe(
        tap({
          // When response is successful
          next: (event) => {
            if (event instanceof HttpResponse) {
              console.log('Response received:', event);
            }
          },
          // When an error occurs
          error: (error) => {
            console.error('Request failed:', error);
          }
        })
      );
    }

    // If not a cart request, just pass it through unchanged
    return next.handle(request);
  }

  private getCartAction(request: HttpRequest<any>): string {
    if (request.method === 'POST') return 'add';
    if (request.method === 'DELETE') return 'remove';
    if (request.method === 'GET') return 'view';
    return 'unknown';
  }
} 