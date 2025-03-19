import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType, OnInitEffects } from "@ngrx/effects"
import { of } from "rxjs"
import { catchError, map, tap, mergeMap } from "rxjs/operators"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import * as AuthActions from "./auth.actions"
import { Action } from "@ngrx/store"

@Injectable()
export class AuthEffects implements OnInitEffects {
  initAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initAuth),
      tap(() => console.log("Initializing auth...")),
      mergeMap(() => {
        const token = localStorage.getItem("token")
        console.log("Stored token:", token)
        if (token) {
          const username = localStorage.getItem("username") || ""
          const roles = JSON.parse(localStorage.getItem("roles") || '[{"authority":"USER"}]')
          console.log("Restoring auth state:", { token, username, roles })
          return of(
            AuthActions.loginSuccess({
              response: {
                token,
                username,
                roles,
              },
            }),
            // Always dispatch authInitialized after loginSuccess
            AuthActions.authInitialized(),
          )
        }
        return of(AuthActions.authInitialized())
      }),
    ),
  )

  ngrxOnInitEffects(): Action {
    return AuthActions.initAuth()
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(({ username, password }) => console.log("Login attempt for user:", username)),
      mergeMap(({ username, password }) => {
        // For demo purposes, simulate a successful login for admin/admin
        if (username === "admin" && password === "admin") {
          return of(
            AuthActions.loginSuccess({
              response: {
                token: "demo-token-123",
                username: "admin",
                roles: [{ authority: "ADMIN" }],
              },
            }),
          )
        }

        // Otherwise, try the actual service
        return this.authService.login(username, password).pipe(
          tap((response) => console.log("Login response:", response)),
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) => {
            console.error("Login error:", error)
            return of(AuthActions.loginFailure({ error: error.message || "Login failed" }))
          }),
        )
      }),
    ),
  )

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response }) => {
          console.log("Login success, storing auth data:", response)
          localStorage.setItem("token", response.token)
          localStorage.setItem("username", response.username)
          localStorage.setItem("roles", JSON.stringify(response.roles))

          // Check if user is admin and redirect accordingly
          const isAdmin = response.roles.some((role) => role.authority === "ADMIN")
          console.log("User is admin:", isAdmin)

          if (isAdmin) {
            console.log("Navigating to admin dashboard after successful login")
            this.router.navigate(["/admin/dashboard"])
          } else {
            console.log("Navigating to /browse after successful login")
            this.router.navigate(["/browse"])
          }
        }),
      ),
    { dispatch: false },
  )

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ email, password, username }) =>
        this.authService.register(email, password, username).pipe(
          map((response) =>
            AuthActions.registerSuccess({
              user: { id: "", email, username, role: "USER" },
              token: response.token,
            }),
          ),
          catchError((error) => of(AuthActions.registerFailure({ error: error.message || "Registration failed" }))),
        ),
      ),
    ),
  )

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          console.log("Logging out...")

          // Clear local storage (frontend logout)
          localStorage.removeItem("token")
          localStorage.removeItem("username")
          localStorage.removeItem("roles")

          // Call the backend logout endpoint if needed
          this.authService.logout().subscribe({
            next: () => console.log("Backend logout successful"),
            error: (err) => console.error("Backend logout failed:", err),
          })

          // Navigate to login page
          this.router.navigate(["/auth/login"])
        }),
      ),
    { dispatch: false },
  )

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
  ) {}
}

