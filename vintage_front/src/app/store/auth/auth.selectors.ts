import { createSelector, createFeatureSelector } from "@ngrx/store"
import type { AuthState } from "./auth.models"

export const selectAuthState = createFeatureSelector<AuthState>("auth")

export const selectAuthToken = createSelector(selectAuthState, (state: AuthState) => {
  console.log("selectAuthToken - token:", state.token)
  return state.token
})

export const selectAuthLoading = createSelector(selectAuthState, (state: AuthState) => state.loading)

export const selectAuthError = createSelector(selectAuthState, (state: AuthState) => state.error)

export const selectIsAuthenticated = createSelector(selectAuthState, (state) => {
  console.log("selectIsAuthenticated - state:", state)
  return state.isAuthenticated
})

export const selectAuthInitialized = createSelector(selectAuthState, (state: AuthState) => state.initialized)

export const selectUserRoles = createSelector(selectAuthState, (state) => state.roles)

export const selectIsAdmin = createSelector(selectUserRoles, (roles) =>
  roles.some((role) => role.authority === "ADMIN"),
)

