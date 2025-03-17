import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"

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

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        username: ["", Validators.required],
        first_name: ["", Validators.required],
        last_name: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        phone: ["", Validators.pattern("^[0-9]{10,12}$")],
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
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log("Register form submitted", this.registerForm.value)
      // Implement registration logic here
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registerForm.controls).forEach((key) => {
        const control = this.registerForm.get(key)
        control?.markAsTouched()
      })
    }
  }
}

