import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { VinylRecord } from '../../models/vinyl.model';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf, NgFor, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, CurrencyPipe],
  template: `
    <div class="cart-container">
      <h2>Your Cart</h2>
      <div class="cart-items" *ngIf="cartItems$ | async as items">
        <div *ngIf="items.length === 0" class="empty-cart">
          Your cart is empty
        </div>
        <div *ngFor="let item of items" class="cart-item">
          <img [src]="item.imageUrl" [alt]="item.title" class="item-image">
          <div class="item-details">
            <h3>{{ item.artist }} - {{ item.title }}</h3>
            <p class="price">£{{ item.price.toFixed(2) }}</p>
            <button (click)="removeFromCart(item.id)" class="remove-btn">
              Remove
            </button>
          </div>
        </div>
        <div *ngIf="items.length > 0" class="cart-summary">
          <div class="total">Total: £{{ getTotal(items).toFixed(2) }}</div>
          <button (click)="clearCart()" class="clear-btn">Clear Cart</button>
          <button class="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .cart-item {
      display: flex;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
    }
    .item-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      margin-right: 20px;
    }
    .item-details {
      flex: 1;
    }
    .price {
      font-size: 1.2em;
      color: #e91e63;
      font-weight: bold;
    }
    .remove-btn {
      background: #ff4081;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .cart-summary {
      margin-top: 20px;
      padding: 20px;
      border-top: 2px solid #ddd;
    }
    .total {
      font-size: 1.4em;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .empty-cart {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    .checkout-btn {
      background: #4caf50;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 10px;
    }
    .clear-btn {
      background: #f44336;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems$: Observable<VinylRecord[]>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.getCartItems();
  }

  ngOnInit(): void {
    // The resolver will handle the initial data loading
  }

  removeFromCart(id: string) {
    this.cartService.removeFromCart(id);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  getTotal(items: VinylRecord[]): number {
    return items.reduce((total, item) => total + item.price, 0);
  }
}