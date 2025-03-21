import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { Store } from "@ngrx/store"
import * as AuthActions from "../store/auth/auth.actions"

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  constructor(
    private router: Router,
    private store: Store,
  ) {}

  handleError(error: any): string {
    console.log("Error being handled:", error) // Debug log

    try {
      // Clear storage for any authentication or connection error
      if (error.status === 401 || error.status === 403 || error.status === 0 || error.status === 503) {
        console.log("Token expired or auth error detected. Logging out user...")

        // Dispatch logout action to properly clear auth state
        this.store.dispatch(AuthActions.logout())

        // Handle different error scenarios
        if (error.status === 0) {
          return "Cannot connect to server. Please check your internet connection."
        } else if (error.status === 503) {
          return "Server is currently unavailable. Please try again later."
        } else {
          // For 401 or 403
          setTimeout(() => {
            this.router.navigate(["/auth/login"]).then(() => {
              console.log("Redirected to login page after token expiration")
            })
          }, 100)
          return "Your session has expired. Please log in again."
        }
      }

      // Handle other types of errors
      if (error.error?.message) {
        return error.error.message
      } else if (error.message) {
        return error.message
      } else {
        return "An unexpected error occurred"
      }
    } catch (e) {
      console.error("Error in error handler:", e)
      return "An unexpected error occurred"
    }
  }
}

