import { Injectable } from '@angular/core';
import { 
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CartService } from '../services/cart.service';
import { VinylRecord } from '../models/vinyl.model';

@Injectable({
  providedIn: 'root'
})
export class CartResolver implements Resolve<VinylRecord[]> {
  constructor(private cartService: CartService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<VinylRecord[]> {
    console.log('CartResolver: Loading cart data before route activation');
    
    // Fetch cart data before the route activates
    return this.cartService.getCartItems().pipe(
      catchError(error => {
        console.error('Error in CartResolver:', error);
        return of([]); // Return empty array if there's an error
      })
    );
  }
} 