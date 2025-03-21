import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { Store } from "@ngrx/store"
import * as AuthActions from "../../../store/auth/auth.actions"
import { selectAuthError, selectAuthLoading } from "../../../store/auth/auth.selectors"
import { Component, type OnInit } from "@angular/core"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  loading$ = this.store.select(selectAuthLoading)
  error$ = this.store.select(selectAuthError)

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.loginForm = this.fb.group({
      username: ["admin", Validators.required],
      password: ["admin", [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnInit() {
    // Additional initialization logic if needed
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value
      console.log("Submitting login form:", { username, password })

      // For testing admin access, log this information
      if (username === "admin") {
        console.log("Admin login attempt - make sure backend returns proper admin role")
      }

      this.store.dispatch(AuthActions.login({ username, password }))
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched()
      })
    }
  }
}

