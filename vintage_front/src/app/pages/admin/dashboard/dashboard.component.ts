import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { OrderService } from "../../../services/order.service"
import { Store } from "@ngrx/store"
import { OrderActions } from "../../../store/orders/order.actions"
import { selectOrders } from "../../../store/orders/order.selectors"
import { Order } from "../../../store/orders/order.types"
import { NgChartsModule, BaseChartDirective } from "ng2-charts"
import {  ChartConfiguration, Chart } from "chart.js"

interface StatCard {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: string
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterLink, NgChartsModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(BaseChartDirective, { static: false }) salesChart?: BaseChartDirective
  @ViewChild("userChart", { static: false, read: BaseChartDirective }) userChartRef?: BaseChartDirective

  stats: StatCard[] = [
    {
      title: "Total Revenue",
      value: "£0",
      change: "0%",
      isPositive: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`,
    },
    {
      title: "Orders",
      value: "0",
      change: "0%",
      isPositive: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>`,
    },
    {
      title: "Customers",
      value: "0",
      change: "0%",
      isPositive: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>`,
    },
    {
      title: "Avg. Order Value",
      value: "£0",
      change: "0%",
      isPositive: false,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>`,
    },
  ]

  recentOrders: Order[] = []
  salesChartPeriod: "weekly" | "monthly" | "yearly" = "weekly"
  userChartPeriod: "weekly" | "monthly" | "yearly" = "weekly"
  isLoading = true

  // Sales Chart Configuration
  salesChartData: ChartConfiguration<"line">["data"] = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        label: "Sales",
        fill: true,
        tension: 0.5,
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20, 184, 166, 0.1)",
      },
    ],
  }

  salesChartOptions: ChartConfiguration<"line">["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `£${value}`,
        },
      },
    },
  }

  // User Chart Configuration
  userChartData: ChartConfiguration<"bar">["data"] = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        label: "New Users",
        backgroundColor: "#14b8a6",
      },
    ],
  }

  userChartOptions: ChartConfiguration<"bar">["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  constructor(
    private orderService: OrderService,
    private store: Store,
  ) {
    // Configure chart defaults
    Chart.defaults.responsive = true
    Chart.defaults.maintainAspectRatio = false
  }

  ngOnInit() {
    this.isLoading = true
    this.loadDashboardMetrics()
    this.loadRecentOrders()
    this.loadChartData()
  }

  ngAfterViewInit() {
    // Force chart update after view init
    setTimeout(() => {
      this.updateCharts()
    }, 100)
  }

  private updateCharts() {
    if (this.salesChart) {
      this.salesChart.update()
    }
    if (this.userChartRef) {
      this.userChartRef.update()
    }
  }

  private loadDashboardMetrics() {
    this.orderService.getDashboardMetrics().subscribe({
      next: (metrics) => {
        // Add null checks and default values
        const totalRevenue = metrics?.totalRevenue ?? 0;
        const revenueChange = metrics?.revenueChange ?? 0;
        const totalOrders = metrics?.totalOrders ?? 0;
        const ordersChange = metrics?.ordersChange ?? 0;
        const totalCustomers = metrics?.totalCustomers ?? 0;
        const customersChange = metrics?.customersChange ?? 0;
        const averageOrderValue = metrics?.averageOrderValue ?? 0;

        this.stats[0].value = `£${totalRevenue.toFixed(2)}`;
        this.stats[0].change = `${revenueChange.toFixed(1)}%`;
        this.stats[0].isPositive = revenueChange >= 0;

        this.stats[1].value = totalOrders.toString();
        this.stats[1].change = `${ordersChange.toFixed(1)}%`;
        this.stats[1].isPositive = ordersChange >= 0;

        this.stats[2].value = totalCustomers.toString();
        this.stats[2].change = `${customersChange.toFixed(1)}%`;
        this.stats[2].isPositive = customersChange >= 0;

        this.stats[3].value = `£${averageOrderValue.toFixed(2)}`;
        this.stats[3].change = "3%"; // We'll need to add average order value change calculation in the backend
        this.stats[3].isPositive = false;

        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading dashboard metrics:", error);
        this.isLoading = false;

        // Set some mock data for testing
        this.stats[0].value = `£1,245.99`;
        this.stats[1].value = "24";
        this.stats[2].value = "18";
        this.stats[3].value = `£51.92`;
      },
    });
  }

  private loadRecentOrders() {
    this.store.dispatch(OrderActions.loadOrders())
    this.store.select(selectOrders).subscribe((orders) => {
      // Sort orders by date in descending order and take the 5 most recent
      this.recentOrders = [...orders]
        .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0, 5)
    })
  }

  private loadChartData() {
    this.orderService.getChartData(this.salesChartPeriod).subscribe({
      next: (data) => {
        console.log("Chart Data:", data)

        // Update sales chart
        this.salesChartData.labels = data.labels
        this.salesChartData.datasets[0].data = data.salesData

        // Update user chart
        this.userChartData.labels = data.labels
        this.userChartData.datasets[0].data = data.userData

        // Force chart update with a safety check
        setTimeout(() => {
          if (this.salesChart && this.userChartRef) {
            this.updateCharts()
          } else {
            console.log("Charts not yet initialized, skipping update")
          }
        }, 100)
      },
      error: (error) => {
        console.error("Error loading chart data:", error)

        // Set some mock data for testing
        this.salesChartData.datasets[0].data = [150, 220, 180, 250, 300, 280, 350]
        this.userChartData.datasets[0].data = [2, 1, 3, 0, 2, 1, 4]

        // Force chart update with a safety check
        setTimeout(() => {
          if (this.salesChart && this.userChartRef) {
            this.updateCharts()
          } else {
            console.log("Charts not yet initialized, skipping update")
          }
        }, 100)
      },
    })
  }

  setSalesChartPeriod(period: "weekly" | "monthly" | "yearly") {
    this.salesChartPeriod = period
    this.loadChartData()
  }

  setUserChartPeriod(period: "weekly" | "monthly" | "yearly") {
    this.userChartPeriod = period
    this.loadChartData()
  }
}

