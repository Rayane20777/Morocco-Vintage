import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-analytics",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-semibold">Analytics</h1>
          <p class="text-gray-500 mt-1">Track your store's performance and sales metrics</p>
        </div>
        <div class="mt-4 md:mt-0">
          <select
            [(ngModel)]="selectedPeriod"
            (change)="updatePeriod()"
            class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      <!-- Date Range Selector (for custom range) -->
      <div class="bg-white rounded-lg shadow-sm p-6" *ngIf="selectedPeriod === 'custom'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              id="startDate"
              [(ngModel)]="dateRange.start"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
          <div>
            <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              id="endDate"
              [(ngModel)]="dateRange.end"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            (click)="applyCustomRange()"
            class="bg-teal hover:bg-teal/90 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            Apply Range
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (stat of stats; track stat.title) {
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ stat.title }}</p>
                <p class="mt-2 text-3xl font-semibold">{{ stat.value }}</p>
              </div>
              <div class="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center">
                <span [innerHTML]="stat.icon"></span>
              </div>
            </div>
            <div class="mt-4 flex items-center">
              <span [class]="stat.isPositive ? 'text-green-600' : 'text-red-600'" class="text-sm flex items-center">
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
                {{ stat.change }}
              </span>
              <span class="text-gray-500 text-sm ml-1">vs. previous period</span>
            </div>
          </div>
        }
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Chart -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Revenue</h2>
            <div class="flex items-center space-x-2">
              <button class="px-3 py-1 text-sm bg-teal/10 text-teal rounded-md">Daily</button>
              <button class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Weekly</button>
              <button class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Monthly</button>
            </div>
          </div>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">Revenue chart will be displayed here</p>
          </div>
        </div>

        <!-- Orders Chart -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Orders</h2>
            <div class="flex items-center space-x-2">
              <button class="px-3 py-1 text-sm bg-teal/10 text-teal rounded-md">Daily</button>
              <button class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Weekly</button>
              <button class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Monthly</button>
            </div>
          </div>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">Orders chart will be displayed here</p>
          </div>
        </div>
      </div>

      <!-- Top Products and Categories -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Products -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="flex justify-between items-center p-6 border-b">
            <h2 class="text-lg font-semibold">Top Products</h2>
            <button class="text-sm text-teal hover:underline">View All</button>
          </div>
          <div class="p-6">
            @for (product of topProducts; track product.name) {
              <div class="flex items-center justify-between py-3 border-b last:border-0">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500">{{ product.category }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">{{ product.sales }} sales</div>
                  <div class="text-sm text-gray-500">{{ product.revenue }}</div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Top Categories -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="flex justify-between items-center p-6 border-b">
            <h2 class="text-lg font-semibold">Top Categories</h2>
            <button class="text-sm text-teal hover:underline">View All</button>
          </div>
          <div class="p-6">
            @for (category of topCategories; track category.name) {
              <div class="py-3 border-b last:border-0">
                <div class="flex justify-between mb-2">
                  <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
                  <span class="text-sm font-medium text-gray-900">{{ category.percentage }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-teal h-2.5 rounded-full" [style.width]="category.percentage + '%'"></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AnalyticsComponent {
  selectedPeriod = "30days"
  dateRange = {
    start: "",
    end: "",
  }

  stats = [
    {
      title: "Total Revenue",
      value: "£24,780",
      change: "12% increase",
      isPositive: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`,
    },
    {
      title: "Orders",
      value: "384",
      change: "8% increase",
      isPositive: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>`,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "0.5% increase",
      isPositive: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>`,
    },
    {
      title: "Avg. Order Value",
      value: "£64.53",
      change: "3% decrease",
      isPositive: false,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>`,
    },
  ]

  topProducts = [
    {
      name: "Dark Side of the Moon",
      category: "Rock",
      sales: 124,
      revenue: "£3,719.76",
    },
    {
      name: "Kind of Blue",
      category: "Jazz",
      sales: 98,
      revenue: "£2,449.02",
    },
    {
      name: "Abbey Road",
      category: "Rock",
      sales: 87,
      revenue: "£2,435.13",
    },
    {
      name: "Thriller",
      category: "Pop",
      sales: 76,
      revenue: "£1,747.24",
    },
    {
      name: "Back in Black",
      category: "Rock",
      sales: 65,
      revenue: "£1,689.35",
    },
  ]

  topCategories = [
    {
      name: "Rock",
      percentage: 45,
    },
    {
      name: "Jazz",
      percentage: 25,
    },
    {
      name: "Pop",
      percentage: 15,
    },
    {
      name: "Hip Hop",
      percentage: 10,
    },
    {
      name: "Classical",
      percentage: 5,
    },
  ]

  updatePeriod() {
    console.log("Period updated to:", this.selectedPeriod)
    // In a real app, this would fetch new data based on the selected period
  }

  applyCustomRange() {
    console.log("Custom range applied:", this.dateRange)
    // In a real app, this would fetch new data based on the custom date range
  }
}

