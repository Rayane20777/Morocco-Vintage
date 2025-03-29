import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { map, catchError, switchMap } from "rxjs/operators"
import { UserActions } from "./user.actions"
import { UserService } from "../../services/user.service"

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(() =>
        this.userService.getAllUsers().pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) => of(UserActions.loadUsersFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getUser),
      switchMap(({ id }) =>
        this.userService.getUserById(id).pipe(
          map((user) => UserActions.getUserSuccess({ user })),
          catchError((error) => of(UserActions.getUserFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      switchMap(({ id, user }) =>
        this.userService.updateUser(id, user).pipe(
          map((updatedUser) => UserActions.updateUserSuccess({ user: updatedUser })),
          catchError((error) => of(UserActions.updateUserFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  updateUserStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserStatus),
      switchMap(({ id, active }) =>
        this.userService.updateUserStatus(id, active).pipe(
          map((user) => UserActions.updateUserStatusSuccess({ user })),
          catchError((error) => of(UserActions.updateUserStatusFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  updateUserRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserRoles),
      switchMap(({ id, roles }) =>
        this.userService.updateUserRoles(id, roles).pipe(
          map((user) => UserActions.updateUserRolesSuccess({ user })),
          catchError((error) => of(UserActions.updateUserRolesFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  uploadProfileImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.uploadProfileImage),
      switchMap(({ id, image }) =>
        this.userService.uploadProfileImage(id, image).pipe(
          map(() => {
            const imageUrl = this.userService.getProfileImageUrl(id)
            return UserActions.uploadProfileImageSuccess({ id, imageUrl })
          }),
          catchError((error) => of(UserActions.uploadProfileImageFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      switchMap(({ id }) =>
        this.userService.deleteUser(id).pipe(
          map(() => UserActions.deleteUserSuccess({ id })),
          catchError((error) => of(UserActions.deleteUserFailure({ error: error.message }))),
        ),
      ),
    ),
  )
}

