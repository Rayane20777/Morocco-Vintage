import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import { environment } from "../../environments/environment"
import { User } from "../store/users/user.types"

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/admin/users`

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error("Error fetching users:", error)
        return throwError(() => new Error(error.message || "Failed to fetch users"))
      }),
    )
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching user ${id}:`, error)
        return throwError(() => new Error(error.message || "Failed to fetch user"))
      }),
    )
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    console.log('Updating user:', { id, user });
    const formData = new FormData();
    
    // Only append fields that have changed
    if (user.firstName) {
      formData.append('firstName', user.firstName);
      console.log('Appending firstName:', user.firstName);
    }
    if (user.lastName) {
      formData.append('lastName', user.lastName);
      console.log('Appending lastName:', user.lastName);
    }
    if (user.email) {
      formData.append('email', user.email);
      console.log('Appending email:', user.email);
    }
    if (user.phoneNumber) {
      formData.append('phoneNumber', user.phoneNumber);
      console.log('Appending phoneNumber:', user.phoneNumber);
    }
    if (user.active !== undefined) {
      formData.append('active', user.active.toString());
      console.log('Appending active:', user.active);
    }
    if (user.roles) {
      // Send each role as a separate form field
      user.roles.forEach((role, index) => {
        formData.append(`roles[${index}]`, role);
      });
      console.log('Appending roles:', user.roles);
    }
    if (user.image) {
      formData.append('image', user.image);
      console.log('Appending image:', user.image);
    }

    // Log the request details
    console.log('Sending PUT request to:', `${this.apiUrl}/${id}`);
    console.log('FormData contents:', {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phoneNumber: formData.get('phoneNumber'),
      active: formData.get('active'),
      roles: user.roles,
      image: formData.get('image') ? 'Image present' : 'No image'
    });
    
    return this.http.put<User>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError((error) => {
        console.error(`Error updating user ${id}:`, error);
        return throwError(() => new Error(error.message || "Failed to update user"));
      }),
    );
  }

  updateUserRoles(userId: string, roles: string[]): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/roles`, roles).pipe(
      catchError((error) => {
        console.error(`Error updating roles for user ${userId}:`, error)
        return throwError(() => new Error(error.message || "Failed to update user roles"))
      }),
    )
  }

  updateUserStatus(userId: string, active: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}/status`, { active }).pipe(
      catchError((error) => {
        console.error(`Error updating status for user ${userId}:`, error)
        return throwError(() => new Error(error.message || "Failed to update user status"))
      }),
    )
  }

  uploadProfileImage(userId: string, image: File): Observable<User> {
    const formData = new FormData()
    formData.append("image", image)
    return this.http.put<User>(`${this.apiUrl}/${userId}/profile-image`, formData).pipe(
      catchError((error) => {
        console.error(`Error uploading profile image for user ${userId}:`, error)
        return throwError(() => new Error(error.message || "Failed to upload profile image"))
      }),
    )
  }

  getProfileImageUrl(userId: string): string {
    return `${this.apiUrl}/${userId}/profile-image`
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
      catchError((error) => {
        console.error(`Error deleting user ${userId}:`, error)
        return throwError(() => new Error(error.message || "Failed to delete user"))
      }),
    )
  }
}

