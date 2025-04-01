import { Routes } from "@angular/router"
import { authGuard } from "./guards/auth.guard"
import { adminGuard } from "./guards/admin.guard"
import { noAuthGuard } from "./guards/no-auth.guard"
import { HomeComponent } from './pages/home/home.component'
import { CartComponent } from './pages/cart/cart.component'
import { AntiquesComponent } from './pages/antiques/antiques.component'
import { AntiqueDetailComponent } from './pages/antiques/antique-detail.component'

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "browse",
    loadComponent: () => import("./pages/browse/browse.component").then((m) => m.BrowseComponent),
    canActivate: [authGuard],
  },
  {
    path: "release/:id",
    loadComponent: () =>
      import("./pages/release-detail/release-detail.component").then((m) => m.ReleaseDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: "equipment",
    loadComponent: () => import("./pages/equipment/equipment.component").then((m) => m.EquipmentComponent),
    canActivate: [authGuard],
  },
  {
    path: "equipment/:id",
    loadComponent: () =>
      import("./pages/equipment-detail/equipment-detail.component").then((m) => m.EquipmentDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: "antiques",
    loadComponent: () => import("./pages/antiques/antiques.component").then((m) => m.AntiquesComponent),
    canActivate: [authGuard],
  },
  {
    path: "antiques/:id",
    loadComponent: () => import("./pages/antiques/antique-detail.component").then((m) => m.AntiqueDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: "cart",
    loadComponent: () => import("./pages/cart/cart.component").then((m) => m.CartComponent),
    canActivate: [authGuard],
  },
  {
    path: "auth",
    loadChildren: () => import("./pages/auth/auth.routes").then((m) => m.AUTH_ROUTES),
    canActivate: [noAuthGuard],
  },
  {
    path: "profile",
    loadComponent: () => import("./pages/profile/profile.component").then((m) => m.ProfileComponent),
    canActivate: [authGuard],
    children: [
      {
        path: "",
        redirectTo: "overview",
        pathMatch: "full",
      },
      {
        path: "overview",
        loadComponent: () => import("./pages/profile/overview/overview.component").then((m) => m.OverviewComponent),
      },
      {
        path: "orders",
        loadComponent: () => import("./pages/profile/orders/orders.component").then((m) => m.OrdersComponent),
      },
      {
        path: "settings",
        loadComponent: () =>
          import("./pages/profile/account-settings/account-settings.component").then((m) => m.AccountSettingsComponent),
      },
      {
        path: "preferences",
        loadComponent: () =>
          import("./pages/profile/preferences/preferences.component").then((m) => m.PreferencesComponent),
      },
    ],
  },
  {
    path: "admin",
    loadComponent: () => import("./pages/admin/admin.component").then((m) => m.AdminComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadComponent: () => import("./pages/admin/dashboard/dashboard.component").then((m) => m.DashboardComponent),
      },
      {
        path: "products",
        loadComponent: () => import("./pages/admin/products/products.component").then((m) => m.ProductsComponent),
      },
      {
        path: "orders",
        loadComponent: () => import("./pages/admin/orders/admin-orders/admin-orders.component").then((m) => m.AdminOrdersComponent),
      },
      {
        path: "orders/:id",
        loadComponent: () =>
          import("./pages/admin/orders/order-detail/order-detail.component").then((m) => m.OrderDetailComponent),
      },
      {
        path: "orders/:id/edit",
        loadComponent: () =>
          import("./pages/admin/orders/order-edit/order-edit.component").then((m) => m.OrderEditComponent),
      },
      {
        path: "customers",
        loadComponent: () => import("./pages/admin/customers/customers.component").then((m) => m.CustomersComponent),
      }
    ],
  },
  {
    path: "**",
    redirectTo: "",
  },
]

