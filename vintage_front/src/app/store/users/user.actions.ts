import { createActionGroup, props, emptyProps } from "@ngrx/store"
import { User } from "./user.types"

export const UserActions = createActionGroup({
  source: "Users",
  events: {
    "Load Users": emptyProps(),
    "Load Users Success": props<{ users: User[] }>(),
    "Load Users Failure": props<{ error: string }>(),

    "Select User": props<{ id: string }>(),
    "Clear Selected User": emptyProps(),

    "Update User Status": props<{ id: string; active: boolean }>(),
    "Update User Status Success": props<{ user: User }>(),
    "Update User Status Failure": props<{ error: string }>(),
  },
})

