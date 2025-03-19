// Fix the admin guard to properly check both authentication and admin role
import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { Store } from "@ngrx/store"
import { map, take, switchMap } from "rxjs"
import { selectIsAdmin, selectIsAuthenticated } from "../store/auth/auth.selectors"

export const adminGuard = () => {
  const store = inject(Store)
  const router = inject(Router)

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        console.log("Admin guard: User not authenticated, redirecting to login")
        router.navigate(["/auth/login"])
        return [false]
      }

      return store.select(selectIsAdmin).pipe(
        take(1),
        map((isAdmin) => {
          if (!isAdmin) {
            console.log("Admin guard: User not admin, redirecting to home")
            router.navigate(["/"])
            return false
          }
          return true
        }),
      )
    }),
  )
}

