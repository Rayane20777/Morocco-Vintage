import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { OrderService } from "../../../services/order.service"

@Component({
  selector: "app-overview",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-teal/5 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</h3>
          <p class="text-2xl font-bold text-teal mt-1">{{ orderCount }}</p>
        </div>
        <div class="bg-teal/5 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Wishlist Items</h3>
          <p class="text-2xl font-bold text-teal mt-1">0</p>
        </div>
        <div class="bg-teal/5 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Collection Size</h3>
          <p class="text-2xl font-bold text-teal mt-1">0</p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class OverviewComponent implements OnInit {
  orderCount = 0;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrderCount();
  }

  private loadOrderCount() {
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orderCount = orders.length;
      },
      error: (error) => {
        console.error('Error loading order count:', error);
      }
    });
  }
}

