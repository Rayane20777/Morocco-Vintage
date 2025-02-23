import type { Routes } from "@angular/router"
import { HomeComponent } from "./components/home/home.component"
import { AboutComponent } from "./components/about/about.component"
import { CartComponent } from "./components/cart/cart.component"
import { CartResolver } from "./resolvers/cart.resolver"

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "auth", loadChildren: () => import("./components/auth/auth.routes").then((m) => m.AUTH_ROUTES) },
  { path: "main", loadChildren: () => import("./components/main/main.routes").then((m) => m.MAIN_ROUTES) },
  { path: "cart", component: CartComponent, resolve: { cartItems: CartResolver } },
]

