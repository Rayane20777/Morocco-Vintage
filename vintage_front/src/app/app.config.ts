import { ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { NgChartsModule } from 'ng2-charts'
import { ChartConfiguration } from 'chart.js'
import { routes } from "./app.routes"
import { provideStore } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'
import { orderReducer } from './store/orders/order.reducer'
import { OrderEffects } from './store/orders/order.effects'
import { AuthInterceptor } from './services/auth.interceptor'
import { authReducer } from './store/auth/auth.reducer'
import { AuthEffects } from './store/auth/auth.effects'
import { userReducer } from './store/users/user.reducer'
import { UserEffects } from './store/users/user.effects'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { isDevMode } from '@angular/core'
import { productReducer } from './store/products/product.reducer'
import { ProductEffects } from './store/products/product.effects'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideStore({ 
      orders: orderReducer,
      auth: authReducer,
      users: userReducer,
      products: productReducer
    }),
    provideEffects([OrderEffects, AuthEffects, UserEffects, ProductEffects]),
    provideAnimations(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    NgChartsModule,
  ]
}

