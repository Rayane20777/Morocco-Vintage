import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { Store } from "@ngrx/store"
import { map, take, tap } from "rxjs/operators"
import { selectIsAuthenticated } from "../store/auth/auth.selectors"

export const noAuthGuard = () => {
  const store = inject(Store)
  const router = inject(Router)

  console.log("No auth guard triggered")

  return store.select(selectIsAuthenticated).pipe(
    tap((isAuthenticated) => console.log("No auth guard - Is authenticated:", isAuthenticated)),
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        // If authenticated, redirect to browse page
        console.log("No auth guard: User is authenticated, redirecting to browse")
        return router.createUrlTree(["/browse"])
      }

      // If not authenticated, allow access to login page
      console.log("No auth guard: User not authenticated, allowing access")
      return true
    }),
  )
} 