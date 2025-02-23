// vinyl-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { VinylRecord } from '../../models/vinyl.model';

@Component({
  selector: 'app-vinyl-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vinyl-card.component.html',
  styleUrls: ['./vinyl-card.component.css']
})
export class VinylCardComponent {
  @Input() records: VinylRecord[] = [];
  @Input() sortOptions: string[] = ['Listed', 'Condition', 'Artist', 'Title', 'Label'];

  constructor(private cartService: CartService) {
    // Subscribe to cart updates to verify it's working
    this.cartService.getCartItems().subscribe(items => {
      console.log('Current cart items:', items);
    });
  }

  addToCart(record: VinylRecord) {
    console.log('Adding to cart:', record);
    this.cartService.addToCart(record);
  }
}