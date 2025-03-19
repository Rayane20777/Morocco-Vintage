import { createReducer, on } from "@ngrx/store"
import * as AuthActions from "./auth.actions"
import   { AuthState } from "./auth.models"

export const initialState: AuthState = {
  token: null,
  username: null,
  roles: [],
  isAuthenticated: false,
  error: null,
  loading: false,
  initialized: false,
}

export const authReducer = createReducer(
  initialState,
  on(AuthActions.initAuth, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.authInitialized, (state) => ({
    ...state,
    loading: false,
    initialized: true,
  })),
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    token: response.token,
    username: response.username,
    roles: response.roles,
    isAuthenticated: true,
    error: null,
    loading: false,
    initialized: true, // Make sure initialized is set to true
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthActions.logout, () => initialState),
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.registerSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null,
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
)

