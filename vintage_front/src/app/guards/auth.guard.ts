import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { Store } from "@ngrx/store"
import { map, take, tap } from "rxjs/operators"
import { selectIsAuthenticated } from "../store/auth/auth.selectors"

export const authGuard = () => {
  const store = inject(Store)
  const router = inject(Router)

  console.log("Auth guard triggered")

  return store.select(selectIsAuthenticated).pipe(
    tap((isAuthenticated) => console.log("Auth guard - Is authenticated:", isAuthenticated)),
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        console.log("Auth guard: User is authenticated, allowing access")
        return true
      }

      // If not authenticated, redirect to login
      console.log("Auth guard: User not authenticated, redirecting to login")
      return router.createUrlTree(["/auth/login"])
    }),
  )
}

