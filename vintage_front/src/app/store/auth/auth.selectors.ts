import { createSelector, createFeatureSelector } from "@ngrx/store"
import type { AuthState } from "./auth.models"

export const selectAuth = createFeatureSelector<AuthState>("auth")

export const selectAuthToken = createSelector(selectAuth, (state: AuthState) => {
  console.log("selectAuthToken - token:", state.token)
  return state.token
})

export const selectAuthLoading = createSelector(selectAuth, (state: AuthState) => state.loading)

export const selectAuthError = createSelector(selectAuth, (state: AuthState) => state.error)

export const selectIsAuthenticated = createSelector(selectAuth, (state: AuthState) => {
  console.log("selectIsAuthenticated - state:", state)
  return state.isAuthenticated
})

export const selectAuthInitialized = createSelector(selectAuth, (state: AuthState) => state.initialized)

export const selectUserRoles = createSelector(selectAuth, (state) => state.roles)

export const selectIsAdmin = createSelector(selectAuth, (state: AuthState) => state.isAdmin)

export const selectAuthUser = createSelector(selectAuth, (state: AuthState) => state.user)

// Add other selectors as needed

