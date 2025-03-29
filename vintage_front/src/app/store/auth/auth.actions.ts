import { createAction, props } from "@ngrx/store"
import { User } from "./auth.state"

export const login = createAction("[Auth] Login", props<{ username: string; password: string }>())

export const loginSuccess = createAction(
  "[Auth] Login Success",
  props<{
    user: any
    token: string
  }>(),
)

export const loginFailure = createAction("[Auth] Login Failure", props<{ error: string }>())

export const logout = createAction("[Auth] Logout")

export const register = createAction(
  "[Auth] Register",
  props<{
    username: string
    password: string
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    roles: string[]
  }>(),
)

export const registerSuccess = createAction("[Auth] Register Success", props<{ user: User; token: string }>())

export const registerFailure = createAction("[Auth] Register Failure", props<{ error: string }>())

export const initAuth = createAction("[Auth] Initialize Auth")
export const authInitialized = createAction("[Auth] Auth Initialized")

