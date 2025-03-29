import { createActionGroup, props, emptyProps } from "@ngrx/store"
import { User } from "./user.types"

export const UserActions = createActionGroup({
  source: "Users",
  events: {
    // Load users
    "Load Users": emptyProps(),
    "Load Users Success": props<{ users: User[] }>(),
    "Load Users Failure": props<{ error: string }>(),

    // Get user by ID
    "Get User": props<{ id: string }>(),
    "Get User Success": props<{ user: User }>(),
    "Get User Failure": props<{ error: string }>(),

    // Select user
    "Select User": props<{ id: string }>(),
    "Clear Selected User": emptyProps(),

    // Update user
    "Update User": props<{ id: string; user: Partial<User> }>(),
    "Update User Success": props<{ user: User }>(),
    "Update User Failure": props<{ error: string }>(),

    // Update user status
    "Update User Status": props<{ id: string; active: boolean }>(),
    "Update User Status Success": props<{ user: User }>(),
    "Update User Status Failure": props<{ error: string }>(),

    // Update user roles
    "Update User Roles": props<{ id: string; roles: string[] }>(),
    "Update User Roles Success": props<{ user: User }>(),
    "Update User Roles Failure": props<{ error: string }>(),

    // Upload profile image
    "Upload Profile Image": props<{ id: string; image: File }>(),
    "Upload Profile Image Success": props<{ id: string; imageUrl: string }>(),
    "Upload Profile Image Failure": props<{ error: string }>(),

    // Delete user
    "Delete User": props<{ id: string }>(),
    "Delete User Success": props<{ id: string }>(),
    "Delete User Failure": props<{ error: string }>(),
  },
})

