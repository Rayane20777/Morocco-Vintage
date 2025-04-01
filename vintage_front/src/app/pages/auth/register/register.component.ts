import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { RouterLink, Router } from "@angular/router"
import { Store } from "@ngrx/store"
import * as AuthActions from "../../../store/auth/auth.actions"
import { selectAuthLoading, selectAuthError } from "../../../store/auth/auth.selectors"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  registerForm: FormGroup
  imagePreview: string | ArrayBuffer | null = null
  selectedImage: File | null = null
  loading$ = this.store.select(selectAuthLoading)
  error$ = this.store.select(selectAuthError)
  showSuccess = false

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        username: ["", [Validators.required, Validators.minLength(3)]],
        first_name: ["", Validators.required],
        last_name: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        phone: ["", Validators.pattern("^[0-9+]{10,15}$")],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirm_password: ["", Validators.required],
      },
      { validator: this.passwordMatchValidator },
    )
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get("password")?.value === g.get("confirm_password")?.value ? null : { mismatch: true }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      this.selectedImage = file
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value

      // Create the registration payload
      const registrationData = {
        username: formData.username,
        password: formData.password,
        firstName: formData.first_name,
        lastName: formData.last_name,
        email: formData.email,
        phoneNumber: formData.phone || "",
        roles: ["USER"],
        image: this.selectedImage || undefined
      }

      console.log("Registering user:", registrationData)

      // Dispatch the register action
      this.store.dispatch(
        AuthActions.register({
          username: registrationData.username,
          password: registrationData.password,
          email: registrationData.email,
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          phoneNumber: registrationData.phoneNumber,
          roles: registrationData.roles,
          image: registrationData.image
        }),
      )

      // Subscribe to loading and error to handle UI state
      this.loading$.subscribe((loading) => {
        if (!loading) {
          this.error$.subscribe((error) => {
            if (!error) {
              // Registration successful
              this.showSuccess = true
              setTimeout(() => {
                this.router.navigate(["/auth/login"])
              }, 2000)
            }
          })
        }
      })
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registerForm.controls).forEach((key) => {
        const control = this.registerForm.get(key)
        control?.markAsTouched()
      })
    }
  }
}

