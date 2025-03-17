import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"

interface StatCard {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: string
}

interface RecentOrder {
  id: string
  customer: string
  date: string
  amount: string
  status: string
}

interface TopProduct {
  name: string
  artist?: string
  type: "Vinyl" | "Antique" | "Equipment"
  category: string
  sales: number
  revenue: string
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (stat of stats; track stat.title) {
          <div class="bg-white rounded-lg shadow-sm p-6 flex items-start">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">{{ stat.title }}</p>
              <p class="mt-2 text-3xl font-semibold">{{ stat.value }}</p>
              <p class="mt-2 text-sm" [class]="stat.isPositive ? 'text-green-600' : 'text-red-600'">
                <span class="flex items-center">
                  <svg
                    *ngIf="stat.isPositive"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <svg
                    *ngIf="!stat.isPositive"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  {{ stat.change }} from last month
                </span>
              </p>
            </div>
            <div class="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center">
              <span [innerHTML]="stat.icon"></span>
            </div>
          </div>
        }
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Sales Chart -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Sales Overview</h2>
            <div class="flex items-center space-x-2">
              <button class="px-3 py-1 text-sm bg-teal/10 text-teal rounded-md">Weekly</button>
              <button class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Monthly</button>
              <button class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Yearly</button>
            </div>
          </div>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">Sales chart will be displayed here</p>
          </div>
        </div>

        <!-- Top Categories -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Top Categories</h2>
            <button class="text-sm text-teal hover:underline">View All</button>
          </div>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">Categories chart will be displayed here</p>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-lg font-semibold">Recent Orders</h2>
          <a routerLink="/admin/orders" class="text-sm text-teal hover:underline">View All</a>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (order of recentOrders; track order.id) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.customer }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.date }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.amount }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-green-100 text-green-800': order.status === 'Completed',
                        'bg-yellow-100 text-yellow-800': order.status === 'Processing',
                        'bg-blue-100 text-blue-800': order.status === 'Shipped',
                        'bg-red-100 text-red-800': order.status === 'Cancelled'
                      }"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" class="text-teal hover:text-teal/80">View</a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Products -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-lg font-semibold">Top Products</h2>
          <a routerLink="/admin/products" class="text-sm text-teal hover:underline">View All</a>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist/Brand</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (product of topProducts; track product.name) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-blue-100 text-blue-800': product.type === 'Vinyl',
                        'bg-yellow-100 text-yellow-800': product.type === 'Antique',
                        'bg-green-100 text-green-800': product.type === 'Equipment'
                      }"
                    >
                      {{ product.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.artist || 'N/A' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.category }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.sales }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.revenue }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DashboardComponent {
  stats: StatCard[] = [
    {
      title: "Total Revenue",
      value: "£24,780",
      change: "12%",
      isPositive: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`,
    },
    {
      title: "Orders",
      value: "384",
      change: "8%",
      isPositive: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>`,
    },
    {
      title: "Customers",
      value: "1,284",
      change: "5%",
      isPositive: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>`,
    },
    {
      title: "Avg. Order Value",
      value: "£64.53",
      change: "3%",
      isPositive: false,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>`,
    },
  ]

  recentOrders: RecentOrder[] = [
    {
      id: "ORD-2023-1234",
      customer: "John Doe",
      date: "Mar 15, 2023",
      amount: "£149.99",
      status: "Completed",
    },
    {
      id: "ORD-2023-1235",
      customer: "Jane Smith",
      date: "Mar 16, 2023",
      amount: "£89.99",
      status: "Processing",
    },
    {
      id: "ORD-2023-1236",
      customer: "Robert Johnson",
      date: "Mar 16, 2023",
      amount: "£199.99",
      status: "Shipped",
    },
    {
      id: "ORD-2023-1237",
      customer: "Emily Davis",
      date: "Mar 17, 2023",
      amount: "£129.99",
      status: "Processing",
    },
    {
      id: "ORD-2023-1238",
      customer: "Michael Wilson",
      date: "Mar 17, 2023",
      amount: "£79.99",
      status: "Cancelled",
    },
  ]

  topProducts: TopProduct[] = [
    {
      name: "Dark Side of the Moon",
      artist: "Pink Floyd",
      type: "Vinyl",
      category: "Rock",
      sales: 124,
      revenue: "£3,719.76",
    },
    {
      name: "Vintage Technics SL-1200",
      type: "Equipment",
      category: "Turntables",
      sales: 45,
      revenue: "£22,455.00",
    },
    {
      name: "Kind of Blue",
      artist: "Miles Davis",
      type: "Vinyl",
      category: "Jazz",
      sales: 98,
      revenue: "£2,449.02",
    },
    {
      name: "Art Deco Gramophone",
      type: "Antique",
      category: "Audio Players",
      sales: 12,
      revenue: "£6,000.00",
    },
    {
      name: "Abbey Road",
      artist: "The Beatles",
      type: "Vinyl",
      category: "Rock",
      sales: 87,
      revenue: "£2,435.13",
    },
    {
      name: "Vintage Marshall Amplifier",
      type: "Equipment",
      category: "Amplifiers",
      sales: 23,
      revenue: "£11,477.00",
    },
    {
      name: "Thriller",
      artist: "Michael Jackson",
      type: "Vinyl",
      category: "Pop",
      sales: 76,
      revenue: "£1,747.24",
    },
    {
      name: "1940s Jukebox",
      type: "Antique",
      category: "Audio Players",
      sales: 5,
      revenue: "£7,495.00",
    },
  ]
}

