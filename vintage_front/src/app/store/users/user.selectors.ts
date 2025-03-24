import { createSelector, createFeatureSelector } from "@ngrx/store"
import { UserState } from "./user.types"

export const selectUserState = createFeatureSelector<UserState>("users")

export const selectUsers = createSelector(selectUserState, (state: UserState) => state.users)

export const selectUserLoading = createSelector(selectUserState, (state: UserState) => state.loading)

export const selectUserError = createSelector(selectUserState, (state: UserState) => state.error)

export const selectSelectedUser = createSelector(selectUserState, (state: UserState) => state.selectedUser)

