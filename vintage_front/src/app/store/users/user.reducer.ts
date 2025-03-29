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

  // Get User
  on(UserActions.getUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.getUserSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    loading: false,
    error: null,
  })),

  on(UserActions.getUserFailure, (state, { error }) => ({
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

  // Update User
  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    selectedUser: state.selectedUser?.id === user.id ? user : state.selectedUser,
    loading: false,
    error: null,
  })),

  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
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
    selectedUser: state.selectedUser?.id === user.id ? user : state.selectedUser,
    loading: false,
    error: null,
  })),

  on(UserActions.updateUserStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update User Roles
  on(UserActions.updateUserRoles, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.updateUserRolesSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    selectedUser: state.selectedUser?.id === user.id ? user : state.selectedUser,
    loading: false,
    error: null,
  })),

  on(UserActions.updateUserRolesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Upload Profile Image
  on(UserActions.uploadProfileImage, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.uploadProfileImageSuccess, (state, { id, imageUrl }) => ({
    ...state,
    users: state.users.map((u) => (u.id === id ? { ...u, imageUrl } : u)),
    selectedUser: state.selectedUser?.id === id ? { ...state.selectedUser, imageUrl } : state.selectedUser,
    loading: false,
    error: null,
  })),

  on(UserActions.uploadProfileImageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete User
  on(UserActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter((u) => u.id !== id),
    selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
    loading: false,
    error: null,
  })),

  on(UserActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
)

