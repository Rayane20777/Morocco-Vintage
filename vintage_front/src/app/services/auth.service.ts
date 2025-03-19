import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, of } from "rxjs"
import { environment } from "../../environments/environment"

interface AuthResponse {
  token: string
  username: string
  roles: { authority: string }[]
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

  register(email: string, password: string, username: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      email,
      password,
      username,
    })
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
}

