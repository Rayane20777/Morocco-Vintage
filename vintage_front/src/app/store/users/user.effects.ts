import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { map, catchError, switchMap, withLatestFrom } from "rxjs/operators"
import { Store } from "@ngrx/store"
import { UserActions } from "./user.actions"
import { selectAuthToken } from "../auth/auth.selectors"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { User } from "./user.types"
import { environment } from "../../../environments/environment"

@Injectable()
export class UserEffects {
  private apiUrl = `${environment.apiUrl}/admin/users`

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store,
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      withLatestFrom(this.store.select(selectAuthToken)),
      switchMap(([_, token]) => {
        const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)

        return this.http.get<User[]>(this.apiUrl, { headers }).pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) => {
            console.error("Error loading users:", error)
            return of(
              UserActions.loadUsersFailure({
                error: error.message || "Failed to load users",
              }),
            )
          }),
        )
      }),
    ),
  )

  updateUserStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserStatus),
      withLatestFrom(this.store.select(selectAuthToken)),
      switchMap(([action, token]) => {
        const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)

        return this.http.patch<User>(`${this.apiUrl}/${action.id}/status`, { active: action.active }, { headers }).pipe(
          map((user) => UserActions.updateUserStatusSuccess({ user })),
          catchError((error) => {
            console.error("Error updating user status:", error)
            return of(
              UserActions.updateUserStatusFailure({
                error: error.message || "Failed to update user status",
              }),
            )
          }),
        )
      }),
    ),
  )
}

