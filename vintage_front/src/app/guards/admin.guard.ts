// Improve the admin guard to properly check for admin role and provide better logging:

import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { Store } from "@ngrx/store"
import { map, take, switchMap, tap } from "rxjs"
import { selectIsAdmin, selectIsAuthenticated } from "../store/auth/auth.selectors"

export const adminGuard = () => {
  const store = inject(Store)
  const router = inject(Router)

  console.log("Admin guard triggered")

  return store.select(selectIsAuthenticated).pipe(
    tap((isAuthenticated) => console.log("Admin guard - Is authenticated:", isAuthenticated)),
    take(1),
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        console.log("Admin guard: User not authenticated, redirecting to login")
        router.navigate(["/auth/login"])
        return [false]
      }

      return store.select(selectIsAdmin).pipe(
        tap((isAdmin) => console.log("Admin guard - Is admin:", isAdmin)),
        take(1),
        map((isAdmin) => {
          if (!isAdmin) {
            console.log("Admin guard: User not admin, redirecting to home")
            router.navigate(["/"])
            return false
          }
          console.log("Admin guard: User is admin, allowing access")
          return true
        }),
      )
    }),
  )
}

