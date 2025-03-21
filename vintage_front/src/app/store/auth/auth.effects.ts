import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType, OnInitEffects } from "@ngrx/effects"
import { of } from "rxjs"
import { catchError, map, tap, mergeMap, switchMap } from "rxjs/operators"
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
              user: {
                username,
                roles,
              },
              token,
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
      switchMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map((response) => {
            // Make sure your login response includes a token
            console.log("Login successful, token received:", !!response.token)
            return AuthActions.loginSuccess({
              user: {
                username: response.username || username,
                roles: response.roles || [{ authority: "USER" }],
              },
              token: response.token,
            })
          }),
          catchError((error) => {
            console.error("Login error:", error)
            return of(AuthActions.loginFailure({ error: error.message }))
          }),
        ),
      ),
    ),
  )

  loginSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user, token }) => {
          console.log("Login success, storing auth data:", { user, token })
          localStorage.setItem("token", token)
          localStorage.setItem("username", user.username)
          localStorage.setItem("roles", JSON.stringify(user.roles))

          // Check if user is admin and redirect accordingly
          const isAdmin =
            user.roles &&
            user.roles.some(
              (role: { authority: string }) => role.authority === "ADMIN" || role.authority === "ROLE_ADMIN",
            )
          console.log("User is admin:", isAdmin, "Roles:", user.roles)

          if (isAdmin) {
            console.log("Navigating to admin dashboard")
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
          console.log("Logging out and clearing all storage...")

          // Clear all local storage items
          localStorage.removeItem("token")
          localStorage.removeItem("username")
          localStorage.removeItem("roles")
          localStorage.clear() // Clear any other items that might be present

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

