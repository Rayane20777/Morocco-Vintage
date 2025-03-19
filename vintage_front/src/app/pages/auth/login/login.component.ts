import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { Store } from "@ngrx/store"
import { map } from "rxjs/operators"
import * as AuthActions from "../../../store/auth/auth.actions"
import { selectAuthState } from "../../../store/auth/auth.selectors"
import { Component } from "@angular/core"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginForm: FormGroup
  loading$ = this.store.select(selectAuthState).pipe(map((state) => state.loading))
  error$ = this.store.select(selectAuthState).pipe(map((state) => state.error))

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.loginForm = this.fb.group({
      username: ["admin", Validators.required],
      password: ["admin", [Validators.required, Validators.minLength(6)]],
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value
      console.log("Submitting login form:", { username, password })
      this.store.dispatch(AuthActions.login({ username, password }))
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched()
      })
    }
  }
}

