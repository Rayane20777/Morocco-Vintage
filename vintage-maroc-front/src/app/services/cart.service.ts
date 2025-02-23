import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VinylRecord } from '../models/vinyl.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'vinyl_cart';
  private cartItems = new BehaviorSubject<VinylRecord[]>(this.loadCartFromStorage());

  constructor() {
    // Initialize cart from localStorage when service starts
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): VinylRecord[] {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  }

  private saveCartToStorage(items: VinylRecord[]) {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
  }

  getCartItems(): Observable<VinylRecord[]> {
    return this.cartItems.asObservable();
  }

  addToCart(vinyl: VinylRecord) {
    const currentItems = this.cartItems.getValue();
    const updatedItems = [...currentItems, vinyl];
    this.cartItems.next(updatedItems);
    this.saveCartToStorage(updatedItems);
    console.log('Item added to cart:', vinyl);
  }

  removeFromCart(vinylId: string) {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.filter(item => item.id !== vinylId);
    this.cartItems.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  clearCart() {
    this.cartItems.next([]);
    localStorage.removeItem(this.CART_STORAGE_KEY);
  }

  getCartTotal(): number {
    return this.cartItems.getValue().reduce((total, item) => total + item.price, 0);
  }
} 