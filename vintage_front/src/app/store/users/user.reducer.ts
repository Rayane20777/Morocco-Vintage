import { createReducer, on } from "@ngrx/store"
import { UserActions } from "./user.actions"
import { initialUserState } from "./user.types"

export const userReducer = createReducer(
  initialUserState,

  // Load Users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null,
  })),

  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Select User
  on(UserActions.selectUser, (state, { id }) => ({
    ...state,
    selectedUser: state.users.find((user) => user.id === id) || null,
  })),

  on(UserActions.clearSelectedUser, (state) => ({
    ...state,
    selectedUser: null,
  })),

  // Update User Status
  on(UserActions.updateUserStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.updateUserStatusSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    loading: false,
    error: null,
  })),

  on(UserActions.updateUserStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
)

