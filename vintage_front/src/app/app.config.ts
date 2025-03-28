import { ApplicationConfig, isDevMode } from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideAnimations } from "@angular/platform-browser/animations"
import { provideStore } from "@ngrx/store"
import { provideEffects } from "@ngrx/effects"
import { provideStoreDevtools } from "@ngrx/store-devtools"
import { provideHttpClient, withInterceptors } from "@angular/common/http"

import { routes } from "./app.routes"
import { authReducer } from "./store/auth/auth.reducer"
import { AuthEffects } from "./store/auth/auth.effects"
import { productReducer } from "./store/products/product.reducer"
import { ProductEffects } from "./store/products/product.effects"
import { userReducer } from "./store/users/user.reducer"
import { UserEffects } from "./store/users/user.effects"
import { AuthInterceptor } from "./services/auth.interceptor"

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        // Add your interceptors here
        // yourInterceptor
        AuthInterceptor 
      ])
    ),
    provideStore({
      auth: authReducer,
      products: productReducer,
      users: userReducer,
    }),
    provideEffects([AuthEffects, ProductEffects, UserEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
}

