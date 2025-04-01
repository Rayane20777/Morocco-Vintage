import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, of } from "rxjs"
import { environment } from "../../environments/environment"

interface AuthResponse {
  token: string
  username: string
  roles: { authority: string }[]
}

interface RegisterRequest {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  roles: string[]
  image?: File
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    console.log("Attempting login with:", { username, password })
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    const formData = new FormData()
    formData.append('username', registerData.username)
    formData.append('password', registerData.password)
    formData.append('email', registerData.email)
    formData.append('firstName', registerData.firstName)
    formData.append('lastName', registerData.lastName)
    formData.append('phoneNumber', registerData.phoneNumber)
    formData.append('roles', JSON.stringify(registerData.roles))
    
    if (registerData.image) {
      formData.append('image', registerData.image)
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, formData)
  }

  getStoredToken(): string | null {
    return localStorage.getItem("token")
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken()
  }

  // Add a logout method to the auth service
  logout(): Observable<any> {
    // If your backend requires a logout API call, uncomment this
    // return this.http.post<any>(`${this.apiUrl}/logout`, {});

    // If no backend call is needed, just return an observable that completes
    return of(null)
  }

  // Add a method to check if the user has admin role:
  isAdmin(): boolean {
    const rolesStr = localStorage.getItem("roles")
    if (!rolesStr) return false

    try {
      const roles = JSON.parse(rolesStr)
      return Array.isArray(roles) && roles.some((role) => role.authority === "ADMIN" || role.authority === "ROLE_ADMIN")
    } catch (e) {
      console.error("Error parsing roles:", e)
      return false
    }
  }
}

