// Improve the admin guard to properly check for admin role and provide better logging:

import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { Store } from "@ngrx/store"
import { map, take, switchMap, tap, of } from "rxjs"
import { selectIsAdmin, selectIsAuthenticated } from "../store/auth/auth.selectors"

export const adminGuard = () => {
  const store = inject(Store)
  const router = inject(Router)

  // Immediate token check
  const token = localStorage.getItem('token')
  if (!token) {
    console.log("Admin guard: No token found, redirecting to login")
    router.navigate(["/auth/login"])
    return of(false)
  }

  return store.select(selectIsAuthenticated).pipe(
    tap((isAuthenticated) => {
      console.log("Admin guard - Authentication check:", isAuthenticated)
      if (!isAuthenticated) {
        localStorage.clear() // Clear potentially invalid tokens
        router.navigate(["/auth/login"])
      }
    }),
    take(1),
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        return of(false)
      }

      return store.select(selectIsAdmin).pipe(
        tap((isAdmin) => {
          console.log("Admin guard - Admin check:", isAdmin)
          if (!isAdmin) {
            router.navigate(["/"])
          }
        }),
        take(1),
      )
    }),
  )
}

